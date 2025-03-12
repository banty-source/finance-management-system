import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, MenuItem, Button, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // This is necessary to auto-register all the controllers
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the plugin

function SpendingAnalysis() {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedExpense, setSelectedExpense] = useState('');
  const [chartData, setChartData] = useState(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  // Fetch budgets and expenses from the backend
  const fetchBudgetsAndExpenses = async () => {
    try {
      const budgetsResponse = await fetch('http://localhost:9000/budgets');
      const budgetsData = await budgetsResponse.json();
      setBudgets(budgetsData);

      const expensesResponse = await fetch('http://localhost:9000/expenses');
      const expensesData = await expensesResponse.json();
      setExpenses(expensesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Use effect to fetch budgets and expenses on component mount
  useEffect(() => {
    fetchBudgetsAndExpenses();
  }, []);

  // Function to handle the selection of budget and expense
  const handleSelection = () => {
    if (!selectedBudget || !selectedExpense) {
      setShowErrorDialog(true); // Show error dialog if either budget or expense is not selected
      return;
    }

    const selectedBudgetData = budgets.find((budget) => budget.id === selectedBudget);
    const selectedExpenseData = expenses.find((expense) => expense.id === selectedExpense);

    if (selectedBudgetData && selectedExpenseData) {
      setChartData({
        labels: ['Selected Items'],
        datasets: [
          {
            label: 'Budget',
            data: [selectedBudgetData.amount],
            backgroundColor: 'dodgerblue',
          },
          {
            label: 'Expense',
            data: [selectedExpenseData.amount],
            backgroundColor: '#ED2939', // Pantone Red
          },
        ],
      });
    }
  };

  // Function to handle closing the error dialog
  const handleCloseErrorDialog = () => {
    setShowErrorDialog(false);
  };

  return (
    <Box sx={{ maxWidth: 1000, margin: 'auto', marginTop: '80px', marginBottom: '80px' }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', textAlign: 'center', color: 'black' }} gutterBottom>
        Spending Analysis (2 Items)
      </Typography>

      <Paper sx={{ padding: '20px', marginBottom: '20px', backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'black', textAlign: 'center', padding: '10px' }}>
          Select Budget and Expense
        </Typography>

        <TextField
          id="select-budget"
          select
          label="Select Budget"
          value={selectedBudget}
          onChange={(e) => setSelectedBudget(e.target.value)}
          fullWidth
          SelectProps={{ style: { color: 'black', fontSize: 20, '&:before': { borderBottom: '1px solid black' }, '&:after': { borderBottom: '2px solid black' }} }}
          sx={{ marginBottom: '20px', input: { color: 'black', fontSize: 20 }, label: { color: 'black', fontWeight: 'bold', fontSize: 20 }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'black' }, '&:hover fieldset': {borderColor: '#C0C0C0' }} }}
        >
          {budgets.map((budget) => (
            <MenuItem key={budget.id} value={budget.id}>
              {budget.name} - Rs. {budget.amount}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          id="select-expense"
          select
          label="Select Expense"
          value={selectedExpense}
          onChange={(e) => setSelectedExpense(e.target.value)}
          fullWidth
          SelectProps={{ style: { color: 'black', fontSize: 20, '&:before': { borderBottom: '1px solid black' }, '&:after': { borderBottom: '2px solid black' }} }}
          sx={{ marginBottom: '20px', input: { color: 'black', fontSize: 20 }, label: { color: 'black', fontWeight: 'bold', fontSize: 20 }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'black' }, '&:hover fieldset': {borderColor: '#C0C0C0' }} }}
        >
          {expenses.map((expense) => (
            <MenuItem key={expense.id} value={expense.id}>
              {expense.name} - Rs. {expense.amount}
            </MenuItem>
          ))}
        </TextField>

        <Button sx={{ fontWeight: 'bold', fontSize: 20, width: 500, margin: 'auto', color: 'white', backgroundColor: '#343434', display: 'block' }} type="submit" variant="contained" color="primary" onClick={handleSelection} >
          Show Analysis
        </Button>
      </Paper>

      {/* Error Dialog */}
      <Dialog
        open={showErrorDialog}
        onClose={handleCloseErrorDialog}
        aria-labelledby="error-dialog-title"
        aria-describedby="error-dialog-description"
      >
        <DialogTitle id="error-dialog-title">Error</DialogTitle>
        <DialogContent>
          <DialogContentText id="error-dialog-description">
            Please select both a budget and an expense to show the analysis.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Chart */}
      {chartData && (
        <Paper sx={{ padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'black', textAlign: 'center' }}>
            Budget vs Expense
          </Typography>
          
          <Bar
            data={chartData}
            options={{
              plugins: {
                datalabels: {
                  display: true,
                  align: 'end',
                  anchor: 'end',
                  formatter: (value) => {
                    if (value !== null) {
                      return `Rs. ${value}`;
                    }
                    return '';
                  },
                  color: 'black',
                    font: {
                      weight: 'bold',
                      size: 20,
                    },
                },
              },
              scales: {
                x: {
                  ticks: {
                    color: 'black',
                    font: {
                      weight: 'bold',
                      size: 20,
                    },
                  },
                },
                y: {
                  ticks: {
                    color: 'black',
                    font: {
                      weight: 'bold',
                      size: 20,
                    },
                  },
                },
              },
            }}
            plugins={[ChartDataLabels]} // Add the plugin
          />
        </Paper>
      )}
    </Box>
  );
}

export default SpendingAnalysis;
