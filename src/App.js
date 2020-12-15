import React, { Component } from 'react';
import './App.css';
import { HashRouter } from 'react-router-dom';
import MyRouter from "./Routers/Index";
import Header from './Components/Header'
import { SemanticToastContainer } from 'react-semantic-toasts';

class App extends Component {

  render() {
    return (
      <HashRouter>
          <Header />
        <MyRouter />
        <SemanticToastContainer position='bottom-left' />
      </HashRouter>
    );
  }
}

export default App;
