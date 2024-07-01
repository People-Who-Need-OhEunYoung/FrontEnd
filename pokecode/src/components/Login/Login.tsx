import styled from 'styled-components';
import { DesignedButton } from '../DesignedButton';
import { useEffect } from 'react';
const Login = ({ event }: any) => {
  useEffect(() => {
    const cssLogin = document.getElementsByClassName('Login')[0];
    cssLogin.classList.add('open');
  });

  return (
    <Div className="Login">
      <H1>POKE CODE</H1>
      <P>테스트</P>
      <ButtonDiv>
        <DesignedButton text="회원가입" />
        <DesignedButton event={event} text="로그인" />
      </ButtonDiv>
    </Div>
  );
};

const Div = styled.div`
  color: white;
  text-align: center;
  height: calc(100vh - 180px);
  transition: 1s;
  opacity: 0;
`;
const ButtonDiv = styled.div`
  margin-top: 5%;
`;
const H1 = styled.h1`
  color: white;
  font-size: 8rem;
  padding: 4% 0 4% 0;
  @media (max-width: 1600px) {
    padding: 3% 0 3% 0;
    font-size: 6rem;
  }
  @media (max-width: 550px) {
    padding: 1% 0 1% 0;
    font-size: 3rem;
  }
`;
const P = styled.p`
  color: white;
  font-size: 3rem;
  font-weight: bold;
  @media (max-width: 1600px) {
    font-size: 2rem;
  }
  @media (max-width: 550px) {
    font-size: 1rem;
  }
`;

export default Login;
