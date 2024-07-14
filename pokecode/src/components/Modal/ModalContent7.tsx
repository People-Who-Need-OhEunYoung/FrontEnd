import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const ModalContent7 = ({id, title} : any) => {
  const navigate = useNavigate();

  const gotoSolve = () => {
    navigate(`/room?id=${id}&title=${title}`);
  };

  return (
    <div style={{ width: '400px' }}>
      <ProblemInfo> {id}번 {title}</ProblemInfo>
      <SolveBtn onClick={() => gotoSolve()}>
        <b>리뷰방 입장</b>
      </SolveBtn>
    </div>
  );
};

const ProblemInfo = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  color: #434343;
  margin: 10%;
`;

const SolveBtn = styled.button`
  position: relative;
  width: 55%;
  margin: 10px 20%;
  padding: 0.3rem 1rem;
  font-size: 1.2em;
  border-radius: 30px;
  border: none;
  background-color: #d6d4d4;
  box-sizing: border-box;
  cursor: pointer;
`;

export default ModalContent7;
