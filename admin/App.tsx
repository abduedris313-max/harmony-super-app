/**
 * @file App.tsx
 * @description Main application controller for the Harmony App Store Developer Console with Role-Based Authentication.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AdminHeader } from './components/AdminHeader';
import { AdminSidebar, AdminTab } from './components/AdminSidebar';
import { AppCatalogTable } from './components/AppCatalogTable';
import { PublishAppModal } from './components/PublishAppModal';
import { AppDetailModal } from './components/AppDetailModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { CentralRepoManagerView } from './components/CentralRepoManagerView';
import { AnalyticsView } from './components/AnalyticsView';
import { SandboxTesterView } from './components/SandboxTesterView';
import { ReleasesPipelineView } from './components/ReleasesPipelineView';
import { SettingsView } from './components/SettingsView';
import { DeveloperDocsView } from './components/DeveloperDocsView';
import { 
  fetchAdminCatalog, 
  publishMiniApp, 
  updateMiniApp, 
  deleteMiniApp, 
  seedDefaultCatalog, 
  getAuditLogs, 
  generateRepositoryManifest 
} from './services/centralRepoService';
import { 
  fetchAdminUserProfile, 
  getGuestDemoProfile, 
  getRolePermissions, 
  logoutUser 
} from './services/adminAuthService';
import { subscribeToAuth } from '../src/lib/firebase';
import { DEFAULT_REPOSITORIES } from '../src/config/appRepository';
import { 
  AdminMiniApp, 
  PublishAppFormData, 
  AppPublishStatus, 
  AuditLogEntry, 
  AppRepositorySource,
  AdminUserProfile
} from './types';

export const AdminApp: React.FC = () => {
  const [apps, setApps] = useState<AdminMiniApp[]>([]);
  const [repositories, setRepositories] = useState<AppRepositorySource[]>(DEFAULT_REPOSITORIES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [currentTab, setCurrentTab] = useState<AdminTab>('catalog');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedAppForDetail, setSelectedAppForDetail] = useState<AdminMiniApp | null>(null);
  const [sandboxTargetApp, setSandboxTargetApp] = useState<AdminMiniApp | null>(null);

  // Authentication & Role state
  const [userProfile, setUserProfile] = useState<AdminUserProfile | null>(() => getGuestDemoProfile('super_admin'));

  // Subscribe to Firebase Auth changes
  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await fetchAdminUserProfile(firebaseUser.uid);
        if (profile) {
          setUserProfile(profile);
        } else {
          // Default developer profile
          setUserProfile({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Developer',
            role: 'developer',
            organization: 'Harmony OS Ecosystem',
            developerHandle: `@${(firebaseUser.displayName || 'dev').toLowerCase().replace(/\s+/g, '')}`,
            photoURL: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || 'Dev')}`,
            createdAt: new Date().toISOString()
          });
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Load catalog on mount
  const loadCatalog = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchAdminCatalog();
      setApps(data);
      setAuditLogs(getAuditLogs());
    } catch (err) {
      console.error('Failed to load admin catalog:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  const userPermissions = getRolePermissions(userProfile?.role || 'viewer');

  // Handlers with Role-Based Permission enforcement
  const handlePublishApp = async (formData: PublishAppFormData) => {
    if (!userPermissions.canPublish) {
      alert('Permission Denied: Viewer role cannot publish apps. Please sign in with a Developer or Admin account.');
      setIsAuthModalOpen(true);
      return;
    }
    const published = await publishMiniApp(formData);
    setApps(prev => [published, ...prev.filter(a => a.id !== published.id)]);
    setAuditLogs(getAuditLogs());
  };

  const handleUpdateApp = async (appId: string, updates: Partial<AdminMiniApp>) => {
    if (!userPermissions.canEditApp) {
      alert('Permission Denied: Your role does not allow editing catalog mini apps.');
      setIsAuthModalOpen(true);
      return;
    }
    const updated = await updateMiniApp(appId, updates);
    setApps(prev => prev.map(a => a.id === appId ? updated : a));
    if (selectedAppForDetail?.id === appId) {
      setSelectedAppForDetail(updated);
    }
    setAuditLogs(getAuditLogs());
  };

  const handleDeleteApp = async (appId: string) => {
    if (!userPermissions.canDeleteApp) {
      alert('Permission Denied: Viewer and restricted roles cannot delete packages.');
      setIsAuthModalOpen(true);
      return;
    }
    await deleteMiniApp(appId);
    setApps(prev => prev.filter(a => a.id !== appId));
    setAuditLogs(getAuditLogs());
  };

  const handleQuickStatusChange = async (appId: string, status: AppPublishStatus) => {
    await handleUpdateApp(appId, { status });
  };

  const handleSeedCatalog = async () => {
    if (!userPermissions.canSeedCatalog) {
      alert('Permission Denied: Only Super Admin and Store Admin can seed default repositories.');
      setIsAuthModalOpen(true);
      return;
    }
    await seedDefaultCatalog();
    await loadCatalog();
  };

  const handleExportManifest = () => {
    const jsonStr = generateRepositoryManifest(apps);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `harmony-central-manifest-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenSandbox = (app: AdminMiniApp) => {
    setSandboxTargetApp(app);
    setCurrentTab('sandbox');
  };

  const handleLaunchUrlInSandbox = (url: string) => {
    const matched = apps.find(a => a.deployedUrl === url);
    if (matched) {
      setSandboxTargetApp(matched);
    } else {
      setSandboxTargetApp({
        id: 'template-preview-' + Date.now(),
        name: 'Template Sandbox Preview',
        version: '1.0.0',
        tagline: 'Developer Template Simulator',
        description: 'Interactive preview of developer mini app starter template.',
        category: 'developer',
        iconName: 'play',
        iconCdnUrl: 'https://cdn.jsdelivr.net/npm/lucide-static@0.475.0/icons/play.svg',
        colorGradient: 'from-blue-500 to-indigo-600',
        bgHex: '#3b82f6',
        repoUrl: 'https://github.com/harmony-ecosystem',
        author: 'Harmony OS Core Team',
        deployedUrl: url,
        status: 'published',
        rating: 5.0,
        downloadsCount: 1,
        size: '48 KB',
        permissions: ['storage', 'haptics', 'clipboard'],
        lastUpdated: new Date().toISOString()
      });
    }
    setCurrentTab('sandbox');
  };

  const handleAddRepository = (newRepo: AppRepositorySource) => {
    if (!userPermissions.canManageRepositories) {
      alert('Permission Denied: Managing custom external repositories requires Store Admin or Super Admin role.');
      setIsAuthModalOpen(true);
      return;
    }
    setRepositories(prev => [...prev, newRepo]);
  };

  const handleSignOut = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.warn(e);
    }
    setUserProfile(getGuestDemoProfile('viewer'));
  };

  const publishedCount = apps.filter(a => (a.status || 'published') === 'published').length;

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'
    }`}>
      {/* Top Console Navigation Bar with Auth Status */}
      <AdminHeader
        isDarkMode={isDarkMode}
        userProfile={userProfile}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onOpenPublishModal={() => setIsPublishModalOpen(true)}
        onRefreshCatalog={loadCatalog}
        onExportManifest={handleExportManifest}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
        isRefreshing={isRefreshing}
        appsCount={apps.length}
      />

      {/* Main Layout: Sidebar + Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <AdminSidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          isDarkMode={isDarkMode}
          appsCount={apps.length}
          publishedCount={publishedCount}
          firestoreConnected={true}
        />

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {currentTab === 'catalog' && (
              <AppCatalogTable
                apps={apps}
                isDarkMode={isDarkMode}
                onSelectApp={(app) => setSelectedAppForDetail(app)}
                onOpenPublishModal={() => setIsPublishModalOpen(true)}
                onDeleteApp={handleDeleteApp}
                onOpenSandbox={handleOpenSandbox}
                onQuickStatusChange={handleQuickStatusChange}
              />
            )}

            {currentTab === 'publish' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold">Mini App Publishing Studio</h2>
                    <p className="text-xs text-slate-400">
                      Author, package, and deploy a new mini application into the Central Repository.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsPublishModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
                  >
                    Open Fullscreen Publishing Wizard
                  </button>
                </div>
                <PublishAppModal
                  isOpen={true}
                  onClose={() => setCurrentTab('catalog')}
                  onPublish={handlePublishApp}
                  isDarkMode={isDarkMode}
                />
              </div>
            )}

            {currentTab === 'docs' && (
              <DeveloperDocsView
                isDarkMode={isDarkMode}
                onLaunchInSandbox={handleLaunchUrlInSandbox}
                onOpenPublishStudioWithTemplate={(_template) => {
                  setIsPublishModalOpen(true);
                }}
              />
            )}

            {currentTab === 'releases' && (
              <ReleasesPipelineView
                apps={apps}
                isDarkMode={isDarkMode}
                onOpenAppDetail={(app) => setSelectedAppForDetail(app)}
              />
            )}

            {currentTab === 'repositories' && (
              <CentralRepoManagerView
                repositories={repositories}
                apps={apps}
                auditLogs={auditLogs}
                onAddRepository={handleAddRepository}
                onSeedDefaultCatalog={handleSeedCatalog}
                onExportManifest={handleExportManifest}
                isDarkMode={isDarkMode}
              />
            )}

            {currentTab === 'analytics' && (
              <AnalyticsView
                apps={apps}
                isDarkMode={isDarkMode}
              />
            )}

            {currentTab === 'sandbox' && (
              <SandboxTesterView
                apps={apps}
                initialApp={sandboxTargetApp}
                isDarkMode={isDarkMode}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsView
                isDarkMode={isDarkMode}
                appsCount={apps.length}
                currentUserProfile={userProfile}
              />
            )}
          </div>
        </main>
      </div>

      {/* Role-Based Authentication & Registration Modal */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthenticated={(profile) => setUserProfile(profile)}
        isDarkMode={isDarkMode}
      />

      {/* Publish Modal Popup */}
      <PublishAppModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onPublish={handlePublishApp}
        isDarkMode={isDarkMode}
      />

      {/* App Inspector & Detail Editor Modal */}
      <AppDetailModal
        app={selectedAppForDetail}
        isOpen={!!selectedAppForDetail}
        onClose={() => setSelectedAppForDetail(null)}
        onUpdateApp={handleUpdateApp}
        onOpenSandbox={handleOpenSandbox}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
