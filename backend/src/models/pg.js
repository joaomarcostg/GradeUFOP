module.exports = {

    knex: require('knex')({
        client: 'pg',
        connection: {
            host: '127.0.0.1',
            user: 'joaomarcostg',
            password: '12345678',
            database: 'GradeApp'
        }
    })
}