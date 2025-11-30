import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Badge, Button, Menu, MenuItem } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const capitalize = str => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

const Header = ({ title, user, onLogout, onMenuClick, isMobile }) => {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.rol === 'tecnico') {
      axios.get('/api/notifications', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      })
        .then(res => setNotifications(res.data))
        .catch(() => setNotifications([]));
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleNotificationClick = async (noti) => {
    handleCloseMenu();
    if (!noti.read) {
      try {
        await axios.post(`/api/notifications/${noti._id}/read`, {}, {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
        });
        setNotifications(notifications =>
          notifications.map(n => n._id === noti._id ? { ...n, read: true } : n)
        );
      } catch (err) {}
    }
    navigate(noti.link || '/workorders');
  };

  return (
    <AppBar
      position="fixed "  // <-- CAMBIAR DE "sticky" A "fixed"
      elevation={0}
      sx={{
        background: '#fff',
        color: '#212529',
        boxShadow: 'none',
        borderBottom: '1px solid #ededed',
        zIndex: (theme) => theme.zIndex.drawer + 1,  // Por encima del drawer
        left: { xs: 0, md: 240 },  // En desktop, deja espacio para el sidebar (240px)
        width: { xs: '100%', md: 'calc(100% - 240px)' }  // Ancho dinámico según sidebar
      }}
    >

      <Toolbar sx={{ minHeight: { xs: 64, sm: 80 }, px: { xs: 2, sm: 3 } }}>
        {/* Botón menú solo en móvil */}
        {isMobile && (
          <IconButton
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2, color: '#757575' }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="bold">
            {title}
          </Typography>
          {!isMobile && (
            <Typography variant="subtitle2" color="#757575">
              Bienvenido, {user?.nombre} - {user?.rol ? capitalize(user.rol) : 'Usuario'}
            </Typography>
          )}
        </Box>

        {/* Notificaciones (solo técnicos) */}
        {user && user.rol === 'tecnico' && (
          <>
            <IconButton size="large" sx={{ color: '#757575' }} onClick={handleOpenMenu}>
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
              {notifications.length === 0 && <MenuItem disabled>(Sin notificaciones)</MenuItem>}
              {notifications.map((noti) => (
                <MenuItem
                  key={noti._id}
                  sx={{
                    fontWeight: noti.read ? 'normal' : 'bold',
                    color: !noti.read ? '#1976d2' : '#555'
                  }}
                  onClick={() => handleNotificationClick(noti)}
                >
                  {noti.message}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}

        {/* Chat icon (oculto en móvil pequeño) */}
        {!isMobile && (
          <IconButton size="large" sx={{ color: '#1976d2', mr: 1 }}>
            <ChatBubbleOutlineIcon />
          </IconButton>
        )}

        {/* Botón cerrar sesión */}
        <Button
          color="error"
          variant={isMobile ? 'text' : 'outlined'}
          onClick={onLogout}
          size={isMobile ? 'small' : 'medium'}
          sx={{ ml: { xs: 1, sm: 2 }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
        >
          {isMobile ? 'Salir' : 'Cerrar sesión'}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
