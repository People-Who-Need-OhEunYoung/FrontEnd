import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Header, Header2 } from './components/Header';
import { Footer } from './components/Footer';
import { Main } from './pages/Main';
import { Login } from './pages/Login';
import { Mypage } from './pages/Mypage';
import { Signin } from './pages/Signin';
import { UserMain } from './pages/UserMain';
import { Problem } from './pages/Problem';
import { ProblemList } from './pages/ProblemList';
import { Header3 } from './components/Header/Header';
import { ResizableTabs } from './components/ResizableTabs';
import { Modal } from './components/Modal';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <AnimatePresence>
          <Routes>
            <Route path="/" element={<Header />} />
            <Route path="/login" element={<Header />} />
            <Route path="/signin" element={<Header />} />
            <Route path="/mypage" element={<Header2 />} />
            <Route path="/usermain" element={<Header2 />} />
            <Route path="/problemlist" element={<Header2 />} />
            <Route path="/problem" element={<Header3 />} />
          </Routes>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/mypage" element={<Mypage />} />
            <Route path="/usermain" element={<UserMain />} />
            <Route path="/problemlist" element={<ProblemList />} />
            <Route path="/problem" element={<Problem />} />
            <Route path="/resizableTabs" element={<ResizableTabs />} />
            <Route path="/modal" element={<Modal />} />
          </Routes>
          <Routes>
            <Route path="/" element={<Footer />} />
            <Route path="/login" element={<Footer />} />
            <Route path="/signin" element={<Footer />} />
            <Route path="/mypage" element={<Footer />} />
            <Route path="/usermain" element={<Footer />} />
            <Route path="/problemlist" element={<Footer />} />
            <Route path="/problem" element={<Footer />} />
          </Routes>
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}

export default App;
