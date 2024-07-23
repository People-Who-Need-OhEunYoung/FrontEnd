import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import rolling from '../../assets/images/rolling2.svg';
import { useDispatch } from 'react-redux';
import { setWrittenCode } from '../../store/problemSlice';
import { getRoomPeopleChecker } from '../../utils/api/api';

const ModalContent7 = ({ id, title, roomId, maxPerson, event }: any) => {
  const [loding, setLoding] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //우현코드 start
  const enterRoom = async () => {
    setLoding(true);

    let countPerson = await getRoomPeopleChecker(roomId);
    console.log('maxPerson, countPerson--------------');
    console.log(maxPerson, countPerson);
    console.log('maxPerson, countPerson--------------');

    if (maxPerson == countPerson.count) {
      alert('인원이 초과되었습니다.');
      setLoding(false);
      event(false);
      return;
    }

    const value = localStorage.getItem('bakjoon_id');
    const roomIdValue = roomId;

    if (!value || !roomIdValue) {
      alert('Please enter both username and room ID.');
      setLoding(false);
      return;
    }
    localStorage.setItem('roomId', roomIdValue);

    const queryParam: any = {
      roomid: roomIdValue,
      id: id,
      title: title,
      max_person : maxPerson
    };

    const params = new URLSearchParams(queryParam);
    setTimeout(() => {
      navigate(`/room?${params}`);
    }, 2000);
  };
  //추가 수정 필요 가능성 있음 현재 봤을때는 UUID 만 있으면 방에 참여하는 것으로 보임
  //우현코드 end

  useEffect(() => {
    dispatch(setWrittenCode(''));
  }, []);

  return (
    <>
      {loding ? (
        <img src={rolling} alt="" />
      ) : (
        <div style={{ width: '400px' }}>
          <ProblemInfo>
            {' '}
            {id}번 {title}
          </ProblemInfo>
          <SolveBtn
            onClick={() => {
              enterRoom();
            }}
          >
            <b>리뷰방 입장</b>
          </SolveBtn>
        </div>
      )}
    </>
  );
};

const ProblemInfo = styled.p`
  font-size: 1.3rem;
  font-weight: bold;
  color: #ff79c6;
  margin: 10%;
`;

const SolveBtn = styled.button`
  position: relative;
  width: 55%;
  margin: 10px 20%;
  padding: 0.3rem 1rem;
  font-size: 1.2em;
  color: white;
  border-radius: 10px;
  border: none;
  background-color: #6366f1;
  box-sizing: border-box;
  cursor: pointer;
`;

export default ModalContent7;
