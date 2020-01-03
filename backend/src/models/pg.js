module.exports = {

    knex: require('knex')({
        client: 'pg',
        connection: {
            host: '127.0.0.1',
            user: 'joaomarcostg',
            password: '5h4z4mCARAI',
            database: 'GradeApp'
        }
    })
}