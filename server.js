const calcula_cor = (horario) => {

    if (horario.length == 2) {
        cor1 = 5 * horario[0][0] + horario[0][1]
        cor2 = 5 * horario[1][0] + horario[1][1]
        return [cor1, cor2]
    }
    else {
        cor1 = 5 * horario[0][0] + horario[0][1]
        return [cor1]
    }
}

const grafo_vazio = (tamanho) => {
    let i = 0, j = 0
    const grafo = []

    while (i < tamanho) {
        grafo.push([])
        i++;
    }
    i = 0
    while (i < tamanho) {
        j = 0
        while (j < tamanho) {
            grafo[i].push(0)
            j++
        }
        i++
    }
    return grafo
}

const carregar_grafo = (disciplinas) => {

    let capacidade = 0
    let vertices_count = disciplinas.length + 2 //somo 2 devido aos vertices S e T
    const turmas_disc = [], codigos_disc = []

    //para cada disciplina eu somo as horas acumuladas, para ter a capacidade de fluxo
    disciplinas.forEach((disc) => {
        capacidade += disc.horas
        vertices_count += disc.turmas.length
    })

    //faço grafo vazio
    const grafo = grafo_vazio(vertices_count)

    let k = 0

    //associo capacidade e fluxo às suas respectivas posições
    grafo[0][0] = capacidade
    grafo[vertices_count - 1][vertices_count - 1] = -capacidade

    //para cada disciplina
    disciplinas.forEach((disc, i) => {

        //faço uma relacao dos codigos das disciplinas e seus respectivos vertices na matriz
        //cada disciplina terá uma linha respectiva
        codigos_disc.push([(i + 1), disc.codigo])

        //para a linha i==0, associo a coluna de disciplinas com sua carga horária,
        //assim j para i==0 equivale à linha que essa determinada disciplina 'j' se encontra
        grafo[0][i + 1] = disc.horas

        //para cada turma de determinada disciplina
        disc.turmas.forEach((turma, j) => {

            //faço uma relacao dos numeros das turmas e seus respectivos vertives na matriz
            turmas_disc.push([(j + 1) + k + disciplinas.length, turma.numero])

            //acho a cor que devo pintar a aresta
            const cores = calcula_cor(turma.horario)

            //marco a posicao no grafo, salvando uma 'tupla', com a carga horária e as cores
            //j+1) somo 1 devido ao vértice 'S'
            grafo[i + 1][(j + 1) + k + disciplinas.length] = [disc.horas, cores]
            grafo[(j + 1) + k + disciplinas.length][vertices_count - 1] = [disc.horas, cores]
        })

        //K itera em relação as turmas, ele se incrementa de acordo com a posição da turma na matriz, evitando sobreescrever a posição j
        k += disc.turmas.length
    })

    //marco os vertices i=j com o conteudo respectivo
    codigos_disc.forEach(e => {
        grafo[e[0]][e[0]] = e[1]
    })
    turmas_disc.forEach(e => {
        grafo[e[0]][e[0]] = e[1]
    })

    console.table(grafo)
    return grafo
}

const disciplinas = [
    {
        'codigo': 'CSI488',
        'horas': 2,
        'turmas': [{
            'numero': 31,
            'horario': [[0, 1], [2, 0]]
        }, {
            'numero': 32,
            'horario': [[1, 0], [3, 0]]
        }, {
            'numero': 33,
            'horario': [[0, 0], [3, 1]]
        }]
    },
    {
        'codigo': 'CSI745',
        'horas': 2,
        'turmas': [{
            'numero': 31,
            'horario': [[2, 3], [4, 4]]
        }, {
            'numero': 32,
            'horario': [[1, 3], [3, 2]]
        }, {
            'numero': 33,
            'horario': [[0, 1], [2, 1]]
        }]
    },
    {
        'codigo': 'CEA302',
        'horas': 2,
        'turmas': [{
            'numero': 31,
            'horario': [[0, 1], [3, 0]]
        }, {
            'numero': 32,
            'horario': [[1, 2], [4, 3]]
        }]
    },
    {
        'codigo': 'CSI400',
        'horas': 2,
        'turmas': [{
            'numero': 31,
            'horario': [[1, 1], [4, 0]]
        }]
    },
    {
        'codigo': 'CEA502',
        'horas': 2,
        'turmas': [{
            'numero': 31,
            'horario': [[2, 2], [4, 1]]
        }]
    }
]

const escolher_turma = (grafo, linha, cores_usadas) => {

    const resp = []
    let j = linha + 1

    while (j < grafo[linha].length) {

        if (j != linha && grafo[linha][j] != 0) {

            //marco a aresta de disciplina como visitada
            grafo[linha][j][0] -= grafo[linha][j][0]


            //pego as cores da aresta para ver se ela pode ser escolhida
            cor1 = grafo[linha][j][1][0]
            cor2 = grafo[linha][j][1][1]
            ind1 = cores_usadas.indexOf(cor1)
            ind2 = cores_usadas.indexOf(cor2)

            //se as cores estiverem disponiveis elas agora sao removidas
            if ((ind1 == -1) && (ind2 == -1)) {
                cores_usadas.push(grafo[linha][j][1][0])
                cores_usadas.push(grafo[linha][j][1][1])
                resp.push([linha, j])
            }
        }
        j++
    }
    resp.push('')
    return resp
}

const resolver = (grafo, min, j, size, combinacoes, cores_usadas, fluxo, possibilidades) => {

    //uso o passo recursivo para evitar que ele alcance o 'j' respectivo à linha 'T'
    if (j < size) {

        const i = 0

        //faço uma copia dos argumentos originais
        const cores_usadas_c = JSON.parse(JSON.stringify(cores_usadas))
        const grafo_c = JSON.parse(JSON.stringify(grafo))
        let fluxo_c = JSON.parse(JSON.stringify(fluxo))

        //se o grafo[i][j] != 0, há uma capacidade de correr um fluxo ali
        if (grafo_c[i][j] != 0) {

            //digo que nessa aresta passou o fluxo, e a capacidade diminui
            fluxo_c = fluxo_c + grafo_c[i][j]
            grafo_c[0][0] -= fluxo_c

            //marco a aresta de disciplina como visitada
            grafo_c[i][j] -= grafo_c[i][j]

            //dado a disciplina escolhida 'j' escolho as turmas disponiveis
            const resp = escolher_turma(grafo_c, j, cores_usadas_c)

            //para cada turma disponivel (incluindo null)
            resp.forEach(e => {

                //faço a copia das combinacoes anteriores e adiciona essa nova combinacao à lista
                const combinacoes_c = JSON.parse(JSON.stringify(combinacoes))
                combinacoes_c.push(e)

                //se j atingir o limite de disciplinas, posso interromper a execucao
                if (j == size - 1) {

                    //conto quantas turmas nulas existem
                    let count = 0
                    combinacoes_c.forEach(e => {
                        if (e == '') {
                            count++
                        }
                    })

                    //so adiciono ao vetor de respostas as combicaoes que atendem o requisito min
                    if (combinacoes_c.length - count >= min) {
                        possibilidades.push(combinacoes_c)
                    }

                    //no fim de tudo interrompo a execucao
                    return true
                }

                //caso ainda nao atingir o limite, resolvo novamente para j+1 e as copias respectivas
                resolver(grafo_c, min, j + 1, size, combinacoes_c, cores_usadas_c, fluxo_c, possibilidades)
            })
        }
        //caso nao, repito o processo, com a prox disciplina
        else {
            resolver(grafo_c, min, j + 1, size, combinacoes, cores_usadas, fluxo, possibilidades)
        }
    }
    //se j ultrapassar o tamanho do grafo, 
    else {
        return true
    }
}


//converto a resposta para algo mais legivel
const converter = (array, grafo) => {

    array.forEach(comb => {
        for (let i = 0; i < comb.length; i++) {
            const disc = comb[i]
            if (disc != '') {
                disc[0] = grafo[disc[0]][disc[0]]
                disc[1] = grafo[disc[1]][disc[1]]
                comb[i] = disc.toString().replace(',', ' - ')
            }
        }
    })
}

const combinacoes = [], cores_usadas = []
let fluxo = 0
const grafo = carregar_grafo(disciplinas)
const possibilidades = []

resolver(grafo, 4, 1, disciplinas.length + 1, combinacoes, cores_usadas, fluxo, possibilidades)
converter(possibilidades, grafo)

console.log(possibilidades)