import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Main } from './pages/Main';
import { Login } from './pages/Login';
import { Mypage } from './pages/Mypage';
import { Signin } from './pages/Signin';
import { UserMain } from './pages/UserMain';
import { Problem } from './pages/Problem';
import { ProblemList } from './pages/ProblemList';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <AnimatePresence>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/mypage" element={<Mypage />} />
            <Route path="/usermain" element={<UserMain />} />
            <Route path="/problem" element={<Problem />} />
            <Route path="/problemlist" element={<ProblemList />} />
          </Routes>
        </AnimatePresence>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
