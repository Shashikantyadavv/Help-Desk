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

mongoose.connect('mongodb+srv://sashikant12rao:4RbwhEy2RRJ26c0C@cluster0.xomqr.mongodb.net/').then(() => console.log("MongoDB connected....")).catch((err) => console.log(err.message));


app.get('/',(req,res)=>{
    res.status(200).send("Yup, Your Server is running....🎉🎉");
  })
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
