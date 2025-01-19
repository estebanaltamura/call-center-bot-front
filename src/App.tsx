import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import Home from 'pages/Home';
import { useEffect } from 'react';
import { menuBarHeight } from 'globalConfig';
import SettingsProvider from 'contexts/SettingsProvider';
import SystemPromptProvider from 'contexts/CompanyProvider';
import GoalsProvider from 'contexts/GoalsProvider';

function App() {
  return (
    <SettingsProvider>
      <SystemPromptProvider>
        <GoalsProvider>
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
        </GoalsProvider>
      </SystemPromptProvider>
    </SettingsProvider>
  );
}

export default App;
