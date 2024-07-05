import Uploader from './Uploader';
import Solvedlist from './Solvedlist';
import { MainWrapper } from '../../components/MainWrapper';
import { useEffect, useState } from 'react';
import { crawlUserprob }  from '../../utils/api/solvedAc';
import cheerio from 'cheerio';

const Mypage = () => {
    const [query, setQuery] = useState('jade0179'); // 사용자 검색 쿼리
    const [problems, setProblems] = useState([]);
    const [userData, setUserData] = useState(''); // API로부터 받은 데이터

    const fetchUserData = async () => {
      try {
        const res = await crawlUserprob(query,1);
        const $ = cheerio.load(res);
        const nextData : any = $('#__NEXT_DATA__').html();
        const parsedData = JSON.parse(nextData);
        const solvedProblems = parsedData.props.pageProps.problems; // 이 부분은 실제 데이터 구조에 맞게 조정해야 합니다.
        setProblems(solvedProblems);
        setUserData(parsedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
   };

    useEffect( () => {
      fetchUserData();
      console.log(problems);
    },[]);

  return (

      <MainWrapper>
        <Uploader />
        {/* <button onClick={fetchProblems}>Get Solved Problems</button> */}
        <Solvedlist />
      </MainWrapper>
  );
};

// const RectangleWrap = styled.div`
//   position: relative;
//   margin: auto;
//   height: 80vh;
//   width: 75vw;
//   background-color: #47464630;
//   border-radius: 40px;
//   margin: auto;
//   justify-content: center;
//   align-items: center; // 자식 요소들을 세로 방향으로 중앙 정렬
//   box-shadow: 0px 1px 4px #ffffff48;
//   display:flex;
// `;

export default Mypage;
