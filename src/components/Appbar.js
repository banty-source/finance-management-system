import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box} from '@mui/material';
import { Link } from 'react-router-dom';

function Appbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ bgcolor: "#343434" }}>
        <Toolbar variant="dense">
          <Typography variant="h5" color="inherit" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Finance Management System
          </Typography >
          
          <Button variant='h4' sx={{fontWeight: 'bold', fontSize: 16}} color="inherit" component={Link} to="/">Home</Button> 
          <Button variant='h4' sx={{fontWeight: 'bold', fontSize: 16}} color="inherit" component={Link} to="/Budget-Management">Budget Management</Button>
          <Button variant='h4' sx={{fontWeight: 'bold', fontSize: 16}} color="inherit" component={Link} to="/Expense-Tracking-and-Recording">Expense Tracking and Recording</Button>
          <Button variant='h4' sx={{fontWeight: 'bold', fontSize: 16}} color="inherit" component={Link} to="/Spending-Analysis-(2-Items)">Spending Analysis (2 Items)</Button>
          <Button variant='h4' sx={{fontWeight: 'bold', fontSize: 16}} color="inherit" component={Link} to="/Spending-Analysis-(Multiple-Items)">Spending Analysis (Multiple Items)</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
export default Appbar;