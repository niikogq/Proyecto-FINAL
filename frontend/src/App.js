import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import WorkOrders from './pages/WorkOrders';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Header from './components/header';
import Login from './components/Login';
import Perfil from './pages/Perfil';
import WorkOrderDetailPage from './pages/WorkOrderDetailPage';
import IAModule from './pages/IAModule';

const Layout = ({ children, usuario, handleLogout }) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const titles = {
    '/dashboard': 'Dashboard',
    '/activos': 'Activos',
    '/workorders': 'Órdenes de trabajo',
    '/reportes': 'Reportes',
    '/settings': 'Configuración',
    '/ia': 'Módulo IA',
    '/perfil': 'Mi Perfil'
  };
  const currentTitle = titles[location.pathname] || '';

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        active={location.pathname}
        onSelect={(ruta) => {
          window.location.pathname = ruta;
          setMobileOpen(false);
        }}
        user={usuario}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        isMobile={isMobile}
      />
      <Box sx={{ 
        flex: 1, 
        background: "#f4f6fc", 
        minHeight: "100vh", 
        width: { xs: '100%', md: 'auto' },
        overflow: 'hidden'
      }}>
        <Header 
          title={currentTitle} 
          user={usuario} 
          onLogout={handleLogout}
          onMenuClick={handleDrawerToggle}
          isMobile={isMobile}
        />
        {/* 👇 AQUÍ ESTÁ EL CAMBIO */}
        <Box sx={{ 
          px: { xs: 2, sm: 3, md: 4 },      // ✅ Padding horizontal simétrico
          py: { xs: 2, sm: 3, md: 3 },      // ✅ Padding vertical
          pt: { xs: '80px', sm: '96px' },   // Compensa header fijo
          overflowX: 'hidden',
          width: '100%',
          maxWidth: 1600,                   // ✅ Limita ancho máximo
          margin: '0 auto'                  // ✅ Centra el contenido
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

function App() {
  const [usuario, setUsuario] = useState(() => {
    const stored = localStorage.getItem('usuario');
    return stored ? JSON.parse(stored) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={setUsuario} />} />
        <Route path="/*" element={
          usuario ? (
            <Layout usuario={usuario} handleLogout={handleLogout}>
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="activos" element={<Assets usuario={usuario} />} />
                <Route path="workorders" element={<WorkOrders usuario={usuario} />} />
                <Route path="workorders/:id" element={<WorkOrderDetailPage usuario={usuario} />} />
                <Route path="reportes" element={<Reports usuario={usuario} />} />
                <Route path="ia" element={<IAModule />} />
                <Route path="settings" element={<Settings usuario={usuario} />} />
                <Route path="perfil" element={<Perfil />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </Layout>
          ) : <Navigate to="/login" replace />
        } />
      </Routes>
    </Router>
  );
}

export default App;
