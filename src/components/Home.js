// Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Grid, Card, CardActionArea, CardMedia, CardContent, Typography } from '@mui/material';
import budgetImg from '../assets/budget.jpg'; // Replace with the actual path to your image
import expenseImg from '../assets/expense.jpg'; // Replace with the actual path to your image
import analysis2Img from '../assets/analysis.jpg'; // Replace with the actual path to your image
import analysisMultiImg from '../assets/analysis.jpg'; // Replace with the actual path to your image

const Home = () => {
  const pages = [
    { title: 'Budget Management', path: '/budget-management', image: budgetImg },
    { title: 'Expense Tracking and Recording', path: '/expense-tracking-and-recording', image: expenseImg },
    { title: 'Spending Analysis (2 Items)', path: '/spending-analysis-(2-items)', image: analysis2Img },
    { title: 'Spending Analysis (Multiple Items)', path: '/spending-analysis-(multiple-items)', image: analysisMultiImg },
  ];

  return (
    <Box sx={{ maxWidth: 1000, margin: 'auto', marginTop: '100px', marginBottom:'80px' }}>
      <Grid container spacing={4} sx={{ margin: 'auto' }}>
        {pages.map((page) => (
          <Grid item xs={12} sm={6} md={6} key={page.title} sx={{ margin: 'auto' }}>
            <Link to={page.path} style={{ textDecoration: 'none' }}>
              <Card>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="200"
                    image={page.image}
                    alt={page.title}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', color: '#1976d2' }}>
                      {page.title}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;
