import React from 'react'

import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { makeStyles } from '@material-ui/core/styles';
import '../styles/picker/picker.css'


function Picker(props) {

    const useStyles = makeStyles(theme => ({
        root: {
            '& > *': {
                margin: theme.spacing(1),
            },
        },
    }));

    const classes = useStyles();

    return (
        <div className="mc-picker">
            <div className="select-container">
                <div className='col departamentos'>
                    <p>Departamento</p>
                    <select className='sel' name="depto" id="get_depto"></select>
                </div>
                <div className='col disciplinas'>
                    <p>Disciplina</p>
                    <select className='sel' name="disc" id="get_disc"></select>
                </div>
                <div className='col turmas'>
                    <p>Turma</p>
                    <select className='sel' name="turma" id="get_turma"></select>
                </div>
                <div className="col btn">
                    <IconButton aria-label="add">
                        <AddCircleIcon />
                    </IconButton>
                </div>
            </div>
        </div>
    );
}

export default Picker;