import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Profile } from '../Profile';
import Nav from '../Nav/Nav';
import styled from 'styled-components';

const Header = () => {
  return (
    <div className="header">
      <Link className="titleLogo" to={'/'} style={{ zIndex: 100 }}>
        POKE CODE
      </Link>
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'white',
          textAlign: 'center',
          width: '350px',
        }}
      ></div>
    </div>
  );
};

export const Header2 = () => {
  const navigate = useNavigate();
  const loginChecker = async () => {
    await fetch(`${import.meta.env.VITE_APP_IP}/tokenTest`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        //console.log(res);
        return res.json();
      })
      .then((data) => {
        //console.log(data);
        if (data.result == 'success') {
        } else {
          confirm('세션이 만료되었습니다. 현재화면을 유지하시겠습니까?')
            ? ''
            : navigate('/');
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        alert('통신에러로 로그인화면으로 돌아갑니다');
        localStorage.removeItem('token');
        navigate('/login');
        throw error;
      });
  };

  loginChecker();

  return (
    <motion.div
      className="header"
      initial={{ opacity: 0 }}
      transition={{
        duration: 1,
      }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Link
        className="titleLogo"
        to={'/'}
        style={{
          position: 'absolute',
          zIndex: 100,
          left: '12.5%',
        }}
      >
        POKE CODE
      </Link>
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'white',
          textAlign: 'center',
          width: '350px',
        }}
      >
        <Nav></Nav>
      </div>
      <ProfileWrap>
        <Profile name={'알맞은 데이터'} credit={30000} />
      </ProfileWrap>
    </motion.div>
  );
};

export const Header3 = () => {
  const navigate = useNavigate();
  const loginChecker = async () => {
    await fetch(`${import.meta.env.VITE_APP_IP}/tokenTest`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        console.log(res);
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data.result == 'success') {
        } else {
          confirm('세션이 만료되었습니다. 현재화면을 유지하시겠습니까?')
            ? ''
            : navigate('/');
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        alert('통신에러');
        throw error;
      });
  };

  loginChecker();
  return (
    <motion.div
      className="header"
      initial={{ opacity: 0 }}
      transition={{
        duration: 1,
      }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Link
        className="titleLogo"
        to={'/'}
        style={{
          position: 'absolute',
          zIndex: 100,
        }}
      >
        POKE CODE
      </Link>
      <NavWrap>
        <Nav></Nav>
      </NavWrap>
      <ProfileWrap2>
        <Profile name={'알맞은 데이터'} credit={3000000} />
      </ProfileWrap2>
    </motion.div>
  );
};

const ProfileWrap = styled.div`
  position: absolute;
  top: 0;
  color: white;
  width: 250px;
  height: 100%;
  right: 12.5%;
  @media (max-width: 1240px) {
    right: 0%;
  }
`;
const ProfileWrap2 = styled.div`
  position: absolute;
  top: 0;
  color: white;
  width: 250px;
  height: 100%;
  right: 0%;
`;

const NavWrap = styled.div`
  position: absolute;
  top: 0;
  left: 220px;
  color: white;
  text-align: center;
  width: 350px;
  @media (max-width: 750px) {
    left: 50%;
    transform: translateX(-50%);
  }
`;
export default Header;
