import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, MenuItem, Paper, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function ExpenseManagement() {
  // State variables for form inputs, errors, and expenses
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [errors, setErrors] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customCategory, setCustomCategory] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [openCustomCategoryDialog, setOpenCustomCategoryDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  // Fetch expenses from the backend
  const fetchExpenses = async () => {
    try {
      const response = await fetch('http://localhost:9000/expenses');
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  // Use effect to fetch expenses and categories on component mount
  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  // Fetch categories from the backend
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:9000/budget-categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Function to handle form submission
  const handleSave = async (e) => {
    e.preventDefault();

    // Validate form inputs
    const errors = {};
    if (!expenseName.trim()) {
      errors.expenseName = 'Expense Name is required';
    }
    if (!expenseAmount.trim()) {
      errors.expenseAmount = 'Expense Amount is required';
    } else if (isNaN(expenseAmount)) {
      errors.expenseAmount = 'Expense Amount must be a number';
    }
    if (!expenseCategory.trim()) {
      errors.expenseCategory = 'Expense Category is required';
    }
    if (!expenseDate.trim()) {
      errors.expenseDate = 'Expense Date is required';
    }

    // If there are errors, set the state and return
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    // If there are no errors, save the expense
    const response = await fetch('http://localhost:9000/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: expenseName,
        amount: parseFloat(expenseAmount),
        category: expenseCategory,
        date: expenseDate,
      }),
    });

    if (!response.ok) {
      setDialogMessage('Failed to save expense. Please try again later.');
      setOpenErrorDialog(true);
      return;
    }

    // Fetch updated expense data
    fetchExpenses();

    // Reset form inputs and errors
    setExpenseName('');
    setExpenseAmount('');
    setExpenseCategory('');
    setExpenseDate('');
    setErrors({});

    // Show success message
    setDialogMessage('Expense saved successfully');
    setOpenSuccessDialog(true);
  };

  // Function to handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!expenseToDelete) return;

    const response = await fetch(`http://localhost:9000/expenses/${expenseToDelete}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      setDialogMessage('Failed to delete expense. Please try again later.');
      setOpenErrorDialog(true);
      setOpenDeleteDialog(false);
      return;
    }

    // Fetch updated expense data
    fetchExpenses();

    // Close delete dialog
    setOpenDeleteDialog(false);

    // Show success message
    setDialogMessage('Expense deleted successfully');
    setOpenSuccessDialog(true);
  };

  // Function to handle edit confirmation
  const handleConfirmEdit = async () => {
    if (!expenseToEdit) return;

    const response = await fetch(`http://localhost:9000/expenses/${expenseToEdit.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: expenseName,
        amount: parseFloat(expenseAmount),
        category: expenseCategory,
        date: expenseDate,
      }),
    });

    if (!response.ok) {
      setDialogMessage('Failed to edit expense. Please try again later.');
      setOpenErrorDialog(true);
      setOpenEditDialog(false);
      return;
    }

    // Fetch updated expense data
    fetchExpenses();

    // Reset form inputs and errors
    setExpenseName('');
    setExpenseAmount('');
    setExpenseCategory('');
    setExpenseDate('');
    setErrors({});

    // Close edit dialog
    setOpenEditDialog(false);

    // Show success message
    setDialogMessage('Expense edited successfully');
    setOpenSuccessDialog(true);
  };

  // Function to handle custom category submission
  const handleCustomCategorySubmit = async () => {
    if (!customCategory.trim()) return;

    const response = await fetch('http://localhost:9000/budget-categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: customCategory,
      }),
    });

    if (!response.ok) {
      setDialogMessage('Failed to save category. Please try again later.');
      setOpenErrorDialog(true);
      setOpenCustomCategoryDialog(false);
      return;
    }

    // Fetch updated categories
    fetchCategories();

    // Reset custom category input
    setCustomCategory('');

    // Close custom category dialog
    setOpenCustomCategoryDialog(false);

    // Show success message
    setDialogMessage('Category saved successfully');
    setOpenSuccessDialog(true);
  };

  return (
    <Box sx={{ maxWidth: 1000, margin: 'auto', marginTop: '80px', marginBottom:'80px' }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', textAlign: 'center', color: 'black' }} gutterBottom>
        Expense Tracking and Recording
      </Typography>

      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black', textAlign: 'center', padding: '5px' }} gutterBottom>
        Add Expense
      </Typography>

      {/* Expense Form */}
      <Box component="form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Expense Name */}
        <TextField
          id="expense-name"
          label="Expense Name"
          variant="outlined"
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
          error={!!errors.expenseName}
          helperText={errors.expenseName}
          required
          sx={{ input: { color: 'black', fontSize: 20 }, label: { color: 'black', fontWeight: 'bold', fontSize: 20 }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'black' }, '&:hover fieldset': {borderColor: '#C0C0C0' }}, backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
        />

        {/* Expense Amount */}
        <TextField
          id="expense-amount"
          label="Expense Amount (Rs.)"
          variant="outlined"
          type="number"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
          error={!!errors.expenseAmount}
          helperText={errors.expenseAmount}
          required
          sx={{ input: { color: 'black', fontSize: 20 }, label: { color: 'black', fontWeight: 'bold', fontSize: 20 }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'black' }, '&:hover fieldset': {borderColor: '#C0C0C0' }}, backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
        />

        {/* Expense Category */}
        <TextField
          id="expense-category"
          select
          label="Expense Category"
          variant="outlined"
          value={expenseCategory}
          onChange={(e) => setExpenseCategory(e.target.value)}
          error={!!errors.expenseCategory}
          helperText={errors.expenseCategory}
          required
          SelectProps={{ style: { color: 'black', fontSize: 20, '&:before': { borderBottom: '1px solid black' }, '&:after': { borderBottom: '2px solid black' }} }}
          sx={{ input: { color: 'black', fontSize: 20 }, label: { color: 'black', fontWeight: 'bold', fontSize: 20 }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'black' }, '&:hover fieldset': {borderColor: '#C0C0C0' }}, backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.name}>
              {category.name}
            </MenuItem>
          ))}
          {/* Option to add a custom category */}
          <MenuItem value="custom" onClick={() => setOpenCustomCategoryDialog(true)}>
            Add Custom Category
          </MenuItem>
        </TextField>

        {/* Expense Date */}
        <TextField
          id="expense-date"
          label="Expense Date"
          variant="outlined"
          type="date"
          value={expenseDate}
          onChange={(e) => setExpenseDate(e.target.value)}
          error={!!errors.expenseDate}
          helperText={errors.expenseDate}
          required
          sx={{ input: { color: 'black', fontSize: 20 }, label: { color: 'black', fontWeight: 'bold', fontSize: 20 }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'black' }, '&:hover fieldset': {borderColor: '#C0C0C0' }}, backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
          InputLabelProps={{
            shrink: true,
          }}
        />

        {/* Submit Button */}
        <Button sx={{ fontWeight: 'bold', fontSize: 20, width: 500, margin: 'auto', color: 'white', backgroundColor: '#343434' }} type="submit" variant="contained" >
          Add Expense
        </Button>
      </Box>

      {/* Custom Category Dialog */}
      <Dialog
        open={openCustomCategoryDialog}
        onClose={() => setOpenCustomCategoryDialog(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add Custom Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="custom-category"
            label="Category Name"
            type="text"
            fullWidth
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCustomCategoryDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCustomCategorySubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Display Expenses */}
      <Typography variant="h4" gutterBottom sx={{ marginTop: '20px', fontWeight: 'bold', color: 'black', textAlign: 'center', padding: '10px' }}>
        Expense List
      </Typography>

      {/*List of Expenses*/}
      <Grid container spacing={2}>
        {expenses.map((expense) => (
          <Grid item key={expense.id} xs={12} md={5} sx={{ margin: 'auto' }}>
            <Paper sx={{ padding: 2, backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
              <Typography variant="h5" sx={{ color: 'black', fontWeight: 'bold' }}>{expense.name}</Typography>
              <Typography variant="body1">Amount: Rs. {expense.amount}</Typography>
              <Typography variant="body1">Category: {expense.category}</Typography>
              <Typography variant="body1">Date: {expense.date}</Typography>
              {/* Edit Button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, marginTop: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => {
                    setExpenseToEdit(expense);
                    setExpenseName(expense.name);
                    setExpenseAmount(expense.amount.toString());
                    setExpenseCategory(expense.category);
                    setExpenseDate(expense.date);
                    setOpenEditDialog(true);
                  }}
                  sx={{ marginTop: '8px', marginRight: '8px' }} // Add margin for spacing
                >
                  Edit
                </Button>
                {/* Delete Button */}
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    setExpenseToDelete(expense.id);
                    setOpenDeleteDialog(true);
                  }}
                  sx={{ marginTop: '8px' }} // Add margin for spacing
                >
                  Delete
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this expense?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit Expense</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="expense-name"
            label="Expense Name"
            type="text"
            fullWidth
            value={expenseName}
            onChange={(e) => setExpenseName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="expense-amount"
            label="Expense Amount (Rs.)"
            type="number"
            fullWidth
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(e.target.value)}
          />
          <TextField
            select
            margin="dense"
            id="expense-category"
            label="Expense Category"
            fullWidth
            value={expenseCategory}
            onChange={(e) => setExpenseCategory(e.target.value)}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
            {/* Option to add a custom category */}
            <MenuItem value="custom" onClick={() => setOpenCustomCategoryDialog(true)}>
              Add Custom Category
            </MenuItem>
          </TextField>
          <TextField
            id="expense-date"
            label="Expense Date"
            variant="outlined"
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog
        open={openSuccessDialog}
        onClose={() => setOpenSuccessDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Success</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSuccessDialog(false)} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Dialog */}
      <Dialog
        open={openErrorDialog}
        onClose={() => setOpenErrorDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Error</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenErrorDialog(false)} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ExpenseManagement;