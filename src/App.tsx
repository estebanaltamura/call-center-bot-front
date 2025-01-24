import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import Home from 'pages/Home';
import { useEffect } from 'react';
import { menuBarHeight } from 'globalConfig';
import SettingsProvider from 'contexts/SettingsProvider';
import SystemPromptProvider from 'contexts/CompanyProvider';
import AssistantProvider from 'contexts/AssistantProvider';
import RulesProvider from 'contexts/RulesProvider';
import KnowledgeContextProvider from 'contexts/KnoledgeProvider';
import LoadingProvider from 'contexts/LoadingProvider';

function App() {
  return (
    <LoadingProvider>
      <SettingsProvider>
        <SystemPromptProvider>
          <AssistantProvider>
            <RulesProvider>
              <KnowledgeContextProvider>
                <main className="pt-[48px]">
                  {/* Ajuste del padding top para compensar la altura del AppBar */}
                  <Routes>
                    <Route path="/" element={<Navigate to="/home" />} />
                    <Route
                      path="/home"
                      element={
                        // <AuthGuard>
                        <Home />
                        // </AuthGuard>
                      }
                    />
                  </Routes>
                </main>
              </KnowledgeContextProvider>
            </RulesProvider>
          </AssistantProvider>
        </SystemPromptProvider>
      </SettingsProvider>
    </LoadingProvider>
  );
}

export default App;
