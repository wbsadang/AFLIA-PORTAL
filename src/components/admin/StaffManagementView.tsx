import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, WorkArrangement } from '../../types';
import {
  Users,
  UserPlus,
  Edit2,
  Power,
  Search,
  Mail,
  Phone,
  Briefcase,
  Shield,
  Building2,
  Home,
  CheckCircle2,
  X,
} from 'lucide-react';

export const StaffManagementView: React.FC = () => {
  const { users, addStaff, updateStaff, toggleStaffStatus } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  // New staff form state
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newStaffId, setNewStaffId] = useState('');
  const [newPosition, setNewPosition] = useState('');
  const [newDepartment, setNewDepartment] = useState('Underwriting & Risk Assessment');
  const [newRegularSchedule, setNewRegularSchedule] = useState('08:00 - 17:00 (Mon-Fri)');
  const [newDefaultArrangement, setNewDefaultArrangement] = useState<WorkArrangement>('ON_SITE');

  // Edit staff form state
  const [editFullName, setEditFullName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editPosition, setEditPosition] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editSchedule, setEditSchedule] = useState('');
  const [editDefaultArrangement, setEditDefaultArrangement] = useState<WorkArrangement>('ON_SITE');
  const [editCurrentArrangement, setEditCurrentArrangement] = useState<WorkArrangement>('ON_SITE');

  const openEditModal = (u: User) => {
    setEditUser(u);
    setEditFullName(u.fullName);
    setEditEmail(u.email);
    setEditPhone(u.phone);
    setEditPosition(u.position);
    setEditDepartment(u.department);
    setEditSchedule(u.regularSchedule);
    setEditDefaultArrangement(u.defaultArrangement);
    setEditCurrentArrangement(u.currentArrangement);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;

    updateStaff(editUser.id, {
      fullName: editFullName,
      email: editEmail,
      phone: editPhone,
      position: editPosition,
      department: editDepartment,
      regularSchedule: editSchedule,
      defaultArrangement: editDefaultArrangement,
      currentArrangement: editCurrentArrangement,
    });

    setEditUser(null);
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newEmail || !newStaffId) return;

    addStaff({
      fullName: newFullName,
      email: newEmail,
      phone: newPhone || '+63 900 000 0000',
      staffId: newStaffId,
      role: 'staff',
      position: newPosition || 'Associate Financial Underwriter',
      department: newDepartment,
      regularSchedule: newRegularSchedule,
      defaultArrangement: newDefaultArrangement,
      currentArrangement: newDefaultArrangement,
      status: 'ACTIVE',
      password: 'password123',
    });

    setAddModalOpen(false);
    // Reset form
    setNewFullName('');
    setNewEmail('');
    setNewPhone('');
    setNewStaffId('');
    setNewPosition('');
  };

  // Filter users
  const filteredUsers = users.filter((u) => {
    if (selectedDept !== 'ALL' && u.department !== selectedDept) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        u.fullName.toLowerCase().includes(q) ||
        u.staffId.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.position.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const departments = Array.from(new Set(users.map((u) => u.department)));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>Agency Human Resources & Administration</span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#0f2b5c] mt-0.5">
              Staff Directory & Profiles
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Manage personnel records, default work arrangements, schedules, and active credentials
            </p>
          </div>

          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0f2b5c] hover:bg-[#153a7a] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-amber-400" />
            <span>Enrol New Staff Member</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID, position, email..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none"
            />
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-slate-50 text-slate-700 outline-none"
          >
            <option value="ALL">All Departments ({users.length})</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Staff Directory Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filteredUsers.map((u) => (
            <div
              key={u.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                u.status === 'ACTIVE'
                  ? 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                  : 'bg-slate-50/70 border-slate-200 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs ${
                        u.role === 'admin'
                          ? 'bg-[#0f2b5c] text-amber-300 ring-2 ring-amber-400/40'
                          : 'bg-blue-100 text-[#0f2b5c]'
                      }`}
                    >
                      {u.avatarInitials}
                    </div>
                    <div>
                      <div className="font-extrabold text-[#0f2b5c] text-sm flex items-center gap-1.5">
                        <span>{u.fullName}</span>
                        {u.role === 'admin' && (
                          <span title="Administrator">
                            <Shield className="w-3.5 h-3.5 text-amber-500" />
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-amber-700 font-semibold">
                        {u.staffId}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      u.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {u.status}
                  </span>
                </div>

                <div className="mt-3.5 space-y-1.5 text-xs text-slate-600">
                  <div className="font-semibold text-slate-800">{u.position}</div>
                  <div className="text-[11px] text-slate-500">{u.department}</div>

                  <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px]">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{u.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{u.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <Briefcase className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{u.regularSchedule}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom controls */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#0f2b5c]">
                  {u.currentArrangement === 'ON_SITE' ? (
                    <>
                      <Building2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>On-Site Active</span>
                    </>
                  ) : (
                    <>
                      <Home className="w-3.5 h-3.5 text-amber-600" />
                      <span>WFH Active</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(u)}
                    className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-[#0f2b5c] transition-colors cursor-pointer"
                    title="Edit profile & work setup"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {u.role !== 'admin' && (
                    <button
                      onClick={() => toggleStaffStatus(u.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        u.status === 'ACTIVE'
                          ? 'text-rose-600 hover:bg-rose-50'
                          : 'text-emerald-600 hover:bg-emerald-50'
                      }`}
                      title={u.status === 'ACTIVE' ? 'Deactivate account' : 'Reactivate account'}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD STAFF MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-[#0f2b5c] text-white flex items-center justify-between border-b-2 border-amber-500">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">Enrol New Staff Account</h3>
              </div>
              <button
                onClick={() => setAddModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="p-6 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    placeholder="e.g. Gabriel Mendoza"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Staff ID Code
                  </label>
                  <input
                    type="text"
                    value={newStaffId}
                    onChange={(e) => setNewStaffId(e.target.value)}
                    placeholder="e.g. AFLIA-UND-204"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Corporate Email
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="gabriel.mendoza@aflia.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+63 917 000 0000"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Position Title
                  </label>
                  <input
                    type="text"
                    value={newPosition}
                    onChange={(e) => setNewPosition(e.target.value)}
                    placeholder="Underwriting Analyst"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Regular Shift Schedule
                  </label>
                  <input
                    type="text"
                    value={newRegularSchedule}
                    onChange={(e) => setNewRegularSchedule(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Default Arrangement
                  </label>
                  <select
                    value={newDefaultArrangement}
                    onChange={(e) => setNewDefaultArrangement(e.target.value as WorkArrangement)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none bg-white font-semibold"
                  >
                    <option value="ON_SITE">ON_SITE (Makati Office)</option>
                    <option value="WFH">WFH (Remote)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white bg-[#0f2b5c] hover:bg-[#153a7a] rounded-xl font-bold shadow-md cursor-pointer"
                >
                  Confirm & Enrol
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STAFF MODAL */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-[#0f2b5c] text-white flex items-center justify-between border-b-2 border-amber-500">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">Edit Staff Profile: {editUser.fullName}</h3>
              </div>
              <button
                onClick={() => setEditUser(null)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Position Title
                  </label>
                  <input
                    type="text"
                    value={editPosition}
                    onChange={(e) => setEditPosition(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={editDepartment}
                    onChange={(e) => setEditDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Default Work Setup
                  </label>
                  <select
                    value={editDefaultArrangement}
                    onChange={(e) => setEditDefaultArrangement(e.target.value as WorkArrangement)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none bg-white font-semibold"
                  >
                    <option value="ON_SITE">ON_SITE</option>
                    <option value="WFH">WFH</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Current Active Arrangement
                  </label>
                  <select
                    value={editCurrentArrangement}
                    onChange={(e) => setEditCurrentArrangement(e.target.value as WorkArrangement)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none bg-white font-semibold"
                  >
                    <option value="ON_SITE">ON_SITE</option>
                    <option value="WFH">WFH</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Regular Shift Schedule
                </label>
                <input
                  type="text"
                  value={editSchedule}
                  onChange={(e) => setEditSchedule(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0f2b5c] outline-none"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white bg-[#0f2b5c] hover:bg-[#153a7a] rounded-xl font-bold shadow-md cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
