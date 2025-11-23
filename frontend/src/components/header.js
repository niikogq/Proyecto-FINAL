import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Badge, Button, Menu, MenuItem } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import axios from 'axios';

const capitalize = str => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

const Header = ({ title, user, onLogout }) => {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    console.log('Usuario logueado:', user);
    if (user && user.rol === 'tecnico') {
      axios.get('/api/notifications', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      })
      .then(res => {
        setNotifications(res.data);
        console.log('Notificaciones:', res.data);
      })
      .catch(err => {
        setNotifications([]);
        console.error('Error al traer notif:', err);
      });
    }
  }, [user]);
  // Cuenta solo las no leídas para el badge
  const unreadCount = notifications.filter(n => !n.read).length;

  // Menú de notificaciones
  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ background: '#fff', color: '#212529', boxShadow: 'none', borderBottom: '1px solid #ededed', zIndex: 1201 }}
    >
      <Toolbar sx={{ height: 80 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            {title}
          </Typography>
          <Typography variant="subtitle2" color="#757575">
            Bienvenido, {user?.nombre} - {user?.rol ? capitalize(user.rol) : 'Usuario'}
          </Typography>
        </Box>
        {user && user.rol === 'tecnico' && (
          <>
            <IconButton size="large" sx={{ color: '#757575', mr: 2 }} onClick={handleOpenMenu}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsNoneIcon />
              </Badge>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              {notifications.length === 0 && (
                <MenuItem disabled>(Sin notificaciones)</MenuItem>
              )}
              {notifications.map((noti) => (
                <MenuItem
                  key={noti._id}
                  sx={{
                    fontWeight: noti.read ? 'normal' : 'bold',
                    color: !noti.read ? '#1976d2' : '#555'
                  }}
                >
                  {noti.message}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
        <IconButton size="large" sx={{ color: '#1976d2', mr: 2 }}>
          <ChatBubbleOutlineIcon />
        </IconButton>
        <Button
          color="error"
          variant="outlined"
          onClick={onLogout}
          sx={{ ml: 2 }}
        >
          Cerrar sesión
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
