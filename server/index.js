
const redis = require('redis')

// express app setup 
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const keys = require('./keys')



const app = express()
// Cross Origin Resource Sharing,
// lets us make requests from one domain to another,
// i.e. from react to node
app.use(cors())
app.use(bodyParser.json())

// prostgres client setup
const { Pool } = require('pg')

const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
})

pgClient.on('error', () => console.log('Lost PG connection'))

pgClient
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch(err => console.log(err))


// Redis client setup
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
})

const redisPublisher  = redisClient.duplicate()


// Express route handlers
app.get('/', (req, res) => {
    res.send('Hi!')
})

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query("SELECT * FROM values")
    console.log('XxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', values.rows)
    res.send(values.rows)
})

// Get data from redis
app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values)
    })
})


app.post('/values', async (req, res) => {
    const index = req.body.index 
    // Restrict user from entering too big an number
    if (parseInt(index) > 40) {
        return res.status(422).send("Sorry Index too high")
    }
    
    redisClient.hset('values', index, 'Nothing yet??') 

    redisPublisher.publish('insert', index)

    pgClient.query("INSERT INTO  values(number) VALUES($1)", [index])

    res.send({ working: true })
})


const port = 5000
app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
})







