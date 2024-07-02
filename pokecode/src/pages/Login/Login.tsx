import * as LoginStyle from './Login.style';
import { DesignedButton } from '../../components/DesignedButton';
import { useEffect } from 'react';

const Login = ({ event }: any) => {
  useEffect(() => {
    const cssLogin = document.getElementsByClassName('Login')[0];
    cssLogin.classList.add('open');
  });

  return (
    <LoginStyle.Wrapper className="Login">
      <LoginStyle.H1>POKE CODE</LoginStyle.H1>
      <LoginStyle.P>테스트</LoginStyle.P>
      <LoginStyle.ButtonDiv>
        <DesignedButton text="회원가입" />
        <DesignedButton event={event} text="로그인" />
      </LoginStyle.ButtonDiv>
    </LoginStyle.Wrapper>
  );
};


export default Login;
