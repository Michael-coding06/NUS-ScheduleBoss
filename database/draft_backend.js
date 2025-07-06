const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const database = require('./draft');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Khoa:aohk.kvt.2081@khoatyme.1ooufq1.mongodb.net/khoatyme?retryWrites=true&w=majority&appName=KhoaTyme')
    // .then(async () => {
    //     await database.deleteMany({});
    //     console.log('Database cleared!');
    // })    
    .then(() => console.log('Connected to MongoDB'))

app.post('/api/draft/:userEmail', async (req, res) => {
    const { userEmail } = req.params;
    const {sections, spans, deleteSections = [], deleteSpans = []} = req.body;
    console.log('Received data:', { userEmail, sections, spans, deleteSections, deleteSpans });

    const existingDoc = await database.findOne({ userEmail });
    let finalSections = [] ;

    if (existingDoc) {
        const existingSections = existingDoc.sections.filter(
            s => !sections.some(fs => fs.name === s.name) && !deleteSections.includes(s.name)
        );
        finalSections = [...existingSections, ...sections];
    }else{
        finalSections = sections;
    }

    finalSections = finalSections.map(section => {
        const sectionSpans = spans.filter(span => span.type === section.name);
        let existingSpans = existingDoc && existingDoc.sections ? existingDoc.sections.find(s => s.name === section.name)?.spans || []: [];
        existingSpans = existingSpans.filter(existingSpan => 
            !sectionSpans.some(sectionSpan => sectionSpan.name === existingSpan.name) &&
            !deleteSpans.includes(existingSpan.name))
        return{
            name: section.name,
            visibility: section.visibility,
            display: section.display,
            spans: [...existingSpans, ...sectionSpans]
        }
    })


    await database.findOneAndUpdate(
        { userEmail }, 
        {
            $set: {
                sections: finalSections,
            }
        },
        { upsert: true}
    )
    
    const full_database = await database.find({});
    console.log('Database:', JSON.stringify(full_database, null, 2));
    res.json({ message: 'Saved successfully' });
});



app.listen(1000, () => {
    console.log('Draft backend running on port 1000');
});