const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const fs = require('fs');
const DATA_FILE = 'spans.json';

app.use(cors());
app.use(express.json());

let receivedspans = {};
if(fs.existsSync(DATA_FILE)){
    receivedspans = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

//receive data from frontend
app.post('/api/timetable', (req, res) => {
    const {spans, userEmail} = req.body;    
    receivedspans[userEmail] = spans;

    fs.writeFileSync(DATA_FILE, JSON.stringify(receivedspans));

    console.log(receivedspans);
    res.json({ message: 'Spans saved' });
});

//send data to frontend
app.get('/api/timetable_data', (req, res) => {
    res.json({ receivedspans });
});

const staticpath = path.join(__dirname, '../frontend/build');
app.use(express.static(staticpath));
app.get('/', (req, res) => {
    res.sendFile(path.join(staticpath, 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Initial data:', receivedspans);
});