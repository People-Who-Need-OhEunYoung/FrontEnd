import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Main } from './pages/Main';
import { useState } from 'react';
import { Mypage } from './pages/Mypage';
import './App.css';

function App() {
  // const [loginClick, setLoginClick] = useState('Main');
  // const loginUser = () => {
  //   const cssMain = document.getElementsByClassName('main')[0];
  //   cssMain.classList.add('hidden');
  //   setTimeout(() => {
  //     setLoginClick('Login');
  //   }, 1000); //
  // };

  return (
    <>
      <Header/>
  
      <BrowserRouter>
        <Routes>
            <Route path = '/' element = {<Main/>} />
            <Route path = '/mypage' element = {<Mypage />} />
        </Routes>
      </BrowserRouter>
      <Footer/>
    </>
   
  );

}
export default App;
