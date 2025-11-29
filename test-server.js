console.log('Starting test server...');
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('NutriTruth Backend is running!');
});

app.listen(PORT, () => {
    console.log(`🚀 Test server running on http://localhost:${PORT}`);
    console.log('✅ Server started successfully!');
});
