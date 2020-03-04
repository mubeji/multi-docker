// For connecting to redis, watching for changes and fibonacci caluclations

// For storing keys needed for redis connection (hostname & port)
const keys = require('./keys')
const redis = require('redis')

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,

    // If connection is lost retry every 1000 ms
    retry_strategy: () => 1000  
})

// Subscription
const sub = redisClient.duplicate()

function fib(index) {
    if (index < 2) return 1;
    return fib(index - 1) + fib(index - 2)
}

// Each time we get a new value in redis, we calculate an new
// fibonacci value, then insert that into a hash called values
sub.on('message', (chanel, message) => {
    redisClient.hset('values', message, fib(parseInt(message)))
})

// Sucbscribe to any insert event
sub.subscribe('insert')














