const pg = require('pg')

const pool = new pg.Pool({
    user: 'joaomarcostg',
    password: '5h4z4mCARAI',
    host: 'localhost',
    database: 'GradeApp',
    password: '5h4z4mCARAI',
    port: 5432
})

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj))
}

const disc_adicionadas = []
const array_disciplinas = []
let departamentos_array, disciplinas_array, turmas_array, departamento, turma, disciplina


function mudarHoras(elemento) {

    if (elemento == '13:30-15:10') {
        elemento = 0
    } else if (elemento == '15:20-17:00') {
        elemento = 1

    } else if (elemento == '17:10-18:50') {
        elemento = 2

    } else if (elemento == '19:00-20:40') {
        elemento = 3

    } else if (elemento == '21:00-22:40') {
        elemento = 4
    }
    return elemento
}

function mudarFormato_Horario(elemento) {

    elemento = elemento.split(/,/g)

    for (let i = 0; i < elemento.length; i++) {
        elemento[i] = elemento[i].split(/ /g)
    }

    elemento.forEach(element => {
        if (element[0] == 'SEG') {
            element[0] = 0
            element[1] = mudarHoras(element[1])
        } else if (element[0] == 'TER') {
            element[0] = 1
            element[1] = mudarHoras(element[1])
        } else if (element[0] == 'QUA') {
            element[0] = 2
            element[1] = mudarHoras(element[1])
        } else if (element[0] == 'QUI') {
            element[0] = 3
            element[1] = mudarHoras(element[1])
        } else if (element[0] == 'SEX') {
            element[0] = 4
            element[1] = mudarHoras(element[1])

        }
    })
    return elemento
}

function segundo_dia_disponivel(grade, dia, horario) {
    if (grade[dia][horario] == null) {
        return true
    } else {
        return false
    }
}

function grade_vazia() {
    let i, j
    let grade = [
        []
    ]
    for (j = 0; j < 5; j++) {
        grade[j] = []
    }
    for (j = 0; j < 5; j++) {
        for (i = 0; i < 5; i++) {
            grade[j][i] = null
        }
    }
    return grade
}

function matriz_array() {
    let i, j
    let grade = [
        []
    ]
    for (j = 0; j < 5; j++) {
        grade[j] = []
    }
    for (j = 0; j < 5; j++) {
        for (i = 0; i < 5; i++) {
            grade[j][i] = []
        }
    }
    return grade
}

function remover(array) {

    i = array.indexOf('0')
    if (i === -1) {
        return array
    } else {
        array.splice(i, 1)
        return remover(array)
    }
}

function removerConcorrentes(disciplinas_escolhidas, dia, horario) {
    copia = clone(disciplinas_escolhidas)
    for (let i = 0; i < copia.length; i++) {
        if (copia[i].horarioDisc.length == 2) {
            if ((copia[i].horarioDisc[0][0] == dia && copia[i].horarioDisc[0][1] == horario) ||
                (copia[i].horarioDisc[1][0] == dia && copia[i].horarioDisc[1][1] == horario)) {
                copia[i] = '0'
            }
        } else {
            if (copia[i].horarioDisc[0][0] == dia && copia[i].horarioDisc[0][1] == horario) {
                copia[i] = '0'
            }
        }
    }

    return remover(copia)
}

function removerMesmaDisciplina(disciplinas_escolhidas, disciplina_atual) {
    copia = clone(disciplinas_escolhidas)
    for (let i = 0; i < copia.length; i++) {
        if (copia[i].codigoDisc == disciplina_atual.codigoDisc) {
            copia[i] = '0'
        }
    }

    return remover(copia)
}

function procurarDisponivel(grade, disciplinas_escolhidas, dia, horario) {
    const indices = []

    disciplinas_escolhidas.forEach((element, index) => {
        if (element.horarioDisc.length == 1) {
            if (element.horarioDisc[0][0] == dia && element.horarioDisc[0][1] == horario) {
                indices.push(index)
            }
        } else if (element.horarioDisc.length == 2) {
            if (element.horarioDisc[0][0] == dia && element.horarioDisc[0][1] == horario) {
                if (segundo_dia_disponivel(grade, dia, horario) == true) {
                    indices.push(index)
                }
            }
        }
    })
    return indices
}

function montargrades(disciplinas_escolhidas, grade, dia, horario, array_grades, cont, minimo) {

    copia = removerConcorrentes(disciplinas_escolhidas, dia, horario)
    if (grade[dia][horario] == null) {
        indices = procurarDisponivel(grade, disciplinas_escolhidas, dia, horario)
        if (indices.length > 0) {
            for (let i = 0; i < indices.length; i++) {
                copiagrade = clone(grade)
                copia2 = removerMesmaDisciplina(copia, disciplinas_escolhidas[i])
                if (disciplinas_escolhidas[i].horarioDisc.length == 1) {

                    copiagrade[dia][horario] = `${disciplinas_escolhidas[i].codigoDisc} - T${disciplinas_escolhidas[i].turmaDisc}`

                    if (horario == 4) {
                        if (dia == 4) {
                            if (cont >= minimo) {
                                array_grades.push(copiagrade)
                            }
                            return;
                        } else {
                            return montargrades(copia2, copiagrade, dia + 1, 0, array_grades, cont + 1, minimo)
                        }
                    } else {
                        return montargrades(copia2, copiagrade, dia, horario + 1, array_grades, cont + 1, minimo)
                    }


                } else {

                    dia2 = disciplinas_escolhidas[i].horarioDisc[1][0]
                    horario2 = disciplinas_escolhidas[i].horarioDisc[1][1]
                    copiagrade[dia][horario] = `${disciplinas_escolhidas[i].codigoDisc} - T${disciplinas_escolhidas[i].turmaDisc}`
                    copiagrade[dia2][horario2] = `${disciplinas_escolhidas[i].codigoDisc} - T${disciplinas_escolhidas[i].turmaDisc}`
                    copia3 = removerConcorrentes(copia2, dia2, horario2)

                    if (horario == 4) {
                        if (dia == 4) {
                            if (cont >= minimo) {
                                array_grades.push(copiagrade)
                            }
                            return;
                        } else {
                            return montargrades(copia3, copiagrade, dia + 1, 0, array_grades, cont + 1, minimo)
                        }
                    } else {
                        return montargrades(copia3, copiagrade, dia, horario + 1, array_grades, cont + 1, minimo)
                    }
                }
            }
        } else {
            if (horario == 4) {
                if (dia == 4) {
                    if (cont >= minimo) {
                        array_grades.push(copiagrade)
                    }
                    return;
                } else {
                    return montargrades(copia, grade, dia + 1, 0, array_grades, cont, minimo)
                }
            } else {
                return montargrades(copia, grade, dia, horario + 1, array_grades, cont, minimo)
            }
        }
    } else {
        if (horario == 4) {
            if (dia == 4) {
                if (cont >= minimo) {
                    array_grades.push(copiagrade)
                }
                return;
            } else {
                return montargrades(copia, grade, dia + 1, 0, array_grades, cont, minimo)
            }
        } else {
            return montargrades(copia, grade, dia, horario + 1, array_grades, cont, minimo)
        }
    }
}

function gerarGrade(disciplinas_escolhidas, grade, matriz_opcoes) {
    for (let dia = 0; dia < 5; dia++) {
        for (let horario = 0; horario < 5; horario++) {

            indices = procurarDisponivel(grade, disciplinas_escolhidas, dia, horario)
            copia = removerConcorrentes(disciplinas_escolhidas, dia, horario)

            if (grade[dia][horario] == null) {
                for (let i = 0; i < indices.length; i++) {

                    grade_copia = clone(grade)
                    let index = indices[i]
                    copia2 = removerMesmaDisciplina(copia, disciplinas_escolhidas[index])


                    if (disciplinas_escolhidas[index].horarioDisc.length == 1) {

                        grade_copia[dia][horario] = `${disciplinas_escolhidas[index].codigoDisc} - T${disciplinas_escolhidas[index].turmaDisc}`
                        array = [grade_copia, copia2]
                        matriz_opcoes[dia][horario].push(array)

                    } else {

                        dia2 = disciplinas_escolhidas[index].horarioDisc[1][0]
                        horario2 = disciplinas_escolhidas[index].horarioDisc[1][1]
                        grade_copia[dia][horario] = `${disciplinas_escolhidas[index].codigoDisc} - T${disciplinas_escolhidas[index].turmaDisc}`
                        grade_copia[dia2][horario2] = `${disciplinas_escolhidas[index].codigoDisc} - T${disciplinas_escolhidas[index].turmaDisc}`
                        copia3 = removerConcorrentes(copia2, dia2, horario2)
                        array = [grade_copia, copia3]
                        matriz_opcoes[dia][horario].push(array)

                    }

                }
            }
        }
    }
}




function queryMaker(database, array_disciplinas) {

    return new Promise((resolve, reject) => {

        database.query('select * from "Departamento"') // faz uma selecao em todos departamentos
            .then(table => {
                departamentos_array = table.rows // esse array de departamentos recebe essa lista de departamentos

                j = getRandomInt(0, departamentos_array.length) // aqui estou gerando um valor aleatorio, para escolher um departamento aleatorio
                departamento = departamentos_array[j].siglaDepto // no frontend o usuario que escolhe o departamento, esse atributo 'departamento' deve receber o departamento que o usuario escolheu
                if (departamento != null) {
                    return database.query(`select * from "Disciplina" where "deptoDisc" = '${departamento}'`) //depois de selecionado o departamento, busco todas disciplinas pertencentes a este departamento
                        .then(table => {

                            disciplinas_array = table.rows //esse array de disciplinas recebe a lista das disciplinas em tal depto
                            while (true) {
                                j = getRandomInt(0, disciplinas_array.length) //gero um valor aleatorio de novo, mas no front quem escolhe e o usuario
                                if (disc_adicionadas.indexOf(j) == -1) {
                                    disc_adicionadas.push(j)
                                    disciplina = disciplinas_array[j].codigoDisc
                                    break
                                }
                            }
                            return database.query(`select * from "Disciplina" where "codigoDisc" = '${disciplina}'`) //depois de escolhida a disciplina mostro a(s) turma(s) disponivel/disponiveis
                                .then(table => {
                                    turmas_array = table.rows
                                    j = Math.round(Math.random())

                                    if (j == 0) {
                                        k = getRandomInt(0, turmas_array.length) //sorteio se a turma vai ser nula ou vai ser escolhida aleatoriamente
                                        turma = turmas_array[k].turmaDisc
                                    } else {
                                        turma = null
                                    }

                                    if (turma == null) { //se for nula recebo a lista de turmas daquela disciplina
                                        return database.query(`select "nomeDisc", "codigoDisc", "turmaDisc", "horarioDisc", "professorDisc" from PUBLIC."Disciplina" where "deptoDisc" = '${departamento}' and "codigoDisc" = '${disciplina}'`)
                                            .then(table => {
                                                disciplina = table.rows

                                                disciplina.forEach(element => {
                                                    array_disciplinas.push(element)
                                                })
                                                resolve(array_disciplinas) //resolvo a Promise inserindo essas turmas no meu array de disciplinas escolhidas

                                            }).catch(e => {
                                                console.log(e)
                                            })
                                    } else { // caso nao for nula faço uma selecao nas disciplinas cujo o numero da turma coincida com o numero da turma escolhida
                                        return database.query(`select "nomeDisc", "codigoDisc", "turmaDisc", "horarioDisc", "professorDisc" from PUBLIC."Disciplina" where "deptoDisc" = '${departamento}' and "codigoDisc" = '${disciplina}' and "turmaDisc" = '${turma}'`)
                                            .then(table => {
                                                disciplina = table.rows

                                                disciplina.forEach(element => {
                                                    array_disciplinas.push(element)
                                                })
                                                resolve(array_disciplinas) //resolvo a Promise inserindo a turma selecionada no array de discplinas escolhidas

                                            }).catch(e => {
                                                console.log(e)
                                            })
                                    }
                                }).catch(e => {
                                    console.log(e)
                                })
                        }).catch(e => {
                            console.log(e)
                        })
                }
            })
            .catch(e => {
                console.log(e)
            })
    })
}

async function escolher_disciplinas(n, array_disciplinas) {
    return new Promise((resolve, reject) => {
        let i = 0
        pool.connect().then(async (database) => {
            while (i < n) { //esse codigo e pra escolher as discilinas aleatoriamente, e o numero 'n' e o numero de disciplinas que desejoe escolher
                await queryMaker(database, array_disciplinas)
                    .then(resp => {
                        //console.log(resp)
                    }).catch(e => {
                        if (e) {
                            throw e
                        }
                    })
                    .finally(() => {
                        //console.log(i + '\n\n\n')
                    })
                i++
            }
            resolve(array_disciplinas)
        })
    })

}


function get_disciplinas() {
    escolher_disciplinas(8, array_disciplinas)
        .then(resp => {


            resp.forEach((element, i) => {
                element = mudarFormato_Horario(element.horarioDisc)
                resp[i].horarioDisc = element
            })

            console.log(resp)
            const array_grades = []
            grade = grade_vazia()

            matriz_opcoes = matriz_array()
            gerarGrade(resp, grade, matriz_opcoes)
            resp.forEach(e => {
                console.log(`${e.codigoDisc} - T${e.turmaDisc} - [${e.horarioDisc[0]}] - [${e.horarioDisc[1]}]`)
            })

            for (let j = 0; j < 5; j++) {
                for (let i = 0; i < 5; i++) {
                    matriz_opcoes[j][i].forEach(e => {
                        montargrades(e[1], e[0], 0, 0, array_grades, 1, 5)
                    })
                }
            }

            array_grades.forEach(e => {
                console.table(e)
            })
        })
}

get_disciplinas()