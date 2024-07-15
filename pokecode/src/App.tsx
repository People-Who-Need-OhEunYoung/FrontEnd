import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Header, Header2 } from './components/Header';
import { Footer, Footer1 } from './components/Footer';
import { Main } from './pages/Main';
import { Login } from './pages/Login';
import { Mypage } from './pages/Mypage';
import { Signin } from './pages/Signin';
import { UserMain } from './pages/UserMain';
import { Problem } from './pages/Problem';
import { Header3 } from './components/Header/Header';
import { Modal } from './components/Modal';
import { Gacha } from './pages/Gacha';
import { RoomList } from './pages/RoomList';
import { Room } from './pages/Room';
import { PokeBook } from './pages/PokeBook';
import { ProblemList } from './pages/ProblemList';
import { Provider } from 'react-redux';
import store from './store';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="App">
          <AnimatePresence>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Header />
                    <Main />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/login"
                element={
                  <>
                    <Header />
                    <Login />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/signin"
                element={
                  <>
                    <Header />
                    <Signin />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/mypage"
                element={
                  <>
                    <Header2 />
                    <Mypage />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/usermain"
                element={
                  <>
                    <Header2 />
                    <UserMain />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/problemlist"
                element={
                  <>
                    <Header2 />
                    <ProblemList />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/problem"
                element={
                  <>
                    <Header3 />
                    <Problem />
                    <Footer1 />
                  </>
                }
              />
              <Route
                path="/gacha"
                element={
                  <>
                    <Header2 />
                    <Gacha />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/roomlist"
                element={
                  <>
                    <Header2 />
                    <RoomList />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/room"
                element={
                  <>
                    <Header3 />
                    <Room />
                    <Footer1 />
                  </>
                }
              />
              <Route
                path="/modal"
                element={
                  <>
                    <Header2 />
                    <Modal />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/book"
                element={
                  <>
                    <Header2 />
                    <PokeBook />
                    <Footer />
                  </>
                }
              />
            </Routes>
          </AnimatePresence>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
