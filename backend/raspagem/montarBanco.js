const fs = require('fs')
const pg = require('pg')
const jsontocsv = require('json2csv').parse
const arq_disc = './disciplinas.json'
const arq_depto = './departamentos.json'

const pool = new pg.Pool({
    user: 'joaomarcostg',
    password: '12345678',
    host: 'localhost',
    database: 'GradeApp',
    password: '12345678',
    port: 5432
})

const json_disc = fs.readFileSync(arq_disc, 'utf-8')
const json_depto = fs.readFileSync(arq_depto, 'utf-8')

//Essa função clona um objeto, pois por padrão no js, ao dar push em um objeto para o array, 
//ele repete sempre o primeiro push, por isso a necessidade de clonar o objeto
function clone(obj) {
    return JSON.parse(JSON.stringify(obj))
}


//Converte um JSON em um CSV e salva no diretório
function json2csv_Disciplina(json) {
    const csv = jsontocsv(json, {
        fields: ["nomeDisc", "codigoDisc", "turmaDisc", "horarioDisc", "professorDisc", "deptoDisc"]
    })
    fs.writeFileSync('./tabela_disciplina.csv', csv)
}

function json2csv_Departamento(json) {
    const csv = jsontocsv(json, {
        fields: ["nomeDepto", "siglaDepto"]
    })
    fs.writeFileSync('./tabela_departamento.csv', csv)
}

function json2csv_Professor(json) {
    const csv = jsontocsv(json, {
        fields: ["nomeProf", "deptoProf"]
    })
    fs.writeFileSync('./tabela_professor.csv', csv)
}   

//Gera um novo array que não contém elementos repetidos
function getUnique(arr, comp) {

    const unique = arr
         .map(e => e[comp])
  
       // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)
  
      // eliminate the dead keys & store unique objects
      .filter(e => arr[e]).map(e => arr[e]);
  
     return unique;
}

//Atualiza os dados dos professores para string, removendo informações desnecessárias
function atualizar_professor(text) {

    const resultado = text.replace(/\([^()]*\)/g, '')
    const data = resultado.split(/\ [/]*\ /g)

    return data

}

//Atualiza os horarios, deixando no modo que será utilizado pelo algoritmo da grade
function atualizar_horario(text) {
    const resultado = text.replace(/\([^()]*\)/g, '')
    const data = resultado.split(/\ [/]*\ /g)
    const array = []
    data.forEach(e => {
        const valor = e.split(/ /g)
        array.push(valor)
    })

    const data2 = []
    for (let i = 0; i < array.length; i++) {
        if (i < array.length - 1) {
            if (array[i][0] == array[i + 1][0]) {

                const arrayHorario1 = array[i][1].split(/-/g)
                const arrayHorario2 = array[i + 1][1].split(/-/g)
                array[i][1] = arrayHorario1[0] + '-' + arrayHorario2[1]
                array.splice(i + 1, 1)
            }
        }
        const str = array[i][0] + ' ' + array[i][1]
        data2.push(str)
    }

    return data2
}

//Altera o json obtido dos servidores da UFOP gerando os dados a serem fornecidos ao banco de Dados
function alterar_json(jsonDisc, jsonDepto) {
    const disc_obj = JSON.parse(jsonDisc)
    const depto_obj = JSON.parse(jsonDepto)

    const tabela_departamentos = []
    const departamento = {
        nomeDepto: '',
        siglaDepto: '',
    }
    const tabela_professores = []
    const professor = {
        nomeProf: [],
        deptoProf: ''
    }
    const tabela_disciplinas = []
    const disciplina = {
        nomeDisc: '',
        codigoDisc: '',
        turmaDisc: '',
        horarioDisc: [],
        professorDisc: [],
        deptoDisc: ''
    }


    for (depto in disc_obj) {
        disciplina.deptoDisc = depto
        professor.deptoProf = depto

        for (i in disc_obj[depto]) {
            professor.nomeProf = atualizar_professor(disc_obj[depto][i].professores)
            disciplina.nomeDisc = disc_obj[depto][i].disciplina
            disciplina.codigoDisc = disc_obj[depto][i].codigo
            disciplina.turmaDisc = disc_obj[depto][i].turma
            disciplina.horarioDisc = atualizar_horario(disc_obj[depto][i].horario)
            disciplina.professorDisc = atualizar_professor(disc_obj[depto][i].professores)
            tabela_disciplinas.push(clone(disciplina))
            tabela_professores.push(clone(professor))
        }
    }

    for (j in depto_obj) {
        departamento.nomeDepto = depto_obj[j].nome
        departamento.siglaDepto = depto_obj[j].sigla
        tabela_departamentos.push(clone(departamento))
    }

    for(let i=0; i<tabela_professores.length; i++){
        tabela_professores[i].nomeProf = tabela_professores[i].nomeProf.toString()
    }
    for(let i=0; i<tabela_disciplinas.length; i++){
        tabela_disciplinas[i].professorDisc = tabela_disciplinas[i].professorDisc.toString()
        tabela_disciplinas[i].horarioDisc = tabela_disciplinas[i].horarioDisc.toString()
    }
    

    const novatabelaprof = getUnique(tabela_professores, 'nomeProf')

    json2csv_Departamento(tabela_departamentos)
    json2csv_Professor(novatabelaprof)
    json2csv_Disciplina(tabela_disciplinas)
    
}

alterar_json(json_disc, json_depto)

