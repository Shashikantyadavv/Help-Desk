const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();
app.use(express.json());
app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

mongoose.connect('mongodb://127.0.0.1:27017/?readPreference=primary&ssl=false&directConnection=true')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));


app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
