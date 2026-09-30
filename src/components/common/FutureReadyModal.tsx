import React from 'react';
import {
  X,
  Sparkles,
  CreditCard,
  Clock,
  Briefcase,
  Receipt,
  Megaphone,
  FileCheck,
  TrendingUp,
  Calendar,
  Smartphone,
  Mail,
  ShieldCheck,
} from 'lucide-react';

interface FutureReadyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FutureReadyModal: React.FC<FutureReadyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const modules = [
    {
      title: 'Automated Payroll Integration',
      desc: 'Seamless export of bi-weekly attendance, late deductions, and undertime calculations directly into Philippine banking & payroll engines.',
      icon: <CreditCard className="w-5 h-5 text-emerald-600" />,
      status: 'API Architecture Ready',
    },
    {
      title: 'Overtime & Night Differential Requests',
      desc: 'Pre-approved OT filing with supervisor sign-off, multiplier rate computing, and emergency weekend policy clearance.',
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      status: 'Schema Compatible',
    },
    {
      title: 'Official Business (OB) Slip Pass',
      desc: 'Field client visits, insurance commission meetings, and off-site underwriting inspections tracking with GPS verification.',
      icon: <Briefcase className="w-5 h-5 text-blue-600" />,
      status: 'Schema Compatible',
    },
    {
      title: 'Expense & Travel Reimbursement',
      desc: 'Digital receipt capture, travel allowance claim workflow, and agency financial audit trails.',
      icon: <Receipt className="w-5 h-5 text-purple-600" />,
      status: 'Data Flow Mapped',
    },
    {
      title: 'Agency Internal Announcements & Memos',
      desc: 'Branch manager broadcasts, compliance advisories, and sales quota celebration banners.',
      icon: <Megaphone className="w-5 h-5 text-rose-600" />,
      status: 'Channel Provisioned',
    },
    {
      title: 'Performance & Quota Monitoring',
      desc: 'KPI dashboards tracking policyholder retention, new life premium sales, and attendance reliability ratings.',
      icon: <TrendingUp className="w-5 h-5 text-indigo-600" />,
      status: 'Modular Extension',
    },
    {
      title: 'Google Calendar & Email Notifications',
      desc: 'Automated calendar sync for approved leave dates and direct SMTP/Workspace mail dispatch for approval slips.',
      icon: <Mail className="w-5 h-5 text-teal-600" />,
      status: 'Connector Ready',
    },
    {
      title: 'Mobile PWA & Biometric Sync',
      desc: 'Progressive Web Application installable to iOS and Android home screens with offline attendance caching.',
      icon: <Smartphone className="w-5 h-5 text-cyan-600" />,
      status: 'Responsive Ready',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-[#0f2b5c] text-white flex items-center justify-between border-b-2 border-amber-500">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                AFLIA Scalable Architecture & Future Modules
              </h3>
              <p className="text-xs text-amber-200/90">
                Enterprise Modular Design for Alpine Falcon Life Insurance Agency, Inc.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs text-blue-950 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Enterprise Architectural Separation:</span>
              <p className="mt-0.5 text-slate-600 leading-relaxed">
                The portal strictly separates attendance records, work arrangement approvals, leave logs, and audit trails. This scalable decoupling guarantees future integrations like payroll and official business can plug into the existing schema without rewriting core business logic.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {modules.map((m, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-xl bg-white shadow-xs border border-slate-200">
                      {m.icon}
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      {m.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-[#0f2b5c]">{m.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0f2b5c] text-white rounded-xl text-xs font-bold hover:bg-[#153a7a]"
          >
            Close Roadmap
          </button>
        </div>
      </div>
    </div>
  );
};
