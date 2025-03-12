import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  footer: {
    top: 'auto',
    bottom: 0,
    width: '100%',
    position: 'fixed', // Fixed position ensures the footer sticks to the bottom
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    textAlign: 'center', // Align content to the center
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

function Footer() {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.footer} sx={{ bgcolor: "#343434" }}>
      <Toolbar>
        <Typography sx={{ fontSize: 20 }}>
          Design & Built by SSB &copy; 2025
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Footer;
