const knex = require('knex')({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'joaomarcostg',
        password: '5h4z4mCARAI',
        database: 'GradeApp'
    }
})

const discs = async (depto, flag) => {
    try{
        const resp = await knex.select('*').from('Disciplina').where({deptoDisc: depto})
        return resp
    }
    catch(err){
        console.log(err)
    }
}

