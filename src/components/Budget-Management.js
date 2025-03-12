import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, MenuItem, Paper, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function BudgetManagement() {
  // State variables for form inputs, errors, and budgets
  const [budgetName, setBudgetName] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [budgetCategory, setBudgetCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [errors, setErrors] = useState({});
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const [budgetToEdit, setBudgetToEdit] = useState(null);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [openCustomCategoryDialog, setOpenCustomCategoryDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  // Fetch budgets from the backend
  const fetchBudgets = async () => {
    try {
      const response = await fetch('http://localhost:9000/budgets');
      const data = await response.json();
      setBudgets(data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

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

  // Use effect to fetch budgets and categories on component mount
  useEffect(() => {
    fetchBudgets();
    fetchCategories();
  }, []);

  // Function to handle form submission
  const handleSave = async (e) => {
    e.preventDefault();

    // Validate form inputs
    const errors = {};
    if (!budgetName.trim()) {
      errors.budgetName = 'Budget Name is required';
    }
    if (!budgetAmount.trim()) {
      errors.budgetAmount = 'Budget Amount is required';
    } 
    else if (isNaN(budgetAmount)) {
      errors.budgetAmount = 'Budget Amount must be a number';
    }
    if (!budgetCategory.trim()) {
      errors.budgetCategory = 'Budget Category is required';
    }

    // If there are errors, set the state and return
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    // If there are no errors, save the budget
    const response = await fetch('http://localhost:9000/budgets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: budgetName,
        amount: parseFloat(budgetAmount),
        category: budgetCategory,
      }),
    });

    if (!response.ok) {
      setDialogMessage('Failed to save budget. Please try again later.');
      setOpenErrorDialog(true);
      return;
    }

    // Fetch updated budget data
    fetchBudgets();

    // Reset form inputs and errors
    setBudgetName('');
    setBudgetAmount('');
    setBudgetCategory('');
    setErrors({});

    // Show success message
    setDialogMessage('Budget saved successfully');
    setOpenSuccessDialog(true);
  };

  // Function to handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!budgetToDelete) return;

    const response = await fetch(`http://localhost:9000/budgets/${budgetToDelete}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      setDialogMessage('Failed to delete budget. Please try again later.');
      setOpenErrorDialog(true);
      setOpenDeleteDialog(false);
      return;
    }

    // Fetch updated budget data
    fetchBudgets();

    // Close delete dialog
    setOpenDeleteDialog(false);

    // Show success message
    setDialogMessage('Budget deleted successfully');
    setOpenSuccessDialog(true);
  };

  // Function to handle edit confirmation
  const handleConfirmEdit = async () => {
    if (!budgetToEdit) return;

    const response = await fetch(`http://localhost:9000/budgets/${budgetToEdit.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: budgetName,
        amount: parseFloat(budgetAmount),
        category: budgetCategory,
      }),
    });

    if (!response.ok) {
      setDialogMessage('Failed to edit budget. Please try again later.');
      setOpenErrorDialog(true);
      setOpenEditDialog(false);
      return;
    }

    // Fetch updated budget data
    fetchBudgets();

    // Reset form inputs and errors
    setBudgetName('');
    setBudgetAmount('');
    setBudgetCategory('');
    setErrors({});

    // Close edit dialog
    setOpenEditDialog(false);

    // Show success message
    setDialogMessage('Budget edited successfully');
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
    <Box sx={{ maxWidth: 1000, margin: 'auto', marginTop: '80px', marginBottom:'80px'}}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', textAlign: 'center', color: 'black' }} gutterBottom>
        Budget Management
      </Typography>

      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black', textAlign: 'center', padding: '5px' }} gutterBottom>
        Add Budget
      </Typography>
      
      {/* Budget Form */}
      <Box component="form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Budget Name */}
        <TextField
          id="budget-name"
          label="Budget Name"
          variant="outlined"
          value={budgetName}
          onChange={(e) => setBudgetName(e.target.value)}
          error={!!errors.budgetName}
          helperText={errors.budgetName}
          required
          sx={{ input: { color: 'black', fontSize: 20 }, label: { color: 'black', fontWeight: 'bold', fontSize: 20 }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'black' }, '&:hover fieldset': {borderColor: '#C0C0C0' }}, backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
        />

        {/* Budget Amount */}
        <TextField
          id="budget-amount"
          label="Budget Amount (Rs.)"
          variant="outlined"
          type="number"
          value={budgetAmount}
          onChange={(e) => setBudgetAmount(e.target.value)}
          error={!!errors.budgetAmount}
          helperText={errors.budgetAmount}
          required
          sx={{ input: { color: 'black', fontSize: 20 }, label: { color: 'black', fontWeight: 'bold', fontSize: 20 }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'black' }, '&:hover fieldset': {borderColor: '#C0C0C0' }}, backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
        />

        {/* Budget Category */}
        <TextField
          id="budget-category"
          select
          label="Budget Category"
          variant="outlined"
          value={budgetCategory}
          onChange={(e) => setBudgetCategory(e.target.value)}
          error={!!errors.budgetCategory}
          helperText={errors.budgetCategory}
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
        
        {/* Submit Button */}
        <Button sx={{ fontWeight: 'bold', fontSize: 20, width: 500, margin: 'auto', color: 'white', backgroundColor: '#343434' }} type="submit" variant="contained" >
          Add Budget
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

      {/* Display Budgets */}
      <Typography variant="h4" gutterBottom sx={{ marginTop: '20px', fontWeight: 'bold', color: 'black', textAlign: 'center', padding: '10px' }}>
        Budget List
      </Typography>
      
      {/* List of budgets */}
      <Grid container spacing={2}>
        {budgets.map((budget) => (
          <Grid item key={budget.id} xs={12} md={5} sx={{ margin: 'auto' }}>
            <Paper sx={{ padding: 2, backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
              <Typography variant="h5" sx={{ color: 'black', fontWeight: 'bold' }}>
                {budget.name}
              </Typography>
              <Typography variant="body1" sx={{ color: 'black' }}>
                Amount: Rs. {budget.amount}
              </Typography>
              <Typography variant="body1" sx={{ color: 'black' }}>
                Category: {budget.category}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, marginTop: 1 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<EditIcon />}
                  onClick={() => {
                    setBudgetToEdit(budget);
                    setBudgetName(budget.name);
                    setBudgetAmount(budget.amount.toString());
                    setBudgetCategory(budget.category);
                    setOpenEditDialog(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    setBudgetToDelete(budget.id);
                    setOpenDeleteDialog(true);
                  }}
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
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Delete Budget</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this budget?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Confirmation Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        aria-labelledby="edit-dialog-title"
      >
        <DialogTitle id="edit-dialog-title">Edit Budget</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="edit-budget-name"
            label="Budget Name"
            type="text"
            fullWidth
            value={budgetName}
            onChange={(e) => setBudgetName(e.target.value)}
            sx={{ input: { color: 'black' }, label: { color: 'black' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'black' } } }}
          />
          <TextField
            margin="dense"
            id="edit-budget-amount"
            label="Budget Amount"
            type="number"
            fullWidth
            value={budgetAmount}
            onChange={(e) => setBudgetAmount(e.target.value)}
            sx={{ input: { color: 'black' }, label: { color: 'black' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'black' } } }}
          />
          <TextField
            margin="dense"
            id="edit-budget-category"
            select
            label="Budget Category"
            fullWidth
            value={budgetCategory}
            onChange={(e) => setBudgetCategory(e.target.value)}
            sx={{ input: { color: 'black' }, label: { color: 'black' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'black' } } }}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
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
        aria-labelledby="success-dialog-title"
      >
        <DialogTitle id="success-dialog-title">Success</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSuccessDialog(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Dialog */}
      <Dialog
        open={openErrorDialog}
        onClose={() => setOpenErrorDialog(false)}
        aria-labelledby="error-dialog-title"
      >
        <DialogTitle id="error-dialog-title">Error</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenErrorDialog(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default BudgetManagement;
