const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(bodyParser.json()); 

// MySQL Database Configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'node_user',     
    password: 'norm',  
    database: 'dataset_db'      
});

// Connect to MySQL Database
db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        process.exit(1); // Exit if the database connection fails
    }
    console.log('Connected to the database');
});

// GET Endpoint: In order by Cuisine_type
app.get('/restaurants', (req, res) => {
    const query = `
        SELECT restaurant, city, state, cuisine_type, website
        FROM nytimes_best_restaurants
        ORDER BY cuisine_type ASC;
    `; // Adjust ORDER BY as needed for extra credit

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err.stack);
            return res.status(500).send('Error reading data from database');
        }
        res.json(results); 
    });
});

// POST Endpoint: Insert a new restaurant
app.post('/restaurants', (req, res) => {
    const { restaurant, city, state, address, description, cuisine_type, head_chef_or_lead, website } = req.body;

    const query = `
        INSERT INTO nytimes_best_restaurants (restaurant, city, state, address, description, cuisine_type, head_chef_or_lead, website)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;

    db.query(query, [restaurant, city, state, address, description, cuisine_type, head_chef_or_lead, website], (err, results) => {
        if (err) {
            console.error('Error inserting data:', err.stack);
            return res.status(500).send('Error writing data to database');
        }
        res.json({ message: 'Restaurant added successfully', id: results.insertId });
    });
});

// PUT Endpoint: Update restaurant information
app.put('/restaurants/:id', (req, res) => {
    const { id } = req.params;
    const { restaurant, city, state, address, description, cuisine_type, head_chef_or_lead, website } = req.body;

    const query = `
        UPDATE nytimes_best_restaurants
        SET restaurant = ?, city = ?, state = ?, address = ?, description = ?, cuisine_type = ?, head_chef_or_lead = ?, website = ?
        WHERE id = ?;
    `;

    db.query(query, [restaurant, city, state, address, description, cuisine_type, head_chef_or_lead, website, id], (err, results) => {
        if (err) {
            console.error('Error updating data:', err.stack);
            return res.status(500).send('Error updating data in database');
        }
        res.json({ message: 'Restaurant updated successfully' });
    });
});

// DELETE Endpoint: Delete a restaurant
app.delete('/restaurants/:id', (req, res) => {
    const { id } = req.params;

    const query = `
        DELETE FROM nytimes_best_restaurants
        WHERE id = ?;
    `;

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting data:', err.stack);
            return res.status(500).send('Error deleting data from database');
        }
        res.json({ message: 'Restaurant deleted successfully' });
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
