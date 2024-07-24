import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { getResolvedProblems } from '../../utils/api/api';

interface Problem {
  problem_id: string;
  get_credit: number;
  resolved_date: string;
  get_Exp: number;
  elapsed_time: number;
  limit_time: number;
  problem_title: string;
}

const Solvedlist = () => {
  //const [userData, setUserData] = useState(''); // API로부터 받은 데이터
  const [problems, setProblems] = useState<Problem[]>([]); // 문제 데이터를 저장할 배열

  //const [items, setItems] = useState<ItemType[]>([]); // 문제 데이터를 저장할 배열

  // const [page, setPage] = useState<number>(1);
  // const [totalPages] = useState<number>(0);

  // const [page, setPage] = useState<number>(1);
  // const [totalPages] = useState<number>(0);

  //console.log(page);

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
      console.log('문제쿼리 결과:', promiseResult);
      if (promiseResult.result == 'success') {
        console.log('푼 문제:', promiseResult.resolvedProblems);
        setProblems(promiseResult.resolvedProblems);
      }
    };
    fetchResolvedProblems();
  }, []);

  return (
    <Wrap>
      <ButtonGroup>
        <SelectBtn active={true}>문제별 획득한 경험치</SelectBtn>
      </ButtonGroup>
      {/* <hr style={{ marginBottom: '12px' }}></hr> */}
      <ListView>
        {problems.length > 0 ? (
          problems.map((problem) => (
            <div>
              <ProblemBox>
                <p>제목:{problem.problem_title}</p>
                <p>경험치:{problem.get_credit}</p>
                <p>
                  획득날짜:
                  {problem.resolved_date.includes('T')
                    ? problem.resolved_date.split('T')[0]
                    : problem.resolved_date}
                </p>
                <p>경과시간:{problem.elapsed_time}</p>
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
  background-color: #1e293b7d;
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

const SelectBtn = styled.button<{ active: boolean }>`
  padding: 5px 50px;
  border: none;
  outline: none;
  cursor: 'inherit';
  font-size: 1.1rem;
  line-height: 1.75;
  text-transform: uppercase;
  transition: background-color 0.3s;
  font-weight: bold;
  background-color: #1e293b;
  border-bottom: ${({ active }) =>
    active ? '3px solid #38BDF8' : '2px solid #1E293B'};
  background-color: ${({ active }) => (active ? '#1E293B' : '#38455a9b')};
  color: ${({ active }) => (active ? '#38BDF8' : '#8ea5af')};
`;

const ProblemBox = styled.div`
  /* border: 1px solid white; 전체 테두리와 색상을 한 번에 정의 */
  border-radius: 10px;
  position: relative;
  width: 95%;
  margin: auto;
  margin-top: 20px;
  text-align: center;
  background-color: #32405693;
  color: #d3dde8;
`;

export default Solvedlist;
