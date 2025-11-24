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
  { label: 'Dashboard', icon: <DashboardIcon />, route: '/dashboard' },
  { label: 'Activos', icon: <StorageIcon />, route: '/activos' },
  { label: 'Órdenes de trabajo', icon: <AssignmentIcon />, route: '/workorders' },
  { label: 'Reportes', icon: <AssessmentIcon />, route: '/reportes' },
  { label: 'AI', icon: <SmartToyIcon />, route: '/ai' },
  { label: 'Settings', icon: <SettingsIcon />, route: '/settings' }
];

const Sidebar = ({ active, onSelect, user }) => {
  const navigate = useNavigate();

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
          {menuItems.map((item, idx) => (
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
