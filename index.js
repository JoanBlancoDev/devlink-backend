const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');
const path = require('path')

// Init app
const app = express();

// DB Connection
dbConnection();

// CORS
app.use(cors());

// Public Route
app.use( express.static('public') );

// Reading y Parsing's body
app.use( express.json() );

// Privates Routes
app.use('/api/auth', require('./routes/auth') );
app.use('/api/events', require('./routes/events') );
app.use('/api/user', require('./routes/user') );

app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

app.listen( process.env.PORT, () => console.log(`Server running port ${process.env.PORT}`) );