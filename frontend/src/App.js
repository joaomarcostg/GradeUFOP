import React from 'react';
import Header from './components/header'
import Picker from './components/picker'
import Schedule from './components/schedule'
// import Schedule from './components/schedule'

import './App.css';



function App() {

  return (
    <div className="main-container">
      <Header />
      <Picker />
      <Schedule />
    </div>    
  );
}

export default App;
