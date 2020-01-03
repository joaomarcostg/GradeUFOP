import React, { useState, useEffect } from 'react'


import '../styles/picker/picker.css'
import add_icon from '../assets/add_btn.svg'
import rmv_icon from '../assets/rmv_btn.svg'

import api from '../services/api.js'

function Picker(props) {

    function changeText(selector, options, length) {
        const elements = document.querySelectorAll(selector);
        // console.log(elements)
        const tail = '...';
        if (elements && elements.length) {
            let i = 0;
            for (const element of elements) {
                let text = options[i]
                if (text.length < length) {
                    element.innerText = text;

                }
                else {
                    element.innerText = `${text.substring(0, length - tail.length).trim()}${tail}`;
                }
                i++;
            }
        }
    }

    function shortString(selector, width, options) {
        // console.log('a')
        if (width < 500) {
            changeText(selector, options, 35)
        }
        else if (width < 600) {
            changeText(selector, options, 40)
        }
        else if (width < 750) {
            changeText(selector, options, 45)
        }
        else if (width < 900) {
            changeText(selector, options, 50)
        }
        else if (width >= 900 && width < 1000) {
            changeText(selector, options, 40)
        }
        else if (width >= 1000) {
            changeText(selector, options, 50)
        }
    }

    {
        // window.onload = () => {
        //     setInterval(() => {
        //         var x = document.getElementById('get_depto')
        //         let value = x.options[x.selectedIndex].text
        //         console.log(value)
        //     }, 1000)
        // }

        // window.onload = function () {

        //     const options = []
        //     const elements = document.querySelectorAll('.short');
        //     if (elements && elements.length) {
        //         for (const element of elements) {
        //             let text = element.innerText;
        //             // let id = element.value;
        //             options.push(text)
        //         }
        //     }
        //     const wd = this.window.innerWidth
        //     const hd = this.window.innerHeight
        //     if (hd < 900 && wd < 450) {
        //         shortString('.short', wd, options)
        //     }
        //     else {


        //         setInterval(() => {
        //             var width = this.window.innerWidth
        //             shortString('.short', width, options)
        //             // console.log(width)
        //         }, 100);
        //     }
        // };
    }

    async function loadDeptos() {
        //CLEAR DROPDOWN
        const sel_depto = document.getElementById('get_depto')
        sel_depto.innerText = null
        const sel_disc = document.getElementById('get_disc')
        sel_disc.innerText = null


        const response = (await api.get('/deptos')).data
        console.log(response)
        const departamentos = []
        response.forEach(depto => {
            departamentos.push(depto.siglaDepto)
        })
        // console.log(departamentos)

        const option = document.createElement('option')
        sel_depto.add(option)

        departamentos.forEach(depto => {
            const option = document.createElement('option')
            option.text = depto
            sel_depto.add(option)
        })
    }

    async function loadDiscs() {
        //CLEAR DROPDOWN
        const sel_disc = document.getElementById('get_disc')
        sel_disc.innerText = null
        const sel_turma = document.getElementById('get_turma')
        sel_turma.innerText = null



        const tag_depto = document.getElementById('get_depto')
        const picked_depto = tag_depto.options[tag_depto.selectedIndex].text
        // console.log(picked_depto)
        const response = (await api.get(`/discs`, {
            headers: {
                depto: picked_depto
            }
        })).data
        // console.log(response)
        const disciplinas = []
        response.forEach(disc => {
            disciplinas.push({ codigo: disc.codigoDisc, nome: disc.nomeDisc })
        })
        // console.log(disciplinas)

        const option = document.createElement('option')
        sel_disc.add(option)

        disciplinas.forEach(disc => {
            const option = document.createElement('option')
            option.text = `${disc.codigo} - ${disc.nome}`
            sel_disc.add(option)
        })

    }

    async function loadTurmas() {
        const sel_turma = document.getElementById('get_turma')
        sel_turma.innerText = null

        const tag_disc = document.getElementById('get_disc')
        const picked_disc = tag_disc.options[tag_disc.selectedIndex].text
        const codigo_disc = picked_disc.split(' ')[0]
        console.log(codigo_disc)
        const response = (await api.get(`/turmas`, {
            headers: {
                disc: codigo_disc
            }
        })).data
        console.log(response)
        const turmas = []
        response.forEach(turma => {
            turmas.push({ numero: turma.turmaDisc, professor: turma.professorDisc })
        })

        const option = document.createElement('option')
        sel_turma.add(option)

        turmas.forEach(turma => {
            const option = document.createElement('option')
            option.text = `T${turma.numero} - ${turma.professor}`
            sel_turma.add(option)
        })
    }

    async function addPicked() {

        const tag_depto = document.getElementById('get_depto')
        const tag_disc = document.getElementById('get_disc')
        const tag_turma = document.getElementById('get_turma')


        const depto = tag_depto.options[tag_depto.selectedIndex].text
        
        if(tag_disc.options.length > 0){

            const disc = tag_disc.options[tag_disc.selectedIndex].text
            
            if (disc != '') {
                
                const turma = tag_turma.options[tag_turma.selectedIndex].text
                const ch_container = document.getElementById('chc')
                
                const c_disc = document.createElement('div')
                c_disc.setAttribute('class', 'c_col c_disc')
                c_disc.innerText = disc
                const id = disc.split(' ')[0]
                
                const c_turma = document.createElement('div')
                c_turma.setAttribute('class', 'c_col c_turma')
                if (turma == '') {
                    c_turma.innerText = 'Qualquer Turma'
                }
                else {
                    c_turma.innerText = turma
                }
                
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
                console.log(choosed)
                ch_container.appendChild(choosed)
            }
        }
    }
        
    async function removePicked(id) {
        const choosed = document.getElementById(id)
        choosed.remove()
    }

    window.onload = function () {
        loadDeptos()
    }


    // const [picked_count, setPickedCount] = useState(0);

    // setPickedCOunt()

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
        </div>
    );
}

export default Picker;