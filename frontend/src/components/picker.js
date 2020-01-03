import React, { useState, useEffect } from 'react'


import '../styles/picker/picker.css'
import add_icon from '../assets/add_btn.svg'
import rmv_icon from '../assets/rmv_btn.svg'


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

    function pick(){
        const a = document.getElementById('get_depto')
        const b = a.options[a.selectedIndex].text
        console.log(b)
    }



    const [disciplinas, setDisciplinas] = useState('');

    return (
        <div className="picker">
            <div className="mc-picker">
                <div className="select-container">
                    <div className='col departamentos'>
                        <label htmlFor="get_depto">Departamento</label>
                        <select className='sel' name="depto" id="get_depto"  onChange={pick}>
                            <option value="opt1" className='short'>DECEA</option>
                            <option value="opt2" className='short'>DECSI</option>
                        </select>
                    </div>
                    <div className='col disciplinas'>
                        <label htmlFor="get_disc">Disciplina</label>
                        <select className='sel' name="disc" id="get_disc">
                            <option value="opt1" className='short'>CSI-488 Algoritmos e Estruturas de Dados I</option>
                            <option value="opt2" className='short'>CSI-544 Engenharia de Software I</option>
                            <option value="opt3" className='short'>CEA-502 Eletromagnetismo</option>
                        </select>
                    </div>
                    <div className='col turmas'>
                        <label htmlFor="get_turma">Turma</label>
                        <select className='sel' name="turma" id="get_turma" >
                            <option value="opt1" className='short'>T33 - Felipe Cota</option>
                            <option value="opt2" className='short'>T31 - Bruno Hott</option>
                        </select>
                    </div>
                    <div className="col btn">
                        <button type="button">
                            <img src={add_icon} alt="Add" />
                        </button>
                    </div>
                </div>
            </div>
            <div className="mc-picked">
                <div className="choosed-container">
                    <div className="choosed">
                        <div className="c_col c_disc">CEA502 - Eletromagnetismo</div>
                        <div className="c_col c_turma">T33 - Felipe Cota</div>
                        <div className="c_col c_btn">
                            <button type="button">
                                <img src={rmv_icon} alt="Add" />
                            </button>
                        </div>
                    </div>
                    <div className="choosed">
                        <div className="c_col c_disc">CSI488 - Algoritmos e Estruturas de Dados I</div>
                        <div className="c_col c_turma">T31 - Bruno Hott</div>
                        <div className="c_col c_btn">
                            <button type="button">
                                <img src={rmv_icon} alt="Add" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Picker;