import React from 'react'

import '../styles/schedule/schedule.css'

import btn_right from '../assets/right_btn.svg'
import btn_left from '../assets/left_btn.svg'

function Schedule(props) {

    return (
        <div className="mc-schedule">
            <div className="left">
                <button type='button'>
                    <img src={btn_left} alt="LeftArrow" />

                </button>
            </div>

            <table className="tabela">
                <thead>
                    <tr className='tr_dias'>
                        <td></td>
                        <td>Segunda</td>
                        <td>Terça</td>
                        <td>Quarta</td>
                        <td>Quinta</td>
                        <td>Sexta</td>
                    </tr>
                </thead>
                <tbody>
                    <tr className='par'>
                        <td className='td_horarios'>13:30 - 15:10</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr className='impar'>
                        <td className='td_horarios'>15:20 - 17:00</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr className='par'>
                        <td className='td_horarios'>17:10 - 18:50</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr className='impar'>
                        <td className='td_horarios'>19:00 - 20:40</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr className='par ultimo'>
                        <td className='td_horarios'>21:00 - 22:40</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <div className="right">
                <button type='button'>
                    <img src={btn_right} alt="RightArrow" />
                </button>
            </div>
        </div>
    );
}

export default Schedule;