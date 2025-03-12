import React, { useState, useEffect } from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Button, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Grid } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // This is necessary to auto-register all the controllers
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the plugin

function SpendingAnalysis() {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedBudgets, setSelectedBudgets] = useState([]);
  const [selectedExpenses, setSelectedExpenses] = useState([]);
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

  // Function to handle the selection of budgets
  const handleBudgetSelection = (event) => {
    const selectedBudgetId = parseInt(event.target.name);
    if (event.target.checked) {
      setSelectedBudgets([...selectedBudgets, selectedBudgetId]);
    } else {
      setSelectedBudgets(selectedBudgets.filter(id => id !== selectedBudgetId));
    }
  };

  // Function to handle the selection of expenses
  const handleExpenseSelection = (event) => {
    const selectedExpenseId = parseInt(event.target.name);
    if (event.target.checked) {
      setSelectedExpenses([...selectedExpenses, selectedExpenseId]);
    } else {
      setSelectedExpenses(selectedExpenses.filter(id => id !== selectedExpenseId));
    }
  };

  // Function to handle the display of selected items
  const handleShowAnalysis = () => {
    // Check if any checkboxes are selected
    if ((selectedBudgets.length === 0 && selectedExpenses.length === 0) || (selectedBudgets.length === 0 && selectedExpenses.length === 1) || (selectedBudgets.length === 1 && selectedExpenses.length === 0)){
      setShowErrorDialog(true); // Show the error dialog
      return; // Exit the function
    }

    const selectedBudgetData = budgets.filter(budget => selectedBudgets.includes(budget.id));
    const selectedExpenseData = expenses.filter(expense => selectedExpenses.includes(expense.id));

    const labels = [];
    const budgetAmounts = [];
    const expenseAmounts = [];

    selectedBudgetData.forEach(budget => {
      labels.push(budget.name);
      budgetAmounts.push(budget.amount);
      expenseAmounts.push(null); // Push null to maintain alignment with expenses
    });

    selectedExpenseData.forEach(expense => {
      labels.push(expense.name);
      expenseAmounts.push(expense.amount);
      budgetAmounts.push(null); // Push null to maintain alignment with budgets
    });

    setChartData({
      labels: labels,
      datasets: [
        {
          label: 'Budget',
          data: budgetAmounts,
          backgroundColor: 'blue',
        },
        {
          label: 'Expense',
          data: expenseAmounts,
          backgroundColor: 'red',
        },
      ],
    });
  };

  // Function to handle closing the error dialog
  const handleCloseErrorDialog = () => {
    setShowErrorDialog(false);
  };

  return (
    <Box sx={{ maxWidth: 1000, margin: 'auto', marginTop: '80px', marginBottom:'80px' }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', textAlign: 'center', color: 'black' }} gutterBottom>
        Spending Analysis (Multiple Items)
      </Typography>

      <Paper sx={{ padding: '20px', marginBottom: '20px', backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'black', textAlign: 'center'}}>
          Select Budgets
        </Typography>
        
        <Grid container spacing={0} justifyContent="center">
          {budgets.map(budget => (
            <Grid item key={budget.id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedBudgets.includes(budget.id)}
                    onChange={handleBudgetSelection}
                    name={budget.id.toString()}
                  />
                }
                label={`${budget.name} - Rs. ${budget.amount}`}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Paper sx={{ padding: '20px', marginBottom: '20px', backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'black', textAlign: 'center'}}>
          Select Expenses
        </Typography>

        <Grid container spacing={0} justifyContent="center">
          {expenses.map(expense => (
            <Grid item key={expense.id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedExpenses.includes(expense.id)}
                    onChange={handleExpenseSelection}
                    name={expense.id.toString()}
                  />
                }
                label={`${expense.name} - Rs. ${expense.amount}`}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Button sx={{ fontWeight: 'bold', fontSize: 20, width: 500, margin: 'auto', color: 'white', backgroundColor: '#343434', display: 'block' }} type="submit" variant="contained" color="primary" onClick={handleShowAnalysis} >
        Show Analysis
      </Button>

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
            Please select at least one budget and expense to show the analysis.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Render analysis based on selected checkboxes */}
      {chartData && (
      <Paper sx={{ padding: '20px', marginTop: '20px', backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
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
