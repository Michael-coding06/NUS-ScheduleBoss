const prereq_Tree = require('./module_prerequisites.json')
export const recommended_modules = [
  { name: 'CS4222', info: 'Wireless Networking' },
  { name: 'EE4205', info: 'Quantum Computing and Communication' },
  { name: 'EE4210', info: 'Network Protocols and Applications' },
  { name: 'CS5223', info: 'Distributed Systems' },
  { name: 'CS5321', info: 'Network Security' },
  { name: 'EE5135', info: 'Digital Communications' }
];



export const core_modules = {
  'Sem 8': [
    { name: 'CS4226', info: 'Internet Architecture' },
  ],
  'Sem 7': [
    { name: 'EE4204', info: 'Computer Networks' },
  ],
  'Sem 6': [
    {name: 'CG2271', info: 'RTOS'}
  ],
  'Sem 5': [
    {name: 'CG3201', info: 'ML and DL'},
  ],
  'Sem 4': [
    {name: 'EE2211', info: 'Machine Learning'},
    {name: 'CS2113', info: 'Software Engineering and OOP'}
  ],
  'Sem 3': [
    {name: 'CS2040C', info: 'Data Structures and Algorithms'},
    {name: 'CS1231', info: 'Discrete Structure'}
  ],
  'Sem 2': [
    {name: 'MA1508E', info: 'Linear Algebra'},
    {name: 'CS1010', info: 'Linear Algebra'}
  ],
  'Sem 1': [
    {name: 'MA1512', info: 'EPP1'},
    {name: 'MA1511', info: 'Programming Methodology'}
  ]
}

export const prereq_tree = prereq_Tree