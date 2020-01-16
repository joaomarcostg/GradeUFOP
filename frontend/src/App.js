import React, {useState} from 'react';
import Header from './components/header'
import Picker from './components/picker'
import Schedule from './components/schedule'
// import Schedule from './components/schedule'

import './App.css';



function App() {

  const [escolhidas, setEscolhidas] = useState([])



  return (
    <div className="main-container">
      <Header />
      <Picker setpickeds={setEscolhidas} pickeds={escolhidas}/>
      <Schedule pickeds={escolhidas}/>
    </div>    
  );
}

export default App;
