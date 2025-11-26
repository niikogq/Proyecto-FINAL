import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Typography, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorageIcon from '@mui/icons-material/Storage';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';

const drawerWidth = 220;

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, route: '/dashboard' },
  { key: 'activos', label: 'Activos', icon: <StorageIcon />, route: '/activos' },
  { key: 'workorders', label: 'Órdenes de trabajo', icon: <AssignmentIcon />, route: '/workorders' },
  { key: 'reportes', label: 'Reportes', icon: <AssessmentIcon />, route: '/reportes' },
  { key: 'ia', label: 'Módulo IA', icon: <SmartToyIcon />, route: '/ia' }, // <--- ruta y label ajustado
  { key: 'settings', label: 'Configuración', icon: <SettingsIcon />, route: '/settings' }
];
// Restricciones por rol
const permisosPorRol = {
  admin:       ['dashboard', 'activos', 'workorders', 'reportes', 'ia', 'settings'],
  supervisor:  ['dashboard', 'workorders', 'reportes', 'ia'],
  tecnico:     ['dashboard', 'workorders']
};

const Sidebar = ({ active, onSelect, user }) => {
  const navigate = useNavigate();
  const rol = user?.rol || 'tecnico'; // por defecto para pruebas/deploy

  // Filtra el menú según rol
  const itemsPermitidos = menuItems.filter(item => permisosPorRol[rol]?.includes(item.key));

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth, 
          boxSizing: 'border-box', 
          background: '#e5e7eb', 
          color: '#3a434f', 
          boxShadow: 'none',
          borderRight: 'none'
        }
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ px: 2, py: 3, mb: 1 }}>
          <Typography 
            variant="h6" 
            sx={{ fontWeight: 'bold', color: '#364050', letterSpacing: 1 }}>
            GEMPROTEC
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ color: '#5d6674' }}>
            Gestión de Mantenimiento
          </Typography>
        </Box>
        <List>
          {itemsPermitidos.map((item) => (
            <ListItemButton
              key={item.label}
              selected={active === item.route}
              onClick={() => onSelect(item.route)}
              sx={{
                background: active === item.route ? '#cdcfd3' : 'transparent',
                '&:hover': { background: '#cdcfd3' }
              }}
            >
              <ListItemIcon sx={{ color: '#3a434f' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ 
            bgcolor: '#3949ab', 
            boxShadow: 'none', 
            border: 'none' }}>
            <PersonIcon />
          </Avatar>
          <Typography
            variant="body1"
            sx={{ 
              color: '#3a434f',
              cursor: 'pointer',
              fontWeight: 'bold',
              '&:hover': { color: '#1565c0', textDecoration: 'underline' }
            }}
            onClick={() => navigate('/perfil')}
          >
            {user?.nombre || 'Usuario'}
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
