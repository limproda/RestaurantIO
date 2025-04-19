import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Topbar = ({
  pages,
  appName,
  isMobile,
  drawerOpen,
  onToggleDrawer,
  onNavigate,
  user,
}) => (
  <>
    <AppBar position="fixed">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>

        {isMobile ? (
          <>
            <Typography variant="h6" noWrap>
              {appName}
            </Typography>
            <IconButton edge="end" color="inherit" onClick={onToggleDrawer}>
              <MenuIcon />
            </IconButton>
          </>
        ) : (
          <>
            <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "center" }}>
              {pages.map((p) => (
                <IconButton
                  key={p.name}
                  sx={{ flexDirection: "column", mx: 1 }}
                  onClick={() => onNavigate(p.name)}
                >
                  {p.icon}
                  <Typography variant="caption">{p.name}</Typography>
                </IconButton>
              ))}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ textAlign: "right", mr: 2 }}>
                <Typography variant="subtitle2">
                  {user.name} {user.lastName}
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'capitalize', color: '#fff' }}>
                  {user.role}
                </Typography>
              </Box>
              <Avatar src={user.profilePictureUrl} />
            </Box>
          </>
        )}

      </Toolbar>
    </AppBar>

    <Drawer anchor="left" open={drawerOpen} onClose={onToggleDrawer}>
      <Box sx={{ width: 240 }} role="presentation">
        <List>
          {pages.map((p) => (
            <ListItem
              button
              key={p.name}
              onClick={() => {
                onNavigate(p.name);
                onToggleDrawer();
              }}
            >
              <ListItemIcon>{p.icon}</ListItemIcon>
              <ListItemText primary={p.name} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  </>
);

export default Topbar;
