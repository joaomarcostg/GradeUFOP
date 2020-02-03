import React, { useState } from 'react'


import '../styles/picker/picker.css'
import add_icon from '../assets/add_btn.svg'
import rmv_icon from '../assets/rmv_btn.svg'
import algoritmo from '../algoritmo.js'
import api from '../services/api.js'

function Picker(props) {

    const professores = []
    const [pickeds, setPickeds] = useState([])

    //carrego os departamentos do banco de dados para a dropdown-list
    async function loadDeptos() {

        //CLEAR DROPDOWN
        const sel_depto = document.getElementById('get_depto')
        sel_depto.innerText = null
        const sel_disc = document.getElementById('get_disc')
        sel_disc.innerText = null

        //recebo os departamentos da rota
        const response = (await api.get('/deptos')).data

        //crio um vetor vazio para armazenar as siglas
        const departamentos = []
        //para cada departamento da resposta eu gravo apenas a sigla
        response.forEach(depto => {
            departamentos.push(depto.siglaDepto)
        })

        //crio uma opcao em branco
        const option = document.createElement('option')
        sel_depto.add(option)

        //para cada depto crio uma opcao com a sigla
        departamentos.forEach(depto => {
            const option = document.createElement('option')
            option.text = depto
            sel_depto.add(option)
        })
    }

    //carrego as disciplinas de determinado departamento do banco de dados para a dropdown-list
    async function loadDiscs() {

        //CLEAR DROPDOWN
        const sel_disc = document.getElementById('get_disc')
        sel_disc.innerText = null
        const sel_turma = document.getElementById('get_turma')
        sel_turma.innerText = null

        //pego a select tag do departamento
        const tag_depto = document.getElementById('get_depto')
        //vejo qual departamento está selecionado
        const picked_depto = tag_depto.options[tag_depto.selectedIndex].text

        //entao pego a resposta do backend, enviando o departamento escolhido como header
        const response = (await api.get(`/discs`, {
            headers: {
                depto: picked_depto
            }
        })).data

        //crio um vetor vazio para armazenar as disciplinas
        const disciplinas = []
        //para cada disciplina obtida na response eu guardo apenas o codigo e nome
        response.forEach(disc => {
            disciplinas.push({ codigo: disc.codigoDisc, nome: disc.nomeDisc })
        })

        //crio uma opcao em branco
        const option = document.createElement('option')
        sel_disc.add(option)

        //para cada disciplina (codigo e nome) crio uma opcao e insiro o texto
        disciplinas.forEach(disc => {
            const option = document.createElement('option')
            option.text = `${disc.codigo} - ${disc.nome}`
            sel_disc.add(option)
        })

    }


    //carrego as turmas de uma determinada disciplina do DB para a dropdown-list
    async function loadTurmas() {

        //CLEAR DROPDOWN
        const sel_turma = document.getElementById('get_turma')
        sel_turma.innerText = null

        //busco a select tag da disciplina
        const tag_disc = document.getElementById('get_disc')
        //encontro a disciplina escolhida
        const picked_disc = tag_disc.options[tag_disc.selectedIndex].text
        //pego o codigo da disciplina
        const codigo_disc = picked_disc.split(' ')[0]
        //busco as turmas relacionadas a esta disciplina passando o codigo como header
        const response = (await api.get(`/turmas`, {
            headers: {
                disc: codigo_disc
            }
        })).data

        //crio um vetor vazio de turmas
        const turmas = []
        //para cada turma obtida na resposta eu armazeno somente o numero e o professor
        response.forEach(turma => {
            turmas.push({ numero: turma.turmaDisc, professor: turma.professorDisc })
        })

        //crio uma opcao vazia
        const option = document.createElement('option')
        sel_turma.add(option)

        //para cada turma (numero e professor) crio uma opcao na dropdown-list
        turmas.forEach(turma => {
            const option = document.createElement('option')
            option.text = `T${turma.numero} - ${turma.professor}`
            sel_turma.add(option)
        })
    }

    //adiciono a disciplina escolhida
    async function addPicked() {

        //verifico se a qtd já escolhida não ultrapassa o limite
        if (pickeds.length < 8) {

            //busco as select's tags relacionadas a disciplina e turma
            const tag_disc = document.getElementById('get_disc')
            const tag_turma = document.getElementById('get_turma')

            //verifico se alguma disciplina ja foi carregada (se um departamento ja foi escolhido)
            if (tag_disc.options.length > 0) {

                const ch_container = document.getElementById('chc')
                //vejo qual departamento foi selecionado
                // const depto = tag_depto.options[tag_depto.selectedIndex].text

                //pego o texto escolhido da tag disciplina
                const disc = tag_disc.options[tag_disc.selectedIndex].text

                //verifico se alguma disciplina foi selecionada
                if (disc !== '') {

                    //pego apenas o codigo da disciplina
                    const codigo = disc.split(' ')[0]
                    //se o codigo for null, significa que essa disciplina ainda não foi escolhida
                    if (document.getElementById(codigo) === null) {

                        //guardo o texto da select tag 'turma'
                        const turma = tag_turma.options[tag_turma.selectedIndex].text

                        //crio uma div c_disc 'choosed disciplina'
                        const c_disc = document.createElement('div')
                        //determino as classe da div para estilizar no css
                        c_disc.setAttribute('class', 'c_col c_disc')
                        //o texto dessa div é o próprio texto da disciplina escolhida (codigo e nome)
                        c_disc.innerText = disc

                        //gravo o codigo da disciplina escolhida como id
                        const id = disc.split(' ')[0]

                        //crio uma div c_turma 'choosed turma'
                        const c_turma = document.createElement('div')
                        c_turma.setAttribute('class', 'c_col c_turma')

                        //se o texto guardado na var turma for vazio
                        if (turma === '') {
                            //digo que qualquer turma pode ser selecionada para formar a grade
                            c_turma.innerText = 'Qualquer Turma'

                            //adiciono essa disciplina às escolhidas deixando o atributo turma vazio
                            const escolhidas = pickeds
                            const response = (await api.get('/pickeds', {
                                headers: {
                                    codigo: id,
                                    turma: ''
                                }
                            })).data

                            const turmas = []
                            response.forEach(turma => {
                                turmas.push({
                                    'numero': parseInt(turma.turmaDisc),
                                    'horario': turma.horarioDisc
                                })
                                professores.push({
                                    'turma': `${turma.codigoDisc} - T${turma.turmaDisc}`,
                                    'professor': turma.professorDisc
                                })
                            })
                            escolhidas.push({
                                'codigo': id,
                                'horas': response[0].horarioDisc.split(',').length,
                                'turmas': turmas
                            })
                            setPickeds(escolhidas)

                            //preencho o campo 'Minimo de disciplinas por grade'
                            fillMin(pickeds.length)
                        }
                        //caso alguma turma for escolhida
                        else {
                            //digo que essa turma será a utilizada para formar as grades
                            c_turma.innerText = turma

                            //adiciono a disciplina com a turma escolhida em questão às escolhidas
                            const escolhidas = pickeds
                            const response = (await api.get('/pickeds', {
                                headers: {
                                    codigo: id,
                                    turma: turma.split(' ')[0].replace('T', '')
                                }
                            })).data

                            professores.push({
                                'turma': `${response[0].codigoDisc} - T${response[0].turmaDisc}`,
                                'professor': response[0].professorDisc
                            })

                            escolhidas.push({
                                'codigo': id,
                                'horas': response[0].horarioDisc.split(',').length,
                                'turmas': [
                                    {
                                        'numero': parseInt(turma.split(' ')[0].replace('T', '')),
                                        'horario': response[0].horarioDisc
                                    }]
                            })
                            setPickeds(escolhidas)
                            
                            //preencho o campo 'Minimo de disciplinas por grade'
                            fillMin(pickeds.length)
                        }


                        //crio a box onde a disciplina escolhida será mostrada na tela
                        const c_btn = document.createElement('div')
                        c_btn.setAttribute('class', 'c_col c_btn')

                        const button = document.createElement('button')
                        // button.setAttribute('id', id)
                        button.setAttribute('type', 'button')
                        button.onclick = () => removePicked(id)

                        const img = document.createElement('img')
                        img.setAttribute('src', rmv_icon)
                        img.setAttribute('alt', 'Rmv')

                        button.appendChild(img)
                        c_btn.appendChild(button)

                        const choosed = document.createElement('div')
                        choosed.setAttribute('class', 'choosed')
                        choosed.setAttribute('id', id)

                        choosed.appendChild(c_disc)
                        choosed.appendChild(c_turma)
                        choosed.appendChild(c_btn)
                        // console.log(choosed)
                        ch_container.appendChild(choosed)
                    }
                    //se não for null, significa que há um elemento com esse id, ou seja, já foi escolhida
                    else {
                        window.alert('Disciplina já escolhida!')
                    }
                }
                //se estiver vazio, quer dizer que nenhuma disciplina ainda nao foi escolhida
                else {
                    window.alert('Selecione uma disciplina!')
                }
            }
            //se estiver vazio, quer dizer que nenhum departamento ainda nao foi escolhida
            else {
                window.alert('Selecione um departamento!')
            }
        }
        //se ultrapassar o limite, aviso ao usuário
        else {
            window.alert('Limite de disciplinas atingido!')
        }
    }

    //remover Disciplina Escolhida
    function removePicked(id) {
        const choosed = document.getElementById(id)
        const escolhidas = pickeds

        escolhidas.forEach((disc, i) => {
            if (id === disc.codigo) {
                escolhidas.splice(i, 1)
            }
        })

        setPickeds(escolhidas)
        choosed.remove()
        fillMin(pickeds.length)
    }

    //preencher a selectbox com a qtd min disponivel
    function fillMin(qtd) {
        const sel_min = document.getElementById('sel_min')
        sel_min.innerText = null

        for (let i = 1; i <= qtd; i++) {
            const opt = document.createElement('option')
            opt.text = i
            sel_min.add(opt)
        }
    }

    //gerar a solucao
    function Gerar() {
        if (pickeds.length !== 0) {

            const disciplinas = JSON.parse(JSON.stringify(pickeds))
            const combinacoes = [], cores_usadas = []
            let fluxo = 0
            const possibilidades = []


            const sel_min = document.getElementById('sel_min')
            const min = parseInt(sel_min.options[sel_min.selectedIndex].text)

            disciplinas.forEach(disc => {
                disc.turmas.forEach((turma, i) => {
                    disc.turmas[i].horario = algoritmo.mudarFormato_Horario(turma.horario)
                })
            })

            const grafo = algoritmo.carregar_grafo(disciplinas)
            algoritmo.resolver(grafo, min, 1, disciplinas.length + 1, combinacoes, cores_usadas, fluxo, possibilidades)
            algoritmo.converter(possibilidades, grafo)

            ExibirSolucoes(possibilidades, professores)
        }
    }

    //retorna um professor entre os possiveis
    function getProfessor(professores, turma) {
        for (let i = 0; i < professores.length; i++) {
            if (professores[i].turma === turma) {
                return professores[i].professor
            }
        }
    }

    //Manipula as solucoes e as envia para o componente Schedule
    function ExibirSolucoes(possibilidades, professores) {

        if (possibilidades.length > 0) {

            const solucao = []
            possibilidades.forEach(possibilidade => {
                const grade = []
                possibilidade.forEach(disc => {
                    if (disc !== "") {
                        const professor = getProfessor(professores, disc[0])
                        grade.push({
                            "disciplina": disc[0],
                            "horario": disc[1],
                            "professor": professor
                        })
                    }
                })
                solucao.push(grade)
            })
            props.setSolucao(solucao)
            props.exibir(solucao, 0)
        }
    }

    window.onload = function () {
        loadDeptos()
    }

    return (
        <div className="picker">
            <div className="mc-picker">
                <div className="select-container">
                    <div className='col departamentos'>
                        <label htmlFor="get_depto">Departamento</label>
                        <select className='sel' name="depto" id="get_depto" onChange={loadDiscs}>
                            <option value="blank"></option>
                        </select>
                    </div>
                    <div className='col disciplinas'>
                        <label htmlFor="get_disc">Disciplina</label>
                        <select className='sel' name="disc" id="get_disc" onChange={loadTurmas}>
                            <option value="blank"></option>
                        </select>
                    </div>
                    <div className='col turmas'>
                        <label htmlFor="get_turma">Turma</label>
                        <select className='sel' name="turma" id="get_turma" >
                            <option value="blank"></option>
                        </select>
                    </div>
                    <div className="col btn">
                        <button type="button" onClick={addPicked}>
                            <img src={add_icon} alt="Add" />
                        </button>
                    </div>
                </div>
            </div>
            <div className="mc-picked">
                <div className="choosed-container" id="chc">
                    <p>Disciplinas Escolhidas</p>
                </div>
            </div>
            <div className="mc-resolve">
                <div className="min-sel">
                    <p>Quantidade mínima de disciplinas por grade:</p>
                    <select name="min" id="sel_min">
                        <option value="blank"></option>
                    </select>
                </div>
                <div className="res-btn">
                    <button type="button" onClick={Gerar}> Gerar Grades</button>
                </div>
            </div>
        </div>
    );
}

export default Picker;