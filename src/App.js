import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Container from '@mui/material/Container';
import './App.css';
import Appbar from './components/Appbar';
import BudgetManagement from './components/Budget-Management';
import ExpenseTrackingAndRecording from './components/Expense-Tracking-and-Recording';
import SPENDING_ANALYSIS_2_ITEMS from './components/Spending-Analysis-(2-Items)';
import SPENDING_ANALYSIS_MULTIPLE_ITEMS from './components/Spending-Analysis-(Multiple-Items)';
import Home from './components/Home';
import background from './assets/background.jpg'; // Replace with the actual path to your image
import Footer from './components/Footer'; // Import the Footer component

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const useStyles = makeStyles({
  root: {
    backgroundImage: `url(${background})`,
    //backgroundColor: '#373739',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
});

function App() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className={classes.root}>
          <Container style={{ marginTop: '20px', marginBottom: '20px', marginLeft: '375px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/budget-management" element={<BudgetManagement />} />
              <Route path="/expense-tracking-and-recording" element={<ExpenseTrackingAndRecording />} />
              <Route path="/spending-analysis-(2-items)" element={<SPENDING_ANALYSIS_2_ITEMS />} />
              <Route path="/spending-analysis-(multiple-items)" element={<SPENDING_ANALYSIS_MULTIPLE_ITEMS />} />
            </Routes>
          </Container>
          <Appbar />
          <Footer /> {/* Include the Footer component here */}
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
