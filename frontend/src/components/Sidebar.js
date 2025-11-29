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

const drawerWidth = 240;

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, route: '/dashboard' },
  { key: 'activos', label: 'Activos', icon: <StorageIcon />, route: '/activos' },
  { key: 'workorders', label: 'Órdenes de trabajo', icon: <AssignmentIcon />, route: '/workorders' },
  { key: 'reportes', label: 'Reportes', icon: <AssessmentIcon />, route: '/reportes' },
  { key: 'ia', label: 'Módulo IA', icon: <SmartToyIcon />, route: '/ia' },
  { key: 'settings', label: 'Configuración', icon: <SettingsIcon />, route: '/settings' }
];

const permisosPorRol = {
  admin: ['dashboard', 'activos', 'workorders', 'reportes', 'ia', 'settings'],
  supervisor: ['dashboard', 'workorders', 'reportes', 'ia'],
  tecnico: ['dashboard', 'workorders']
};

const Sidebar = ({ active, onSelect, user, mobileOpen, onMobileClose, isMobile }) => {
  const navigate = useNavigate();
  const rol = user?.rol || 'tecnico';
  const itemsPermitidos = menuItems.filter(item => permisosPorRol[rol]?.includes(item.key));

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: 2, py: 3, mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#364050', letterSpacing: 1 }}>
          GEMPROTEC
        </Typography>
        <Typography variant="caption" sx={{ color: '#5d6674' }}>
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
        <Avatar sx={{ bgcolor: '#3949ab' }}>
          <PersonIcon />
        </Avatar>
        <Typography
          variant="body2"
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
  );

  return (
    <>
      {/* Drawer temporal en móvil */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onMobileClose}
          ModalProps={{ keepMounted: true }} // Mejor rendimiento en móvil
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              background: '#e5e7eb',
              color: '#3a434f'
            }
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        // Drawer permanente en desktop
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              background: '#e5e7eb',
              color: '#3a434f',
              borderRight: 'none'
            }
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
