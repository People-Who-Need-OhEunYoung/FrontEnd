import styled from 'styled-components';
import { DesignedButton } from '../DesignedButton';
import { useEffect } from 'react';
const Login = () => {
  useEffect(() => {
    const cssLogin = document.getElementsByClassName('Login')[0];
    setTimeout(() => {
      cssLogin.classList.remove('hidden');
    }, 100);
  });

  return (
    <Div className="Login hidden">
      <Modal>
        <H1>LOGIN</H1>
        <form action="">
          <Input type="text" placeholder="Username" />
          <Input type="text" placeholder="Password" />
          <ButtonDiv>
            <DesignedButton text="로그인" />
            <DesignedButton text="회원가입" />
          </ButtonDiv>
        </form>
      </Modal>
    </Div>
  );
};
/* 모달 */
const Modal = styled.div`
  width: 60vh;
  height: 75vh;
  margin: auto;
  filter: drop-shadow(0px 6px 4px rgba(0, 0, 0, 0.25));
  background: rgba(161, 174, 219, 0.15);
  border-radius: 50px;
`;

// /* INPUT */
const Input = styled.input`
  width: 22em;
  margin: 2em;
  background: none;
  border: none;
  border-bottom: 1px solid #fff;
  padding: 10px;
  box-sizing: border-box;
  color: white;
`;

const Div = styled.div`
  color: white;
  text-align: center;
  height: calc(100vh - 180px);
  transition: 1s;
`;
const ButtonDiv = styled.div`
  margin-top: 5%;
`;
const H1 = styled.h1`
  padding-top: 1em;
  font-size: 4em;
`;

export default Login;
