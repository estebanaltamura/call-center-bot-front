// ** React Router
import { Navigate, Route, Routes } from 'react-router-dom';

// ** Contexts
import SettingsProvider from 'contexts/SettingsProvider';
import SystemPromptProvider from 'contexts/BusinessProvider';
import AssistantProvider from 'contexts/AssistantProvider';
import RulesProvider from 'contexts/RulesProvider';
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
import GeneralHat from 'pages/GeneralHatPage';
import GeneralHatPage from 'pages/GeneralHatPage';

function App() {
  return (
    <LoadingProvider>
      <SettingsProvider>
        <ChatHistoryProvider>
          <DataProvider>
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
                path="/generalHat"
                element={
                  // <AuthGuard>
                  <GeneralHatPage />
                  // </AuthGuard>
                }
              />

              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </DataProvider>
        </ChatHistoryProvider>
      </SettingsProvider>
    </LoadingProvider>
  );
}

export default App;
