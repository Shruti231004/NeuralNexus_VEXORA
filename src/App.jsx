import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CustomerView from './components/CustomerView';
import StaffDashboard from './components/StaffDashboard';
import StylistPersonalDashboard from './components/StylistPersonalDashboard';
import SplitDemoView from './components/SplitDemoView';
import NotificationToast from './components/NotificationToast';
import StaffLoginModal from './components/StaffLoginModal';
import { useSalonStore, STYLISTS } from './services/store';

export default function App() {
  const store = useSalonStore();
  const [showStaffLoginModal, setShowStaffLoginModal] = useState(false);

  // Router route determination from URL path or hash ('customer', 'staff', 'admin', 'split')
  const [currentRoute, setCurrentRoute] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();

    if (path.includes('/admin') || hash.includes('#admin')) return 'admin';
    if (path.includes('/staff') || hash.includes('#staff')) return 'staff';
    if (path.includes('/split') || hash.includes('#split')) return 'split';
    return 'customer';
  });

  // Listen to browser URL popstate or hash changes
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      if (path.includes('/admin') || hash.includes('#admin')) {
        setCurrentRoute('admin');
        store.setCurrentStaffId('admin');
      } else if (path.includes('/staff') || hash.includes('#staff')) {
        setCurrentRoute('staff');
        if (store.currentStaffId === 'admin') store.setCurrentStaffId('elena');
      } else if (path.includes('/split') || hash.includes('#split')) {
        setCurrentRoute('split');
      } else {
        setCurrentRoute('customer');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [store]);

  const navigateTo = (route) => {
    setCurrentRoute(route);
    if (route === 'admin') {
      window.history.pushState({}, '', '/admin');
      store.setCurrentStaffId('admin');
    } else if (route === 'staff') {
      window.history.pushState({}, '', '/staff');
      if (store.currentStaffId === 'admin') store.setCurrentStaffId('elena');
    } else if (route === 'split') {
      window.history.pushState({}, '', '/split');
    } else {
      window.history.pushState({}, '', '/');
    }
  };

  const activeStaff = STYLISTS.find(s => s.id === store.currentStaffId);

  return (
    <div className="min-h-screen bg-[#fdf7ff] text-[#1e1831] flex flex-col font-body selection:bg-[#b50060] selection:text-white">
      
      {/* Header Navigation - Pure Customer when on '/' route */}
      <Header
        currentRoute={currentRoute}
        onNavigate={navigateTo}
        waitingCount={store.metrics.waitingCount}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-[1360px] w-full mx-auto px-4 md:px-8 pt-20 pb-8">
        
        {/* Route 1: Customer Portal (Default '/' Landing Page) */}
        {currentRoute === 'customer' && <CustomerView store={store} />}

        {/* Route 2: Staff Portal ('/staff') */}
        {currentRoute === 'staff' && (
          <div className="space-y-4">
            <div className="bg-[#f8f1ff] border border-[#e8ddff] p-4 rounded-3xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <img 
                  src={activeStaff?.avatar || STYLISTS[0].avatar} 
                  alt={activeStaff?.name} 
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#b50060]"
                />
                <div>
                  <div className="text-xs font-bold text-[#b50060] uppercase tracking-wider">
                    Staff Portal • {activeStaff?.name || 'Artisan Workstation'}
                  </div>
                  <div className="text-xs text-[#594047]">Logged in as {activeStaff?.name} ({activeStaff?.role})</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowStaffLoginModal(true)}
                  className="px-4 py-1.5 bg-white hover:bg-[#ede4ff] text-[#1e1831] border border-[#e1bec6] rounded-full text-xs font-semibold shadow-sm transition-all"
                >
                  Switch Artisan Profile
                </button>
                <button
                  onClick={() => navigateTo('customer')}
                  className="px-3 py-1.5 bg-[#f8f1ff] text-[#594047] hover:text-[#1e1831] rounded-full text-xs font-semibold"
                >
                  Exit to Salon Home
                </button>
              </div>
            </div>

            <StylistPersonalDashboard
              staffId={store.currentStaffId === 'admin' ? 'elena' : store.currentStaffId}
              store={store}
              onSwitchStaff={() => setShowStaffLoginModal(true)}
            />
          </div>
        )}

        {/* Route 3: Admin Portal ('/admin') */}
        {currentRoute === 'admin' && (
          <div className="space-y-4">
            <div className="bg-[#ffd9e2] border border-[#db2379]/40 p-4 rounded-3xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#b50060] text-white flex items-center justify-center font-bold shadow-md">
                  <span className="material-symbols-outlined text-xl">verified_user</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#b50060] uppercase tracking-wider">
                    Front Desk Admin Portal (`/admin`)
                  </div>
                  <div className="text-xs text-[#1e1831] font-semibold">Full Floor Management & Revenue Control</div>
                </div>
              </div>

              <button
                onClick={() => navigateTo('customer')}
                className="px-4 py-1.5 bg-white hover:bg-[#f8f1ff] text-[#1e1831] border border-[#e1bec6] rounded-full text-xs font-semibold shadow-sm"
              >
                Exit Admin Portal
              </button>
            </div>

            <StaffDashboard store={store} />
          </div>
        )}

        {/* Route 4: Split Demo View ('/split') */}
        {currentRoute === 'split' && <SplitDemoView store={store} />}

      </main>

      {/* Notification Toast */}
      <NotificationToast toasts={store.toasts} />

      {/* Staff Login Modal */}
      <StaffLoginModal
        isOpen={showStaffLoginModal}
        onClose={() => setShowStaffLoginModal(false)}
        onSelectStaff={(id) => {
          store.setCurrentStaffId(id);
          setShowStaffLoginModal(false);
        }}
        currentStaffId={store.currentStaffId}
      />

      {/* Footer */}
      <footer className="w-full bg-[#f8f1ff] border-t border-[#e8ddff] mt-auto">
        <div className="max-w-[1360px] mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#b50060] text-xl">spa</span>
              <span className="font-headline font-bold text-sm text-[#1e1831]">Aura Hair & Wellness Atelier</span>
            </div>
            
            <p className="font-body text-xs text-[#594047] text-center md:text-right flex items-center gap-4">
              <span>© 2026 Aura Atelier & Wellness Co.</span>
              
              {/* Secret Staff/Admin Navigation Links for Authorized Staff */}
              <span className="opacity-40 hover:opacity-100 transition-opacity flex items-center gap-2 text-[10px]">
                <button onClick={() => navigateTo('staff')} className="hover:underline">Staff Portal (`/staff`)</button>
                <span>•</span>
                <button onClick={() => navigateTo('admin')} className="hover:underline">Admin Portal (`/admin`)</button>
                <span>•</span>
                <button onClick={() => navigateTo('split')} className="hover:underline">Split View (`/split`)</button>
              </span>
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
