import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { getResolvedProblems } from '../../utils/api/api';


interface Problem {
  problem_id: string,
  get_credit: number,
  resolved_date: string,
  get_Exp: number,
  elapsed_time: number,
  limit_time: number,
  problem_title: string
}

const Solvedlist = () => {
  const [userData, setUserData] = useState(''); // API로부터 받은 데이터
  const [problems, setProblems] = useState<Problem[]>([]); // 문제 데이터를 저장할 배열

  //const [items, setItems] = useState<ItemType[]>([]); // 문제 데이터를 저장할 배열


  // const [page, setPage] = useState<number>(1);
  // const [totalPages] = useState<number>(0);

  const [page, setPage] = useState<number>(1);
  const [totalPages] = useState<number>(0);
  console.log(page);


  // const fetchUserData = async () => {
  //   try {
  //     const res = await getTop100(query);
  //     setUserData(JSON.stringify(res));
  //     return res;
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  // const fetchCrawlData = async () => {
  //   try {
  //     const res = await crawlUserprob(query, page);
  //     const $ = cheerio.load(res);
  //     const nextData: any = $('#__NEXT_DATA__').html();
  //     const parsedData = JSON.parse(nextData);
  //     const solvedProblems: ItemType[] =
  //       parsedData.props.pageProps.problems.items; // Adjust this part according to the actual data structure.

  //     setProblems(solvedProblems);
  //     setTotalPages(parsedData.props.pageProps.problems.totalPages); // Adjust this part according to the actual data structure.
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };
 
  // const renderPageButtons = () => {
  //   const buttons = [];
  //   for (let i = 1; i <= totalPages; i++) {
  //     buttons.push(
  //       <PageButton key={i} onClick={() => setPage(i)}>
  //         {i}
  //       </PageButton>
  //     );
  //   }
  //   return buttons;
  // };


  useEffect(() => {

    const fetchResolvedProblems = async () => {
      const promiseResult = await getResolvedProblems();
      console.log("문제쿼리 결과:", promiseResult);
      if (promiseResult.result == 'success') {
        console.log("푼 문제:", promiseResult.resolvedProblems);
        setProblems(promiseResult.resolvedProblems)

      }
    }
    
    fetchResolvedProblems()

  }, [userData]);

  return (
    <Wrap>
      <ButtonGroup>
        <SelectBtn>문제별 획득한 크레딧</SelectBtn>
      </ButtonGroup>
      <hr style={{ marginBottom: '12px' }}></hr>
      <ListView>
        {problems.length > 0 ? (
          problems.map((problem) => (
            <div>
              <ProblemBox>
                <div>제목:{problem.problem_title}</div>
                <div>얻은 크레딧:{problem.get_credit}</div>
                <div>획득날짜:{problem.resolved_date.includes('T') ? problem.resolved_date.split('T')[0] : problem.resolved_date}</div>
                <div>경과시간:{problem.elapsed_time}</div>
              </ProblemBox>
            </div>
          ))
        ) : (
          <div>아직 푼 문제가 없습니다</div>
        )}
      </ListView>
    </Wrap>
  );
};



const Wrap = styled.div`
  position: relative;
  height: 90%;
  width: 40%;
  margin: auto;
`;

const ListView = styled.div`
  background-color: #f7f7f726;
  border-radius: 10px;
  height: 90%;
  overflow-y: auto;
  display: flex;
  justify-items: center;
  align-items: stretch;
  flex-direction: column;
  gap: 10px;
`;

const ButtonGroup = styled.div`
  border-radius: 10px;
`;

const SelectBtn = styled.button`
  color: white;
  background-color: transparent;
  padding: 4px 10px;
  border: none;
  border-radius: 15px;
  outline: none;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  line-height: 1.75;
  text-transform: uppercase;
  transition: background-color 0.3s;
  margin: 7px;
`;

const ProblemBox = styled.div`
  background-color: grey;
  border: 5px solid white; /* 전체 테두리와 색상을 한 번에 정의 */
  border-radius: 15px;
  position: relative;
  height: 90%;
  width: 85%;
  margin: auto;
  text-align: center;
`;


export default Solvedlist;
