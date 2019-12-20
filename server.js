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

    grafo[0][0] = capacidade
    grafo[vertices_count - 1][vertices_count - 1] = -capacidade

    disciplinas.forEach((disc, i) => {

        //faço uma relacao dos codigos das disciplinas e seus respectivos vertices na matriz
        codigos_disc.push([(i + 1), disc.codigo])

        grafo[0][i + 1] = disc.horas

        disc.turmas.forEach((turma, j) => {

            //faço uma relacao dos numeros das turmas e seus respectivos vertives na matriz
            turmas_disc.push([(j + 1) + k + disciplinas.length, turma.numero])

            //acho a cor que devo pintar a aresta
            const cores = calcula_cor(turma.horario)

            // (j+1) somo 1 devido ao vértice 'S'
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
            'horario': [[2, 2], [4,1]]
        }]
    }
]

const resolver = (grafo, min, j, combinacoes, cores_usadas, fluxo,a) => {
    
    if(j < (grafo[0].length - 1)){

        
        const i = 0
        const cores_usadas_c = JSON.parse(JSON.stringify(cores_usadas))
        
        const grafo_c = JSON.parse(JSON.stringify(grafo))
        
        if (grafo_c[i][j] != 0) {
            
            //marco a aresta de disciplina como visitada
            grafo_c[i][j] -= grafo_c[i][j]
            
            //digo que nessa aresta passou o fluxo, e a capacidade diminui
            fluxo += grafo_c[i][j]
            grafo_c[0][0] -= fluxo

            //dado a disciplina escolhida 'j' escolho a turma em questao
            // console.log(cores_usadas_c)
            const resp = escolher_turma(grafo_c, j, cores_usadas_c)

            if (resp.length > 0) {

                resp.forEach( e => {
                    // console.log(e)
                    const combinacoes_c = JSON.parse(JSON.stringify(combinacoes))
                    combinacoes_c.push(e)
                    if(j == 5){
                        console.log(combinacoes_c)
                        a.push(combinacoes_c)
                    }
                    resolver(grafo_c, min, j+1, combinacoes_c, cores_usadas_c, fluxo,a)
                })
            }
        }
    }
    else{
        return combinacoes
    }
}

const escolher_turma = (grafo, linha, cores_usadas) => {
    
    const resp = []
    let j = linha + 1
    
    while (j < grafo[linha].length) {
        
        if (j != linha && grafo[linha][j] != 0) {
            // console.log(j)
            //marco a aresta de disciplina como visitada
            grafo[linha][j][0] -= grafo[linha][j][0]
            
            
            //pego as cores da aresta para ver se ela pode ser escolhida
            cor1 = grafo[linha][j][1][0]
            cor2 = grafo[linha][j][1][1]
            ind1 = cores_usadas.indexOf(cor1)
            ind2 = cores_usadas.indexOf(cor2)

            //se as cores estiverem disponiveis elas agora sao removidas
            if ((ind1 == -1) && (ind2 == -1)) {
                cores_usadas.push(ind1)
                cores_usadas.push(ind2)
                resp.push([linha, j])
            }
        }
        j++
    }
    resp.push([null])
    return resp
}


const combinacoes = [], cores_usadas = []
let fluxo = 0
const grafo = carregar_grafo(disciplinas)
const a = []
const b = resolver(grafo, 4, 1, combinacoes, cores_usadas, fluxo, a)

console.log(a)