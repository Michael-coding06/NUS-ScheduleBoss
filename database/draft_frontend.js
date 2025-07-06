const userEmail = 'khoa@gmail.com';

fetch(`http://localhost:1000/api/draft/${userEmail}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        sections: [
            {name: 'Module', visibility: {default: false}, display: {default: false}, spans: []},
            {name: 'Task', visibility: {default: true}, display: {default: true}, spans: []},
        ],
        spans: [
            { day: 'monday', start: '10:00', end: '12:00', name: 'Chores', type: 'Task', visibility: {default: true} },
            { day: 'thursday', start: '10:00', end: '12:00', name: 'CS1231', type: 'Module', visibility: {default: true} }
        ],
        deleteSections: ['Module'],
        deleteSpans: ['CS2040C']
    })
})
.then(res => res.json())
.then(data => console.log('Backend response:', data))
  