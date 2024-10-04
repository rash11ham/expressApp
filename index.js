const express = require('express')
const app = express()

//excersie 3.5 post
app.use(express.json())

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (req,res) => {
    res.send('<h1>Hello</h1>')
})
//exercise 3.1
app.get('/api/persons', (req,res) => {
    res.json(persons)
})

//exercise 3.2
app.get('/info', (req, res) => {
    res.send(`<h3>Phonebook has info for ${persons.length} people</h3>
        <br/>
        ${Date()}`)
})

//exercise 3.3
app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(p => p.id === id)
    if (!person) {
        res.status(404).send('no such person exist')
    } 
    res.json(person)
})

//exercise 3.4
app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    persons = persons.filter(p => p.id !== id)
    
    res.status(204).end()
})

//exercise 3.5
function generateId() {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(p => Number(p.id)))
        : 0
    return String(maxId+1)
}
app.post('/api/persons', (req, res) => {
    const body = req.body
    if (!body.name || !body.number) {
        res.status(400).json({
            error: "Contents cannot be empty"
        })
    } 
    const existingPerson = persons.find(p=> p.name === body.name)
    if (existingPerson) {
        res.status(409).json({
            error: "Name exists please try another name"
        })
    } 
    
    const person = {

    }
    res.json(person)
})

app.listen(3001, () => {
    console.log('app is connected')
})

