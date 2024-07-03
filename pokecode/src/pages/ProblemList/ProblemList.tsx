import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ProblemList = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      transition={{
        duration: 1,
      }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'relative', height: 'calc(100vh - 180px)' }}
    >
      <Modal>
        <Titleh1>문제선택</Titleh1>
        <Inputsearch type="text" />
        <Orderul>
          <Orderli>
            <Link to={'./id'}>ID</Link>
          </Orderli>
          <Orderli>
            <Link to={'./level'}>레벨</Link>
          </Orderli>
          <Orderli>
            <Link to={'./title'}>제목</Link>
          </Orderli>
          <Orderli>
            <Link to={'./resolvedUser'}>푼 사람 수</Link>
          </Orderli>
          <Orderli>
            <Link to={'./try'}>평균시도</Link>
          </Orderli>
          <Orderli>
            <Link to={'./randum'}>랜덤</Link>
          </Orderli>
        </Orderul>
        <Listul>
          <Listli>테스트 문제입니다.</Listli>
        </Listul>
      </Modal>
    </motion.div>
  );
};
/* 모달 */
const Modal = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  width: 60%;
  height: 100%;
  margin: auto;
  text-align: center;
  color: white;
  background: #625787;
  border-radius: 50px;
  filter: drop-shadow(0px 6px 4px rgba(0, 0, 0, 0.25));
  @media (max-width: 550px) {
    width: 100vw;
  }
`;
const Inputsearch = styled.input`
  width: 50%;
  padding: 5px;
  border-radius: 30px;
`;
const Titleh1 = styled.h1`
  padding: 20px;
`;
const Orderul = styled.ul`
  width: 50%;
  display: flex;
  justify-content: center;
  margin: 0 auto;
`;
const Orderli = styled.li`
  padding: 15px;
`;
const Listul = styled.ul`
  width: 80%;
  background: white;
  margin: auto;
  max-height: 60%;
  overflow: auto;
  box-shadow: inset;
`;
const Listli = styled.li`
  padding: 15px;
`;
export default ProblemList;
