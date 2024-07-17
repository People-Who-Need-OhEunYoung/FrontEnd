import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const ModalContent7 = ({ id, title }: any) => {
  const navigate = useNavigate();

  //우현코드 start
  const enterRoom = async () => {
    const value = localStorage.getItem('loginuserid');
    const roomIdValue = '3cde4f2a-f231-4554-bb45-da17a046a1ef';

    if (!value || !roomIdValue) {
      alert('Please enter both username and room ID.');
      return;
    }

    //setRoomId(roomIdValue);
    //setUsername(value);
    localStorage.setItem('username', value);
    localStorage.setItem('roomId', roomIdValue);
    navigate(`/room/?roomid=${roomIdValue}&id=${id}&title=${title}`);
  };
  //추가 수정 필요 가능성 있음 현재 봤을때는 UUID 만 있으면 방에 참여하는 것으로 보임
  //우현코드 end

  return (
    <div style={{ width: '400px' }}>
      <ProblemInfo>
        {' '}
        {id}번 {title}
      </ProblemInfo>
      <SolveBtn onClick={() => /*gotoSolve();*/ enterRoom()}>
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
