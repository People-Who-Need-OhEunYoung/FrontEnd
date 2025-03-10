import styled from 'styled-components';
import { DesignedButton } from '../../components/DesignedButton';
import { motion } from 'framer-motion';
const Main = ({ event }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      transition={{
        duration: 1,
      }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Div className="main">
        <H1>POKE CODE</H1>
        <P>
          포켓코드는 알고리즘 학습을 보조하고
          <br />
          귀여운 펫들을 성장 시킬 수 있습니다
        </P>
        <ButtonDiv>
          <DesignedButton text="회원가입" link="signin" />
          <DesignedButton event={event} text="로그인" link="login" />
        </ButtonDiv>
      </Div>
    </motion.div>
  );
};
const Div = styled.div`
  color: white;
  text-align: center;
  height: calc(100vh - 160px);
  transition: 1s;
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

export default Main;
