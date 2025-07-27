const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

const dotenv = require('dotenv');
dotenv.config();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const database = require('./database');
const database_chatbot = require('./database_chatbot')
const mongoose = require('mongoose');
const DATABASE_URL = process.env.DATABASE_URL
mongoose.connect(DATABASE_URL)
    // .then(async () => {
    //     await database.deleteMany({});
    //     console.log('Database cleared!');
    // })    
    // .then(async () => {
    //     await database_chatbot.deleteMany({});
    //     console.log('Chatbot database cleared!');
    // })    
    .then(() => console.log('Connected to MongoDB'))


//receive data from frontend
app.post('/api/timetable/:userEmail', async (req, res) => {
    const { userEmail } = req.params;
    const {sections, spans, colors} = req.body;
    console.log('Received data:', { userEmail, sections, spans, colors});
    await database.findOneAndUpdate(
        { userEmail }, 
        {
            $set: {
                sections: sections,
                spans: spans,
                colors: colors
            }
        },
        { upsert: true}
    )
    res.json({message: 'Data saved'})
});

app.post('/api/chatbot/:userEmail', async (req, res) => {
    const {userEmail} = req.params;
    const {chatActive, messages} = req.body;
    console.log('Received data:', { userEmail, chatActive, messages});

    await database_chatbot.findOneAndUpdate(
        { userEmail }, 
        {
            $set: {
                chatActive: chatActive,
            },
            $push: {
                messages: messages,
            }
        },
        {upsert: true, new: true}
    )
    
    res.json({message: 'Data for chatbot is saved: '})
});

//send data to frontend
app.get('/ping', async(req, res) => {
    console.log('OKE')
    res.send('OKE')
});
app.get('/api/timetable_data/:userEmail', async(req, res) => {
    const {userEmail} = req.params;
    const data = await database.findOne({userEmail});
    console.log(data)
    res.json({data})
});
app.get('/api/chatbot/:userEmail', async(req, res) => {
    const {userEmail} = req.params;
    const data = await database_chatbot.findOne(
        {userEmail},
        { messages: { $slice: -3 }, chatActive: 1, _id: 0 }
    );
    console.log(data)
    res.json({data})
});

const staticpath = path.join(__dirname, '../frontend/build');
app.use(express.static(staticpath));

app.get('/', (req, res) => {
    res.sendFile(path.join(staticpath, 'index.html'));
});

const port = process.env.PORT || 3001;
app.listen(port, async() => {
    const data =  await database.findOne({});
    console.log(`Server running on ${port}`);
});


