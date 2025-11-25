import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import WorkOrders from './pages/WorkOrders';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Header from './components/header';
import Login from './components/Login';
import Perfil from './pages/Perfil'; // O el nombre de tu carpeta/pages

// Layout para páginas internas: ¡Mueve a función y dale props!
const Layout = ({ children, usuario, handleLogout }) => {
  const location = useLocation();
  const titles = {
    '/dashboard': 'Dashboard',
    '/activos': 'Activos',
    '/workorders': 'Órdenes de trabajo',
    '/reportes': 'Reportes',
    '/settings': 'Configuración'
  };
  const currentTitle = titles[location.pathname] || '';

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar
        active={location.pathname}
        onSelect={ruta => window.location.pathname = ruta}
        user={usuario}
      />
      <div style={{ flex: 1, background: "#f4f6fc", minHeight: "100vh" }}>
        <Header title={currentTitle} user={usuario} onLogout={handleLogout} />
        <div style={{ padding: 32 }}>
          {children}
        </div>
      </div>
    </div>
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
          usuario
            ? (
              <>
                <Layout usuario={usuario} handleLogout={handleLogout}>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="activos" element={<Assets usuario={usuario} />} />
                    <Route path="workorders" element={<WorkOrders usuario={usuario} />} />
                    <Route path="reportes" element={<Reports usuario={usuario} />} />
                    <Route path="settings" element={<Settings usuario={usuario} />} />
                    <Route path="/perfil" element={<Perfil />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                  </Routes>
                </Layout>
              </>
            )
            : <Navigate to="/login" replace />
        } />
      </Routes>
    </Router>
  );
}

export default App;
