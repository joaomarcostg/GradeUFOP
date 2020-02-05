import React from 'react'

import '../styles/schedule/schedule.css'

import btn_right from '../assets/right_btn.svg'
import btn_left from '../assets/left_btn.svg'

function Schedule(props) {

    let pagina = 0;

    //lista a disciplina à esquerda
    function left() {
        const td_values = document.getElementsByClassName('td_values')
        for (let i = 0; i < td_values.length; i++) {
            td_values.item(i).innerText = null
        }

        let tam = props.solucao.length - 1
        if (pagina > 0) {
            pagina--
        }
        else {
            pagina = tam
        }
        const grade = document.getElementById('tab')
        grade.style.animation = 'shake .6s'

        setTimeout(() => {
            grade.style.animation = 'none'
        }, 600)
        props.exibir(props.solucao, pagina)

    }

    //lista a disciplina à direita
    function right() {
        const td_values = document.getElementsByClassName('td_values')
        for (let i = 0; i < td_values.length; i++) {
            td_values.item(i).innerText = null
        }

        let tam = props.solucao.length - 1

        if (pagina < tam) {
            pagina++
        }
        else {
            pagina = 0
        }
        const grade = document.getElementById('tab')
        grade.style.animation = 'shake .6s'

        setTimeout(() => {
            grade.style.animation = 'none'
        }, 600)
        props.exibir(props.solucao, pagina)
    }


    return (
        <div className="mc-schedule" id="main">
            <div className="container" id="schedule">
                <div className="left">
                    <button type='button' onClick={left} id="left">
                        <img src={btn_left} alt="LeftArrow" />

                    </button>
                </div>
                <div className="tabela-container">

                    <table className="tabela" id="tab">
                        <thead>
                            <tr className='tr_dias'>
                                <td id='blank'></td>
                                <td>Segunda</td>
                                <td>Terça</td>
                                <td>Quarta</td>
                                <td>Quinta</td>
                                <td>Sexta</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className='dia'>
                                <td className='td_horarios'>13:30 - 15:10</td>
                                <td className='td_values' id="0"></td>
                                <td className='td_values' id="1"></td>
                                <td className='td_values' id="2"></td>
                                <td className='td_values' id="3"></td>
                                <td className='td_values' id="4"></td>
                            </tr>
                            <tr className='dia'>
                                <td className='td_horarios'>15:20 - 17:00</td>
                                <td className='td_values' id="5"></td>
                                <td className='td_values' id="6"></td>
                                <td className='td_values' id="7"></td>
                                <td className='td_values' id="8"></td>
                                <td className='td_values' id="9"></td>

                            </tr>
                            <tr className='dia'>
                                <td className='td_horarios'>17:10 - 18:50</td>
                                <td className='td_values' id="10"></td>
                                <td className='td_values' id="11"></td>
                                <td className='td_values' id="12"></td>
                                <td className='td_values' id="13"></td>
                                <td className='td_values' id="14"></td>
                            </tr>
                            <tr className='dia'>
                                <td className='td_horarios'>19:00 - 20:40</td>
                                <td className='td_values' id="15"></td>
                                <td className='td_values' id="16"></td>
                                <td className='td_values' id="17"></td>
                                <td className='td_values' id="18"></td>
                                <td className='td_values' id="19"></td>
                            </tr>
                            <tr className='dia ultimo'>
                                <td className='td_horarios'>21:00 - 22:40</td>
                                <td className='td_values' id="20"></td>
                                <td className='td_values' id="21"></td>
                                <td className='td_values' id="22"></td>
                                <td className='td_values' id="23"></td>
                                <td className='td_values' id="24"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="right">
                    <button type='button' onClick={right} id="right">
                        <img src={btn_right} alt="RightArrow" />
                    </button>
                </div>
            </div>
            <h1>Legenda</h1>
            <div className="legenda-container" id="legenda">
            </div>
        </div>
    );
}

export default Schedule;