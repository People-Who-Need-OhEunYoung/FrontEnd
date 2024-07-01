import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Main } from './components/Main';
import { useState } from 'react';
import { Login } from './components/Login';
import { Mypage } from './components/Mypage';
import './App.css';

function App() {
  const [loginClick, setLoginClick] = useState('Main');
  const loginUser = () => {
    const cssMain = document.getElementsByClassName('main')[0];
    cssMain.classList.add('hidden');
    setTimeout(() => {
      setLoginClick('Login');
    }, 1000); //
  };

  return (
    <>
      <Header></Header>
      {loginClick === 'Main' ? <Main event={loginUser} /> : <Login />}
      <Footer></Footer>
      
      <BrowserRouter>
        <Routes>
            <Route path = '/mypage' element = {<Mypage />} />
        </Routes>
      </BrowserRouter>
    </>
   
  );

}
export default App;
