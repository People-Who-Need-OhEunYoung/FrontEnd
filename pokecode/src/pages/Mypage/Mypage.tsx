import { useState } from 'react';
import { userSearch } from '../../utils/api/solvedAc';

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
    <>
      <button onClick={handleClick}>API 테스트</button>
      <div>{data}</div>
    </>
  );
};
export default Mypage;
