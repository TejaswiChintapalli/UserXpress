const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const readline = require('readline');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const dbConfig = {
  // Database configuration
  host: 'test-project.rds.24g.dev',
  user: 'tchintapalli',
  password: 'ROfNBzmb6I6hW8v9kWsJYl1lro6g',
  database: 'tchintapalli',
};

const db = mysql.createConnection(dbConfig);
db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('Connected to the database');
});

// Create User
app.post('/users', (req, res) => {
  const { firstName, lastName } = req.body;
  if (!firstName || !lastName) {
    return res.status(400).json({ error: 'Both firstName and lastName are required' });
  }

  const user = { firstName, lastName };
  db.query('INSERT INTO Users SET ?', user, (dbError, results) => {
    if (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ error: 'User creation failed' });
    }

    const userId = results.insertId;
    console.log('Created User ID:', userId);

    // Return the user ID as JSON response
    res.json({ id: userId });
  });
});

// Retrieve User
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;

  // Check if userId is a valid number (you can add more validation as needed)
  if (isNaN(userId) || userId <= 0) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  // Query the database to retrieve user data
  db.query('SELECT * FROM Users WHERE id = ?', userId, (dbError, results) => {
    if (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ error: 'Error retrieving user data' });
    }

    // Check if a user with the provided ID exists
    if (results.length === 0) {
      console.log('User not found for ID:', userId); 
      return res.status(404).json({ error: 'User not found' });
    }

    // User data found, send it as a JSON response
    const userData = results[0]; // Assuming the query returns only one result
    console.log('User data retrieved for ID:', userId);
    console.log(userData)
    res.json(userData);
  });
});

// Update User
app.patch('/users/:id', (req, res) => {
  const userId = req.params.id;
  const updatedUserData = req.body; 

  // Check if userId is a valid number and user data is provided
  if (isNaN(userId) || userId <= 0 || !updatedUserData) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  // Query the database to update user data
  db.query('UPDATE Users SET ? WHERE id = ?', [updatedUserData, userId], (dbError, results) => {
    if (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ error: 'Error updating user data' });
    }

    // Check if a user with the provided ID exists
    if (results.affectedRows === 0) {
      // Log the error details on the server-side
      console.error('User not found for update:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    // User data updated successfully
    // Retrieve the updated user data from the database
    db.query('SELECT * FROM Users WHERE id = ?', userId, (selectError, selectResults) => {
      if (selectError) {
        console.error('Database error:', selectError);
        return res.status(500).json({ error: 'Error retrieving updated user data' });
      }

     // Log the updated user data on the server-side
     const updatedUser = selectResults[0];
     console.log('Updated User Data:', updatedUser);

    // User data updated successfully
    res.sendStatus(204)
   });
  });
});



// Delete User
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;

  // Check if userId is a valid number
  if (isNaN(userId) || userId <= 0) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  // Query the database to delete the user
  db.query('DELETE FROM Users WHERE id = ?', userId, (dbError, results) => {
    if (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ error: 'Error deleting user' });
    }

    // Check if a user with the provided ID was deleted
    if (results.affectedRows === 0) {
      console.error(`ID not found for deletion: ${userId}`);
      return res.status(404).json({ error: 'User not found' });
    }

    // User deleted successfully
    console.log(`User deleted successfully for id: ${userId}`);
    res.sendStatus(204);
  });
});


// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

