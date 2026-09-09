/**
 * @file SettingsView.tsx
 * @description Admin portal configuration, Firebase BaaS telemetry, user roles, and security policy inspector.
 */

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Database, 
  ShieldCheck, 
  Key, 
  Server, 
  Terminal, 
  RefreshCw, 
  CheckCircle2, 
  FileCode,
  Users,
  Crown,
  Code2,
  Eye,
  UserCheck
} from 'lucide-react';
import firebaseConfig from '../../firebase-applet-config.json';
import { AdminUserProfile, AdminUserRole } from '../types';
import { fetchAllAdminUsers, updateAdminUserRole, getRolePermissions } from '../services/adminAuthService';

interface SettingsViewProps {
  isDarkMode: boolean;
  appsCount: number;
  currentUserProfile: AdminUserProfile | null;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  isDarkMode,
  appsCount,
  currentUserProfile
}) => {
  const [users, setUsers] = useState<AdminUserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [roleUpdateMsg, setRoleUpdateMsg] = useState<string | null>(null);

  const loadAdminUsers = async () => {
    setLoadingUsers(true);
    try {
      const list = await fetchAllAdminUsers();
      setUsers(list);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadAdminUsers();
  }, []);

  const handleRoleChange = async (targetUid: string, newRole: AdminUserRole) => {
    try {
      await updateAdminUserRole(targetUid, newRole);
      setRoleUpdateMsg(`Updated user role to ${newRole.toUpperCase()}`);
      setUsers(prev => prev.map(u => u.uid === targetUid ? { ...u, role: newRole } : u));
      setTimeout(() => setRoleUpdateMsg(null), 3000);
    } catch (err: any) {
      alert(`Failed to update role: ${err.message || 'Permission denied'}`);
    }
  };

  const currentRole = currentUserProfile?.role || 'developer';
  const permissions = getRolePermissions(currentRole);

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-base font-bold flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-500" />
          App Store Developer Console Settings & Security
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Role-based authentication matrix, registered developers, and Firebase BaaS telemetry.
        </p>
      </div>

      {/* Role & Permissions Card */}
      <div className={`p-6 rounded-3xl border ${
        isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Active Account Authorization</h3>
              <p className="text-xs text-slate-400">{currentUserProfile?.email || 'Guest Developer Account'}</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Role: {currentRole}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className={`p-3 rounded-2xl border ${permissions.canPublish ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 bg-slate-950/40 text-slate-500'}`}>
            <div className="font-semibold">Publish Mini Apps</div>
            <div className="text-[10px] mt-0.5">{permissions.canPublish ? 'Granted' : 'Denied'}</div>
          </div>
          <div className={`p-3 rounded-2xl border ${permissions.canEditApp ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 bg-slate-950/40 text-slate-500'}`}>
            <div className="font-semibold">Edit Catalog Apps</div>
            <div className="text-[10px] mt-0.5">{permissions.canEditApp ? 'Granted' : 'Denied'}</div>
          </div>
          <div className={`p-3 rounded-2xl border ${permissions.canDeleteApp ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 bg-slate-950/40 text-slate-500'}`}>
            <div className="font-semibold">Delete Packages</div>
            <div className="text-[10px] mt-0.5">{permissions.canDeleteApp ? 'Granted' : 'Denied'}</div>
          </div>
          <div className={`p-3 rounded-2xl border ${permissions.canManageRepositories ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 bg-slate-950/40 text-slate-500'}`}>
            <div className="font-semibold">Manage Repositories</div>
            <div className="text-[10px] mt-0.5">{permissions.canManageRepositories ? 'Granted' : 'Denied'}</div>
          </div>
          <div className={`p-3 rounded-2xl border ${permissions.canSeedCatalog ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 bg-slate-950/40 text-slate-500'}`}>
            <div className="font-semibold">Seed System Catalog</div>
            <div className="text-[10px] mt-0.5">{permissions.canSeedCatalog ? 'Granted' : 'Denied'}</div>
          </div>
          <div className={`p-3 rounded-2xl border ${permissions.canManageRoles ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 bg-slate-950/40 text-slate-500'}`}>
            <div className="font-semibold">User Role Admin</div>
            <div className="text-[10px] mt-0.5">{permissions.canManageRoles ? 'Granted' : 'Denied'}</div>
          </div>
        </div>
      </div>

      {/* Admin Console User Directory */}
      <div className={`p-6 rounded-3xl border ${
        isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Registered Developers & Admins</h3>
              <p className="text-xs text-slate-400">User accounts synced with Firestore /admin_users</p>
            </div>
          </div>
          <button
            onClick={loadAdminUsers}
            disabled={loadingUsers}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingUsers ? 'animate-spin' : ''}`} />
            Refresh Directory
          </button>
        </div>

        {roleUpdateMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{roleUpdateMsg}</span>
          </div>
        )}

        <div className="space-y-3">
          {users.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
              No registered user documents found in Firestore yet. User profiles are created automatically upon registration or sign in.
            </div>
          ) : (
            users.map(u => (
              <div key={u.uid} className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                isDarkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-3">
                  <img
                    src={u.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.displayName)}`}
                    alt={u.displayName}
                    className="w-8 h-8 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <div className="font-bold text-xs flex items-center gap-2">
                      <span>{u.displayName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{u.developerHandle || u.email}</span>
                    </div>
                    <div className="text-[10px] text-slate-500">{u.organization || 'Independent'} • Created {new Date(u.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={u.role}
                    disabled={!permissions.canManageRoles}
                    onChange={(e) => handleRoleChange(u.uid, e.target.value as AdminUserRole)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 font-semibold cursor-pointer outline-none"
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="admin">Store Admin</option>
                    <option value="developer">Developer</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Cloud Firestore BaaS Telemetry Card */}
      <div className={`p-6 rounded-3xl border ${
        isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Cloud Firestore Database</h3>
              <p className="text-xs text-slate-400">Harmony Super App Central BaaS</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Active & Connected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">Project ID</div>
            <div className="text-slate-200 truncate">{firebaseConfig.projectId}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">User Accounts Collection</div>
            <div className="text-indigo-400 font-bold">admin_users</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">Catalog Collection</div>
            <div className="text-blue-400 font-bold">central_apps_catalog</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">Security Rules</div>
            <div className="text-emerald-400">rules_version = '2' (Deployed)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
