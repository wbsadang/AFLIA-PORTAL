import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Send,
  Image as ImageIcon,
  Paperclip,
  Link as LinkIcon,
  Search,
  MessageSquare,
  Users,
  Building2,
  Home,
  Check,
  CheckCheck,
  FileText,
  Download,
  ExternalLink,
  ChevronLeft,
  Circle,
  Plus,
  Sparkles,
  Bot,
  ThumbsUp,
  Heart,
  Pin,
  Smile,
  Info,
} from 'lucide-react';
import { ChatAttachment, ChatMessage } from '../../types';

interface StaffChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Preset official agency assets for instant 1-click testing
const AGENCY_PRESETS = {
  images: [
    {
      name: 'AFLIA_Makati_HQ_Operations_Desk.png',
      size: '1.2 MB',
      type: 'image' as const,
      description: 'Makati Branch HQ Operations Suite',
      url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230f2b5c"/><circle cx="300" cy="180" r="100" fill="%231e3a8a"/><path d="M220 280 L300 130 L380 280 Z" fill="%23f5bf2b"/><text x="300" y="325" fill="%23ffffff" font-size="22" font-family="Georgia,serif" font-weight="bold" text-anchor="middle">AFLIA MAKATI BRANCH HQ</text><text x="300" y="355" fill="%23f5bf2b" font-size="14" font-family="sans-serif" font-weight="600" text-anchor="middle">Executive Operations Suite %26 Front Desk Station</text></svg>',
    },
    {
      name: 'Advisor_Recruitment_Seminar_Flyer.png',
      size: '890 KB',
      type: 'image' as const,
      description: 'Life Advisor Fast-Track Career Program',
      url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%2310235b"/><rect x="30" y="30" width="540" height="340" rx="16" fill="%2318357a" stroke="%23f5bf2b" stroke-width="3"/><text x="300" y="150" fill="%23f5bf2b" font-size="26" font-family="Georgia,serif" font-weight="bold" text-anchor="middle">AFLIA TALENT ACQUISITION</text><text x="300" y="200" fill="%23ffffff" font-size="16" font-family="sans-serif" text-anchor="middle">Financial Advisor Fast-Track Career Program 2026</text><text x="300" y="250" fill="%2393c5fd" font-size="14" font-family="sans-serif" text-anchor="middle">Lead: Merelil Mitra · Recruitment Officer</text></svg>',
    },
    {
      name: 'Makati_Biometric_Clock_Station.png',
      size: '1.4 MB',
      type: 'image' as const,
      description: 'Makati HQ Biometric Time Station',
      url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230b1c3d"/><rect x="180" y="80" width="240" height="240" rx="20" fill="%231e3a8a" stroke="%23f5bf2b" stroke-width="4"/><circle cx="300" cy="180" r="45" fill="%2310b981"/><text x="300" y="186" fill="%23ffffff" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle">VERIFIED</text><text x="300" y="270" fill="%23ffffff" font-size="16" font-family="sans-serif" font-weight="bold" text-anchor="middle">BIOMETRIC TERMINAL 01</text><text x="300" y="355" fill="%23f5bf2b" font-size="13" font-family="sans-serif" text-anchor="middle">Makati Branch Agency Lobby</text></svg>',
    },
  ],
  files: [
    {
      name: 'AFLIA_Staff_Handbook_and_Attendance_Policy_2026.pdf',
      size: '1.8 MB',
      type: 'file' as const,
      url: 'data:text/plain;charset=utf-8,ALPINE%20FALCON%20LIFE%20INSURANCE%20AGENCY%2C%20INC.%0AOFFICIAL%20STAFF%20HANDBOOK%20%26%20CODE%20OF%20CONDUCT%0A%0A1.%20Working%20Hours%3A%2008%3A00%20AM%20-%2005%3A00%20PM%0A2.%20Grace%20Period%3A%2010%20minutes%0A3.%20Work%20Arrangements%3A%20On-Site%20at%20Makati%20HQ%20and%20Approved%20Telecommuting%0A4.%20Executive%20Director%3A%20Dulce%20Rhea%20Buling%2C%20CEO%0A5.%20Recruitment%3A%20Merelil%20Mitra%0A6.%20Operations%3A%20Allen%20Mae%20Balangitan-Del%20Sol',
    },
    {
      name: 'Recruitment_Candidate_Endorsement_Roster_Q4.xlsx',
      size: '420 KB',
      type: 'file' as const,
      url: 'data:text/csv;charset=utf-8,Candidate Name,Position Applied,Interview Date,Interviewer,Status%0AMerelil Mitra,Recruitment Officer,2026-09-30,Dulce Rhea Buling,Active%0AAllen Mae Del Sol,GOA Admin,2026-09-30,Dulce Rhea Buling,Active%0AApplicant 1,Life Advisor,2026-10-02,Merelil Mitra,Scheduled%0AApplicant 2,Underwriting Assistant,2026-10-03,Merelil Mitra,Screening',
    },
    {
      name: 'Makati_Branch_Executive_Operations_Report_Sept.pdf',
      size: '2.4 MB',
      type: 'file' as const,
      url: 'data:text/plain;charset=utf-8,ALPINE%20FALCON%20LIFE%20INSURANCE%20AGENCY%2C%20INC.%0AMAKATI%20BRANCH%20MONTHLY%20OPERATIONS%20SUMMARY%0AMonth%3A%20September%202026%0AOverall%20Attendance%20Rate%3A%2098.2%25%0APrepared%20by%3A%20Allen%20Mae%20Balangitan-Del%20Sol%2C%20GOA%20%2F%20Admin%0AApproved%20by%3A%20Dulce%20Rhea%20Buling%2C%20CEO',
    },
  ],
  links: [
    {
      name: 'AFLIA Executive Google Meet Room',
      url: 'https://meet.google.com/aflia-executive-branch',
    },
    {
      name: 'Insurance Commission Statutory Guidelines Portal',
      url: 'https://insurance.gov.ph',
    },
    {
      name: 'AFLIA Shared Operations & Policyholder Google Drive',
      url: 'https://drive.google.com/drive/folders/aflia-makati-hq',
    },
    {
      name: 'AFLIA Life Advisor Licensing Portal',
      url: 'https://aflia.com/recruitment-licensing',
    },
  ],
};

export const StaffChatModal: React.FC<StaffChatModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    users,
    chatChannels,
    chatMessages,
    activeChannelId,
    setActiveChannelId,
    sendChatMessage,
    openDirectMessageWithUser,
    markChannelAsRead,
    addChatReaction,
  } = useApp();

  const [messageInput, setMessageInput] = useState('');
  const [stagedAttachments, setStagedAttachments] = useState<ChatAttachment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showPresetsDrawer, setShowPresetsDrawer] = useState<'none' | 'images' | 'files' | 'links'>('none');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('chat');
  const [isTyping, setIsTyping] = useState<string | null>(null);
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Mark active channel as read whenever channel or messages change
  useEffect(() => {
    if (isOpen && activeChannelId) {
      markChannelAsRead(activeChannelId);
    }
  }, [isOpen, activeChannelId, chatMessages.length]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeChannelId, isOpen, isTyping]);

  if (!isOpen || !currentUser) return null;

  // Active channel
  const currentChannel =
    chatChannels.find((c) => c.id === activeChannelId) || chatChannels[0];

  // Messages in active channel
  const channelMessages = chatMessages.filter(
    (m) => m.channelId === currentChannel?.id
  );

  // Filter channels & DMs
  const publicChannels = chatChannels.filter((c) => c.type === 'channel');
  const dmChannels = chatChannels.filter(
    (c) => c.type === 'dm' && c.participantIds.includes(currentUser.id)
  );

  // Filter staff for direct messaging directory
  const availableStaff = users.filter((u) => u.id !== currentUser.id);

  // Determine participant info for DMs
  const getDMRecipient = () => {
    if (!currentChannel || currentChannel.type !== 'dm') return null;
    const otherId = currentChannel.participantIds.find((id) => id !== currentUser.id);
    return users.find((u) => u.id === otherId);
  };
  const dmRecipient = getDMRecipient();

  // Send message handler with optional smart staff reply
  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() && stagedAttachments.length === 0) return;

    const sentContent = messageInput.trim();
    const sentAttachments = stagedAttachments.length > 0 ? [...stagedAttachments] : undefined;
    const channelIdToUse = currentChannel.id;
    const recipientUser = dmRecipient;

    sendChatMessage(
      channelIdToUse,
      sentContent,
      sentAttachments
    );

    setMessageInput('');
    setStagedAttachments([]);
    setShowPresetsDrawer('none');

    // Simulated Smart Reply feature
    if (autoReplyEnabled) {
      // 1. If Admin / CEO messages Merelil Mitra
      if (currentUser.role === 'admin' && recipientUser?.id === 'user-merelil') {
        setTimeout(() => {
          setIsTyping('Merelil Mitra');
        }, 500);

        setTimeout(() => {
          setIsTyping(null);
          let replyText = 'Received, CEO Dulce! Checking the candidate roster now. All initial interview schedules are prepared.';
          if (sentAttachments?.some((a) => a.type === 'image')) {
            replyText = 'Thank you for the image, Ma\'am Rhea! Added to our recruitment orientation material.';
          } else if (sentAttachments?.some((a) => a.type === 'file')) {
            replyText = 'File downloaded and confirmed, Ma\'am Rhea. Archiving with the talent acquisition endorsements.';
          } else if (sentAttachments?.some((a) => a.type === 'link')) {
            replyText = 'Accessed the link, Ma\'am Rhea! Opening the portal now.';
          }
          sendChatMessage(channelIdToUse, replyText);
        }, 2000);
      }

      // 2. If Admin / CEO messages Allen Mae Balangitan-Del Sol
      else if (currentUser.role === 'admin' && recipientUser?.id === 'user-allen') {
        setTimeout(() => {
          setIsTyping('Allen Mae Balangitan-Del Sol');
        }, 500);

        setTimeout(() => {
          setIsTyping(null);
          let replyText = 'Noted with thanks, Ma\'am Rhea! Makati branch desks and daily attendance logs are synchronized.';
          if (sentAttachments?.some((a) => a.type === 'image')) {
            replyText = 'Received the image, Ma\'am Rhea! Verifying against Makati branch facilities.';
          } else if (sentAttachments?.some((a) => a.type === 'file')) {
            replyText = 'Document received and printed for the administrative operations binder, Ma\'am Rhea!';
          } else if (sentAttachments?.some((a) => a.type === 'link')) {
            replyText = 'Link confirmed, Ma\'am Rhea. Joining / syncing branch records right now.';
          }
          sendChatMessage(channelIdToUse, replyText);
        }, 2000);
      }

      // 3. If Staff messages Admin / CEO Dulce Rhea Buling
      else if (currentUser.role !== 'admin' && recipientUser?.role === 'admin') {
        setTimeout(() => {
          setIsTyping('Dulce Rhea Buling (CEO)');
        }, 500);

        setTimeout(() => {
          setIsTyping(null);
          sendChatMessage(
            channelIdToUse,
            `Thank you for the update, ${currentUser.fullName.split(' ')[0]}. Proceed as discussed and ensure attendance logs are accurate.`
          );
        }, 2000);
      }
    }
  };

  // Image upload handler (converts to base64 Data URL)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const sizeStr = `${(file.size / 1024).toFixed(0)} KB`;
      const newAtt: ChatAttachment = {
        id: `att-img-${Date.now()}`,
        type: 'image',
        name: file.name,
        url: dataUrl,
        size: sizeStr,
        mimeType: file.type,
      };
      setStagedAttachments((prev) => [...prev, newAtt]);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const sizeStr =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${(file.size / 1024).toFixed(0)} KB`;

      const newAtt: ChatAttachment = {
        id: `att-file-${Date.now()}`,
        type: 'file',
        name: file.name,
        url: dataUrl,
        size: sizeStr,
        mimeType: file.type,
      };
      setStagedAttachments((prev) => [...prev, newAtt]);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Link insertion handler
  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl.trim()) return;

    const formattedUrl = linkUrl.startsWith('http')
      ? linkUrl
      : `https://${linkUrl}`;
    const name = linkTitle.trim() || linkUrl.trim();

    const newAtt: ChatAttachment = {
      id: `att-link-${Date.now()}`,
      type: 'link',
      name,
      url: formattedUrl,
    };

    setStagedAttachments((prev) => [...prev, newAtt]);
    setLinkUrl('');
    setLinkTitle('');
    setShowLinkModal(false);
  };

  // Attach preset item
  const attachPreset = (att: { name: string; url: string; size?: string; type: 'image' | 'file' | 'link' }) => {
    const newAtt: ChatAttachment = {
      id: `att-preset-${Date.now()}`,
      ...att,
    };
    setStagedAttachments((prev) => [...prev, newAtt]);
    setShowPresetsDrawer('none');
  };

  // Remove staged attachment
  const removeStagedAttachment = (id: string) => {
    setStagedAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full h-[90vh] border border-slate-200 overflow-hidden flex flex-col">
        {/* TOP BAR */}
        <div className="px-5 py-3.5 bg-[#0f2b5c] text-white flex items-center justify-between border-b-2 border-amber-500 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                  AFLIA Agency Staff Communication Hub
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                  Live Encrypted Sync
                </span>
              </div>
              <p className="text-[11px] text-amber-200/90 hidden sm:block">
                Direct messaging with Merelil Mitra, Allen Mae Balangitan-Del Sol &amp; CEO Dulce Rhea Buling
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Auto-Reply simulation toggle */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-[11px] text-amber-200">
              <Bot className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulate Staff Replies:</span>
              <button
                type="button"
                onClick={() => setAutoReplyEnabled(!autoReplyEnabled)}
                className={`font-bold uppercase text-[10px] px-1.5 py-0.5 rounded cursor-pointer ${
                  autoReplyEnabled ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
                }`}
              >
                {autoReplyEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MAIN BODY: 2 PANES */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* LEFT SIDEBAR: CHANNELS & DIRECT MESSAGES */}
          <div
            className={`w-full md:w-80 border-r border-slate-200 bg-slate-50 flex flex-col shrink-0 ${
              mobileView === 'chat' ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Search */}
            <div className="p-3 border-b border-slate-200 bg-white">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search channels or staff..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2b5c]"
                />
              </div>
            </div>

            {/* Conversation Lists */}
            <div className="flex-1 overflow-y-auto p-2 space-y-4 text-xs">
              {/* Public Agency Channels */}
              <div>
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Agency Channels</span>
                  <span className="text-amber-700 font-semibold">Broadcast</span>
                </div>
                <div className="space-y-0.5 mt-1">
                  {publicChannels.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => {
                        setActiveChannelId(channel.id);
                        setMobileView('chat');
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                        activeChannelId === channel.id
                          ? 'bg-[#0f2b5c] text-white font-bold shadow-xs'
                          : 'text-slate-700 hover:bg-slate-200/60'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={activeChannelId === channel.id ? 'text-amber-400 font-mono' : 'text-slate-400 font-mono'}>
                          #
                        </span>
                        <span className="truncate">{channel.name}</span>
                      </div>
                      {channel.lastMessageTime && (
                        <span
                          className={`text-[10px] shrink-0 ${
                            activeChannelId === channel.id ? 'text-amber-200' : 'text-slate-400'
                          }`}
                        >
                          {channel.lastMessageTime}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Messages Directory */}
              <div>
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Direct Messages</span>
                  <span className="text-[10px] text-slate-400">Official Staff</span>
                </div>
                <div className="space-y-0.5 mt-1">
                  {availableStaff.map((staff) => {
                    const isSelected = dmRecipient?.id === staff.id;
                    return (
                      <button
                        key={staff.id}
                        onClick={() => {
                          openDirectMessageWithUser(staff.id);
                          setMobileView('chat');
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#0f2b5c] text-white font-bold shadow-xs'
                            : 'text-slate-700 hover:bg-slate-200/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <div className="relative shrink-0">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[10px] ${
                                isSelected
                                  ? 'bg-amber-400 text-slate-950 font-black'
                                  : staff.role === 'admin'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-blue-100 text-[#0f2b5c]'
                              }`}
                            >
                              {staff.avatarInitials}
                            </div>
                            <span
                              className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-2 ${
                                isSelected ? 'ring-[#0f2b5c]' : 'ring-white'
                              } ${
                                staff.currentArrangement === 'ON_SITE'
                                  ? 'bg-emerald-500'
                                  : 'bg-amber-500'
                              }`}
                              title={
                                staff.currentArrangement === 'ON_SITE'
                                  ? 'On-Site at Makati HQ'
                                  : 'Active WFH'
                              }
                            />
                          </div>

                          <div className="truncate">
                            <div className="truncate font-semibold leading-tight">
                              {staff.fullName}
                            </div>
                            <div
                              className={`text-[10px] truncate ${
                                isSelected ? 'text-amber-200' : 'text-slate-400'
                              }`}
                            >
                              {staff.position}
                            </div>
                          </div>
                        </div>

                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : staff.currentArrangement === 'ON_SITE'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-amber-50 text-amber-800'
                          }`}
                        >
                          {staff.currentArrangement}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Current Active Persona Info */}
            <div className="p-3 border-t border-slate-200 bg-white flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <div className="w-6 h-6 rounded bg-[#0f2b5c] text-amber-300 flex items-center justify-center font-bold text-[10px]">
                  {currentUser.avatarInitials}
                </div>
                <div className="truncate">
                  <span className="font-bold text-[#0f2b5c] truncate block">
                    {currentUser.fullName}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate block">
                    {currentUser.position}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR: ACTIVE CHAT CONVERSATION */}
          <div
            className={`flex-1 flex flex-col bg-white overflow-hidden ${
              mobileView === 'list' ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Conversation Header */}
            <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-white shadow-xs shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileView('list')}
                  className="md:hidden p-1.5 -ml-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-[#0f2b5c] text-sm sm:text-base flex items-center gap-1.5">
                      {currentChannel.type === 'channel' ? (
                        <>
                          <span className="text-amber-600 font-mono">#</span>
                          <span>{currentChannel.name}</span>
                        </>
                      ) : (
                        <>
                          <span>{dmRecipient?.fullName || currentChannel.name}</span>
                        </>
                      )}
                    </h4>

                    {dmRecipient && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" />
                        <span>
                          {dmRecipient.currentArrangement === 'ON_SITE'
                            ? 'On-Site HQ'
                            : 'Remote WFH'}
                        </span>
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 truncate">
                    {currentChannel.type === 'channel'
                      ? currentChannel.description
                      : `${dmRecipient?.position} · ${dmRecipient?.department}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPresetsDrawer(showPresetsDrawer === 'none' ? 'images' : 'none')}
                  className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-amber-400 bg-amber-50 text-amber-900 hover:bg-amber-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Choose from quick official agency photos, files and links"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden sm:inline">Agency Presets</span>
                </button>
              </div>
            </div>

            {/* PRESETS QUICK DRAWER */}
            {showPresetsDrawer !== 'none' && (
              <div className="bg-amber-50/90 border-b border-amber-200 p-3 animate-in slide-in-from-top-2 duration-150 shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Quick Attach Official Agency Media:
                    </span>
                    <div className="flex gap-1 text-[11px]">
                      <button
                        onClick={() => setShowPresetsDrawer('images')}
                        className={`px-2 py-0.5 rounded-md font-bold cursor-pointer ${
                          showPresetsDrawer === 'images' ? 'bg-amber-600 text-white' : 'bg-white text-slate-700'
                        }`}
                      >
                        📸 Photos
                      </button>
                      <button
                        onClick={() => setShowPresetsDrawer('files')}
                        className={`px-2 py-0.5 rounded-md font-bold cursor-pointer ${
                          showPresetsDrawer === 'files' ? 'bg-amber-600 text-white' : 'bg-white text-slate-700'
                        }`}
                      >
                        📄 Files
                      </button>
                      <button
                        onClick={() => setShowPresetsDrawer('links')}
                        className={`px-2 py-0.5 rounded-md font-bold cursor-pointer ${
                          showPresetsDrawer === 'links' ? 'bg-amber-600 text-white' : 'bg-white text-slate-700'
                        }`}
                      >
                        🔗 Links
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPresetsDrawer('none')}
                    className="text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Images Presets */}
                {showPresetsDrawer === 'images' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {AGENCY_PRESETS.images.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => attachPreset(item)}
                        className="p-2 bg-white rounded-xl border border-amber-200 hover:border-amber-500 hover:shadow-xs transition-all text-left flex items-center gap-2 cursor-pointer"
                      >
                        <ImageIcon className="w-4 h-4 text-amber-600 shrink-0" />
                        <div className="truncate">
                          <div className="font-bold text-xs text-slate-800 truncate">{item.name}</div>
                          <div className="text-[10px] text-slate-500">{item.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Files Presets */}
                {showPresetsDrawer === 'files' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {AGENCY_PRESETS.files.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => attachPreset(item)}
                        className="p-2 bg-white rounded-xl border border-blue-200 hover:border-blue-500 hover:shadow-xs transition-all text-left flex items-center gap-2 cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                        <div className="truncate">
                          <div className="font-bold text-xs text-slate-800 truncate">{item.name}</div>
                          <div className="text-[10px] text-slate-500">{item.size} · Official Document</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Links Presets */}
                {showPresetsDrawer === 'links' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {AGENCY_PRESETS.links.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => attachPreset({ ...item, type: 'link' })}
                        className="p-2 bg-white rounded-xl border border-emerald-200 hover:border-emerald-500 hover:shadow-xs transition-all text-left flex items-center gap-2 cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div className="truncate">
                          <div className="font-bold text-xs text-slate-800 truncate">{item.name}</div>
                          <div className="text-[10px] text-slate-500 truncate">{item.url}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* MESSAGES STREAM */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
              {channelMessages.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <MessageSquare className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
                  <p className="font-semibold text-sm text-slate-600">
                    No messages in this conversation yet.
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Send an announcement, attach an image, share an official document or link below.
                  </p>
                </div>
              ) : (
                channelMessages.map((msg) => {
                  const isMe = msg.senderId === currentUser.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 max-w-[88%] sm:max-w-[78%] ${
                        isMe ? 'ml-auto flex-row-reverse' : ''
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center font-bold text-xs shadow-xs ${
                          isMe
                            ? 'bg-[#0f2b5c] text-amber-300 ring-2 ring-amber-400/30'
                            : 'bg-white border border-slate-200 text-[#0f2b5c]'
                        }`}
                      >
                        {msg.senderInitials}
                      </div>

                      {/* Speech Bubble */}
                      <div className="flex flex-col space-y-1">
                        <div
                          className={`flex items-center gap-2 text-[10px] text-slate-400 ${
                            isMe ? 'justify-end' : ''
                          }`}
                        >
                          <span className="font-bold text-slate-700">{msg.senderName}</span>
                          <span>•</span>
                          <span>{msg.senderRole}</span>
                          <span>•</span>
                          <span>{msg.time}</span>
                        </div>

                        <div
                          className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs relative group ${
                            isMe
                              ? 'bg-[#0f2b5c] text-white rounded-tr-none'
                              : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                          }`}
                        >
                          {/* Text content with auto-detected URLs */}
                          {msg.content && (
                            <p className="whitespace-pre-wrap select-text leading-relaxed">
                              {msg.content}
                            </p>
                          )}

                          {/* Attachments rendering */}
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="mt-2.5 space-y-2">
                              {msg.attachments.map((att) => (
                                <div key={att.id}>
                                  {/* 1. Image Attachment */}
                                  {att.type === 'image' && (
                                    <div className="rounded-xl overflow-hidden border border-slate-200/50 bg-black/10">
                                      <img
                                        src={att.url}
                                        alt={att.name}
                                        onClick={() => setLightboxImage(att.url)}
                                        className="max-h-60 w-auto rounded-lg object-contain cursor-pointer hover:opacity-95 transition-opacity"
                                      />
                                      <div className="px-2.5 py-1.5 text-[10px] flex items-center justify-between text-slate-400 bg-slate-900/40">
                                        <span className="truncate text-white font-medium">{att.name}</span>
                                        {att.size && <span>{att.size}</span>}
                                      </div>
                                    </div>
                                  )}

                                  {/* 2. File Attachment */}
                                  {att.type === 'file' && (
                                    <div
                                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 ${
                                        isMe
                                          ? 'bg-white/10 border-white/20 text-white'
                                          : 'bg-slate-50 border-slate-200 text-slate-800'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 truncate">
                                        <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                                          <FileText className="w-4 h-4" />
                                        </div>
                                        <div className="truncate text-left">
                                          <div className="font-bold text-[11px] truncate">
                                            {att.name}
                                          </div>
                                          {att.size && (
                                            <div className="text-[10px] opacity-70">
                                              {att.size} · Official Document
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      <a
                                        href={att.url}
                                        download={att.name}
                                        className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                                          isMe
                                            ? 'hover:bg-white/20 text-amber-300'
                                            : 'hover:bg-slate-200 text-[#0f2b5c]'
                                        }`}
                                        title="Download file"
                                      >
                                        <Download className="w-4 h-4" />
                                      </a>
                                    </div>
                                  )}

                                  {/* 3. Link Attachment */}
                                  {att.type === 'link' && (
                                    <a
                                      href={att.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                                        isMe
                                          ? 'bg-white/10 border-white/20 hover:bg-white/15 text-white'
                                          : 'bg-blue-50/70 border-blue-200 hover:bg-blue-100/70 text-[#0f2b5c]'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 truncate text-left">
                                        <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-600 shrink-0">
                                          <ExternalLink className="w-4 h-4" />
                                        </div>
                                        <div className="truncate">
                                          <div className="font-bold text-[11px] truncate">
                                            {att.name}
                                          </div>
                                          <div className="text-[10px] opacity-70 truncate">
                                            {att.url}
                                          </div>
                                        </div>
                                      </div>
                                      <ExternalLink className="w-3.5 h-3.5 opacity-60 shrink-0" />
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Quick Reactions Bar on Message */}
                          <div className="flex items-center gap-1 mt-2 pt-1 border-t border-white/10">
                            {['👍', '❤️', '👏', '📌'].map((emoji) => {
                              const reaction = msg.reactions?.find((r) => r.emoji === emoji);
                              const hasReacted = reaction?.userIds.includes(currentUser.id);
                              return (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => addChatReaction(msg.id, emoji)}
                                  className={`px-1.5 py-0.5 rounded text-[11px] transition-all cursor-pointer flex items-center gap-0.5 ${
                                    hasReacted
                                      ? 'bg-amber-400 text-slate-950 font-bold scale-105'
                                      : isMe
                                      ? 'hover:bg-white/20 text-white/80'
                                      : 'hover:bg-slate-100 text-slate-600'
                                  }`}
                                  title={`React with ${emoji}`}
                                >
                                  <span>{emoji}</span>
                                  {reaction && reaction.count > 0 && (
                                    <span className="text-[10px] ml-0.5 font-bold">{reaction.count}</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Read tick */}
                        {isMe && (
                          <div className="text-[10px] text-slate-400 text-right flex items-center justify-end gap-1">
                            <span>Delivered</span>
                            <CheckCheck className="w-3.5 h-3.5 text-blue-500 inline" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-slate-500 italic py-1 animate-pulse">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[10px]">
                    ...
                  </div>
                  <span>{isTyping} is replying...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* STAGED ATTACHMENTS TRAY */}
            {stagedAttachments.length > 0 && (
              <div className="px-4 py-2 bg-amber-50/80 border-t border-amber-200 flex flex-wrap items-center gap-2 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  Ready to send:
                </span>
                {stagedAttachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-xs shadow-xs"
                  >
                    {att.type === 'image' && <ImageIcon className="w-3.5 h-3.5 text-amber-600" />}
                    {att.type === 'file' && <Paperclip className="w-3.5 h-3.5 text-blue-600" />}
                    {att.type === 'link' && <LinkIcon className="w-3.5 h-3.5 text-emerald-600" />}
                    <span className="font-semibold text-slate-800 text-[11px] max-w-[140px] truncate">
                      {att.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeStagedAttachment(att.id)}
                      className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* INPUT CONTROLS BAR */}
            <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-slate-200 bg-white shrink-0">
              <div className="flex items-center gap-2">
                {/* Hidden File Inputs for real computer upload */}
                <input
                  type="file"
                  ref={imageInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                  className="hidden"
                />

                {/* Attachment Action Buttons */}
                <div className="flex items-center gap-1">
                  {/* Attach Image from device */}
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="p-2 rounded-xl text-slate-500 hover:text-[#0f2b5c] hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Upload Image from your device (PNG, JPG)"
                  >
                    <ImageIcon className="w-4 h-4 text-amber-600" />
                  </button>

                  {/* Attach File from device */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-xl text-slate-500 hover:text-[#0f2b5c] hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Upload Document / File (PDF, DOC, XLS, CSV)"
                  >
                    <Paperclip className="w-4 h-4 text-blue-600" />
                  </button>

                  {/* Insert Link */}
                  <button
                    type="button"
                    onClick={() => setShowLinkModal(true)}
                    className="p-2 rounded-xl text-slate-500 hover:text-[#0f2b5c] hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Share Web Link / Google Drive / Meeting"
                  >
                    <LinkIcon className="w-4 h-4 text-emerald-600" />
                  </button>
                </div>

                {/* Text Message Input */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={`Message ${
                      currentChannel.type === 'channel'
                        ? `#${currentChannel.name}`
                        : dmRecipient?.fullName || 'staff'
                    }...`}
                    className="w-full pl-4 pr-3 py-2.5 text-xs border border-slate-300 rounded-2xl focus:ring-2 focus:ring-[#0f2b5c] focus:border-[#0f2b5c] outline-none"
                  />
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!messageInput.trim() && stagedAttachments.length === 0}
                  className={`p-2.5 sm:px-4 sm:py-2.5 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    !messageInput.trim() && stagedAttachments.length === 0
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-[#0f2b5c] hover:bg-[#153a7a] text-white shadow-md active:scale-95'
                  }`}
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* INSERT LINK MODAL */}
      {showLinkModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-bold text-sm text-[#0f2b5c]">
                <LinkIcon className="w-4 h-4 text-emerald-600" />
                <span>Share Web Link</span>
              </div>
              <button
                onClick={() => setShowLinkModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLink} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Destination URL
                </label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#0f2b5c]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Link Title (Optional)
                </label>
                <input
                  type="text"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  placeholder="e.g. Q4 Candidate Assessment Sheet"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#0f2b5c]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0f2b5c] text-white font-bold rounded-lg shadow-sm hover:bg-[#153a7a] cursor-pointer"
                >
                  Add Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IMAGE LIGHTBOX MODAL */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md cursor-pointer animate-in fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={lightboxImage}
              alt="Enlarged attachment"
              className="max-h-[85vh] w-auto rounded-2xl shadow-2xl object-contain border border-white/20"
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
