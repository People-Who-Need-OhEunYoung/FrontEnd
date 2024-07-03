import { useState } from 'react';
import { userSearch } from '../../utils/api/solvedAc';
import styled from 'styled-components';
import Uploader from './Uploader';
import Solvedlist from './Solvedlist';

const Mypage = () => {
  const [data, setData] = useState('');
  const handleClick = () => {
    userSearch('ejrrl6931')
      .then((res) => {
        console.log(res); // 받아온 데이터를 콘솔에 출력
        setData(JSON.stringify(res)); // 받아온 데이터를 state에 저장
      })
      .catch((error) => {
        console.error('Error fetching data:', error); // 에러 처리
      });
  };

  return (
    <div>
      <RectangleWrap>
        <Uploader />
        <Solvedlist />
      </RectangleWrap>
    </div>
  );
};

const RectangleWrap = styled.div`
  height: 80vh;
  width: 60vw;
  background-color: #424068;
  border-radius: 40px;
  margin: auto;
  justify-content: center;
  align-items: center; // 자식 요소들을 세로 방향으로 중앙 정렬
`;

export default Mypage;
