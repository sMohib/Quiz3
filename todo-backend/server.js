const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const todoRoutes = require('./routes/todoRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/tododb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use('/api/todos', todoRoutes);

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
