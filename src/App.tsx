// ** React Router
import { Navigate, Route, Routes } from 'react-router-dom';

// ** Contexts
import SettingsProvider from 'contexts/SettingsProvider';
import SystemPromptProvider from 'contexts/BusinessProvider';
import AssistantProvider from 'contexts/AssistantProvider';
import RulesProvider from 'contexts/RulesProvider';
import LoadingProvider from 'contexts/LoadingProvider';
import KnowledgeProvider from 'contexts/KnowledgeProvider';
import { ChatHistoryProvider } from 'contexts/ChatHistoryProvider';

// ** Pages
import SystemPromptPage from 'pages/SystemPromptPage';
import ChatPage from 'pages/ChatPage';
import DashboardPage from 'pages/DashboardPage';
import StatusPage from 'pages/StatusPage';
import { DataProvider } from 'contexts/DataContextProvider';

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
                path="/systemPrompt"
                element={
                  // <AuthGuard>
                  <SystemPromptPage />
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
                path="/chat"
                element={
                  // <AuthGuard>
                  <ChatPage />
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
