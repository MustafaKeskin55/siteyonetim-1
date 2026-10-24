import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileFrame } from './components/MobileFrame';
import { HomeScreen } from './screens/HomeScreen';
import { CommunityChatScreen } from './screens/CommunityChatScreen';
import { PaymentsScreen } from './screens/PaymentsScreen';
import { RequestsScreen } from './screens/RequestsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { AuthScreen } from './screens/AuthScreen';

// Modals
import { SiteSelectorModal } from './components/SiteSelectorModal';
import { NotificationSheet } from './components/NotificationSheet';
import { PollVoteModal } from './components/PollVoteModal';
import { PaymentModal } from './components/PaymentModal';
import { NewRequestModal } from './components/NewRequestModal';
import { Loader2 } from 'lucide-react';

const ScreenRouter: React.FC = () => {
  const { activeTab, user, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#fafbfe]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-xs text-slate-500 font-semibold mt-3">Yükleniyor...</p>
      </div>
    );
  }

  // Kullanıcı giriş yapmamışsa doğrudan Güvenli Giriş / Kayıt ekranı açılır
  if (!user) {
    return <AuthScreen />;
  }

  return (
    <>
      {activeTab === 'home' && <HomeScreen />}
      {activeTab === 'community' && <CommunityChatScreen />}
      {activeTab === 'payments' && <PaymentsScreen />}
      {activeTab === 'requests' && <RequestsScreen />}
      {activeTab === 'profile' && <ProfileScreen />}

      {/* Global Modals & Sheets */}
      <SiteSelectorModal />
      <NotificationSheet />
      <PollVoteModal />
      <PaymentModal />
      <NewRequestModal />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MobileFrame>
        <ScreenRouter />
      </MobileFrame>
    </AppProvider>
  );
};

export default App;
