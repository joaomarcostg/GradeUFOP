const {knex} = require('../models/pg.js')
// const knex = require('knex')({
//     client: 'pg',
//     connection: {
//         host: '127.0.0.1',
//         user: 'joaomarcostg',
//         password: '5h4z4mCARAI',
//         database: 'GradeApp'
//     }
// })

module.exports = {
    
    async deptos (req, res) {
        try{
            const departamentos = await knex.select('*').from('Departamento')
            // console.log(departamentos)
            return res.json(departamentos)
        }
        catch(err){
            throw err
        }
    },

    async discs (req, res) {
        try{
            const {depto} = req.headers 
            const disciplinas = await knex.select('*').from('Disciplina').where({deptoDisc: depto})
            return res.json(disciplinas)
        }
        catch(err){
            throw err
        }
    },
    
    async turmas(req, res) {
        try{
            const {disc} = req.headers 
            const turmas = await knex.select('*').from('Disciplina').where({codigoDisc: disc})
            return res.json(turmas)
        }
        catch(err){
            throw err
        }
    }
}