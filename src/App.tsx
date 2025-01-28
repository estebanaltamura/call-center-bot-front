// ** React Router
import { Navigate, Route, Routes } from 'react-router-dom';

// ** Contexts
import SettingsProvider from 'contexts/SettingsProvider';
import LoadingProvider from 'contexts/LoadingProvider';
import { ChatHistoryProvider } from 'contexts/ChatHistoryProvider';

// ** Pages
import ChatPage from 'pages/ChatPage';
import DashboardPage from 'pages/DashboardPage';
import { DataProvider } from 'contexts/DataContextProvider';
import AssistantPage from 'pages/AssistantPage';
import BusinessPage from 'pages/BusinessPage';
import KnowledgePage from 'pages/KnowledgePage';
import RulePage from 'pages/RulePage';
import StatusPage from 'pages/StatusPage';
import HatPage from 'pages/HatPage';
import HatProvider from 'contexts/HatProvider';
import HatViewerPage from 'pages/HatViewerPage';

function App() {
  return (
    <LoadingProvider>
      <SettingsProvider>
        <ChatHistoryProvider>
          <DataProvider>
            <HatProvider>
              <Routes>
                <Route
                  path="/dashboard"
                  element={
                    // <AuthGuard>
                    <DashboardPage />
                    // </AuthGuard>
                  }
                />
                <Route
                  path="/chat"
                  element={
                    // <AuthGuard>
                    <ChatPage />
                    // </AuthGuard>
                  }
                />

                <Route
                  path="/status"
                  element={
                    // <AuthGuard>
                    <StatusPage />
                    // </AuthGuard>
                  }
                />

                <Route
                  path="/businesses"
                  element={
                    // <AuthGuard>
                    <BusinessPage />
                    // </AuthGuard>
                  }
                />

                <Route
                  path="/assistants"
                  element={
                    // <AuthGuard>
                    <AssistantPage />
                    // </AuthGuard>
                  }
                />

                <Route
                  path="/knowledges"
                  element={
                    // <AuthGuard>
                    <KnowledgePage />
                    // </AuthGuard>
                  }
                />

                <Route
                  path="/rules"
                  element={
                    // <AuthGuard>
                    <RulePage />
                    // </AuthGuard>
                  }
                />

                <Route
                  path="/hats"
                  element={
                    // <AuthGuard>
                    <HatPage />
                    // </AuthGuard>
                  }
                />

                <Route
                  path="/hats/viewer"
                  element={
                    // <AuthGuard>
                    <HatViewerPage />
                    // </AuthGuard>
                  }
                />

                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </HatProvider>
          </DataProvider>
        </ChatHistoryProvider>
      </SettingsProvider>
    </LoadingProvider>
  );
}

export default App;
