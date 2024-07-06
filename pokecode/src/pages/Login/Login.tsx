import styled from 'styled-components';
import { DesignedButton } from '../../components/DesignedButton';
import { motion } from 'framer-motion';
const Login = () => {
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
            <Input type="text" name="id" placeholder="Username" />
            <Input type="text" name="password" placeholder="Password" />
            <ButtonDiv>
              <DesignedButton text="로그인" link="/usermain" />
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
