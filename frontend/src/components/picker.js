import React, { useState } from 'react'

// import IconButton from '@material-ui/core/IconButton';
// import AddCircleIcon from '@material-ui/icons/AddCircle';
// import { makeStyles } from '@material-ui/core/styles';
import '../styles/picker/picker.css'
import add_icon from '../icons/add_btn.svg'


function Picker(props) {

    function shortString(selector) {
        const elements = document.querySelectorAll(selector);
        console.log(elements)
        const tail = '...';
        if (elements && elements.length) {
            for (const element of elements) {
                let text = element.innerText;
                if (element.hasAttribute('data-limit')) {
                    if (text.length > element.dataset.limit) {
                        element.innerText = `${text.substring(0, element.dataset.limit - tail.length).trim()}${tail}`;
                    }
                } else {
                    throw Error('Cannot find attribute \'data-limit\'');
                }
            }
        }
    }

    window.onload = function () {
        shortString('.short');
    };

    // const useStyles = makeStyles(theme => ({
    //     root: {
    //         '& > *': {
    //             margin: theme.spacing(1),
    //         },
    //     },
    // }));
    // const classes = useStyles(); 

    const [disciplinas, setDisciplinas] = useState('');

    return (
        <div className="mc-picker">
            <div className="select-container">
                <div className='col departamentos'>
                    <label htmlFor="get_depto">Departamento</label>
                    <select className='sel' name="depto" id="get_depto">
                        <option value="opt1" className='short' data-limit='10'>DECEA</option>
                        <option value="opt2" className='short' data-limit='10'>DECSI</option>
                    </select>
                </div>
                <div className='col disciplinas'>
                    <label htmlFor="get_disc">Disciplina</label>
                    <select className='sel' name="disc" id="get_disc">
                        <option value="opt1" className='short' data-limit='60'>CSI-502 Eletromagnetismo</option>
                        <option value="opt2" className='short' data-limit='60'>CSI-502 aslkdjasdlkasjdklasjdklasjdlkaslkdjaskldjalksjdklasjdlkasjdklasjdklasjdkajslkdjaskldjaslkdjlasdjasdasjdlaksjdlak</option>
                    </select>
                </div>
                <div className='col turmas'>
                    <label htmlFor="get_turma">Turma</label>
                    <select className='sel' name="turma" id="get_turma">
                        <option value="opt1" className='short' data-limit='30'>T33 - Felipe Cota</option>
                    </select>
                </div>
                <div className="col btn">
                    <div className="container">
                        
                    </div>
                    <button type="button">
                        <img src={add_icon} alt="Add"/> 
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Picker;