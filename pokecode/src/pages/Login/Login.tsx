import styled from 'styled-components';
import { DesignedButton } from '../../components/DesignedButton';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type userinfo = {
  id: string;
  pw: string;
};

const Login = () => {
  const [id, setId] = useState<string>('');
  const [pw, setPw] = useState<string>('');

  const navigate = useNavigate();
  const loginCall = async (params: userinfo) => {
    await fetch(`${import.meta.env.VITE_APP_IP}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: params.id, pw: params.pw }),
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
          alert('로그인에 성공했습니다.');
          localStorage.setItem('token', data.token);
          navigate('/usermain');
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        alert('통신에러');
        navigate('/login');
        throw error;
      });
  };
  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      loginCall({ id: id, pw: pw });
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      transition={{
        duration: 1,
      }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Div className="Login">
        <Modal>
          <H1>LOGIN</H1>
          <form action="">
            <Input
              type="text"
              name="id"
              placeholder="Username"
              value={id}
              onChange={(e: any) => setId(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={pw}
              onChange={(e: any) => setPw(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <ButtonDiv>
              <DesignedButton
                text="로그인"
                event={() => loginCall({ id: id, pw: pw })}
              />
              <DesignedButton text="회원가입" link="/signin" />
            </ButtonDiv>
          </form>
        </Modal>
      </Div>
    </motion.div>
  );
};
/* 모달 */
const Modal = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  width: 30vw;
  margin: auto;
  filter: drop-shadow(0px 6px 4px rgba(0, 0, 0, 0.25));
  background: rgba(161, 174, 219, 0.15);
  border-radius: 50px;
  @media (max-width: 1240px) {
    width: 80vw;
  }
  @media (max-width: 800px) {
    width: 100vw;
  }
`;

// /* INPUT */
const Input = styled.input`
  width: 15vw;
  margin: 2em;
  background: none;
  border: none;
  border-bottom: 1px solid #fff;
  padding: 10px;
  box-sizing: border-box;
  color: white;
  @media (max-width: 1240px) {
    width: 60vw;
  }
  @media (max-width: 800px) {
    width: 80vw;
  }
`;

const Div = styled.div`
  position: relative;
  color: white;
  text-align: center;
  height: calc(100vh - 180px);
  transition: 1s;
`;
const ButtonDiv = styled.div`
  margin: 1em 0 4em 0;
`;
const H1 = styled.h1`
  padding-top: 1em;
  font-size: 4em;
`;

export default Login;
