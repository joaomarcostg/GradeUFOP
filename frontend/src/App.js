import React, { useState } from 'react';
import Header from './components/header'
import Picker from './components/picker'
import Schedule from './components/schedule'
// import Schedule from './components/schedule'

import './App.css';



function App() {

  const [solution, setSolution] = useState('')
  let qtd = 0

  function exibir(solucao, pagina) {

    const td_values = document.getElementsByClassName('td_values')
    for (let i = 0; i < td_values.length; i++) {
      td_values.item(i).innerHTML = null
    }

    if (solucao !== '') {
      const legenda = document.getElementById('legenda')
      legenda.innerHTML = null
      solucao[pagina].forEach(disc => {
        console.log(disc)
        if (disc.horario.length === 2) {
          const horario1 = document.getElementById(disc.horario[0])
          const horario2 = document.getElementById(disc.horario[1])
          console.log(horario1, horario2)
          const p = document.createElement('p')
          p.innerText = `${disc.disciplina} - ${disc.professor}`
          legenda.appendChild(p)
          horario1.innerText = disc.disciplina
          horario2.innerText = disc.disciplina
        }
        else {
          const horario1 = document.getElementById(disc.horario[0])
          horario1.innerText = disc.disciplina
        }
      })
    }
  }


  return (
    <div className="main-container">
      <Header />
      <Picker setSolucao={setSolution} exibir={exibir} qtd={qtd}/>
      <Schedule solucao={solution} exibir={exibir} />
    </div>
  );
}

export default App;
