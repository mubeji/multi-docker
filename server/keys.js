// For connecting to redis and postgres
module.exports = {
    redisHost: process.env.REDIS_HOT,
    redisPort: process.env.REDIS_PORT,

    pgUser: process.env.PGUSER,
    pgHost: process.env.PGHOST,
    pgDatabase: process.env.PGDATABASE,
    pgPassword: process.env.PGPASSWORD,
    pgPort: process.env.PGPORT
}














