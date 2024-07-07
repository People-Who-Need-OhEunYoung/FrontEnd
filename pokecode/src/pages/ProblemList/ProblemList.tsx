import styled from 'styled-components';
import { useState, useEffect  } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { probSearch } from '../../utils/api/solvedAc';
import SortList from './SortList';

type ItemType = {
  problemId: number;
  titleKo: string;
  level: number;
  acceptedUserCount: number;
  averageTries: number;
};


const ProblemList = () => {
  const [query, setQuery] = useState(' '); // 검색 문자열 쿼리

  const [probData, setProbData] = useState(''); // API로부터 받은 데이터
  const [problems, setProblems] = useState<ItemType[]>([]); // 문제 데이터를 저장할 배열
  const [sort, setSort] = useState<string>('id');
  const [page, setPage] = useState<number>(1);
  const [order, setOrder] = useState<string>('asc');

  const fetchProbData = async () => {
    try {
      const res = await probSearch(query, sort, page, order);
      setProbData(JSON.stringify(res));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const OrderButtonClick = () => {
    setOrder((prevText) =>
      prevText === 'asc' ? 'desc' : 'asc'
    );
  };

  useEffect(() => {
    fetchProbData();
    if (probData) {
      const parsedData = JSON.parse(probData);
      if (parsedData.count > 0) {
        const itemsArray = [];
        for (let i = 0; i < parsedData.items.length; i++) {
          const item = parsedData.items[i];
          itemsArray.push(item);
        }
        setProblems(itemsArray); // items 상태 업데이트
        console.log('items: ', problems);
        console.log('order:', order);
      }
    }
  }, [probData, query, sort, order]);

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
        <SearchWrapper>
          <Titleh1>문제 검색</Titleh1>
          <Inputsearch type="text" value={query} onChange={(e) => {setQuery(e.target.value)}} />
          <ButtonGroup>
            <SelectBtn onClick={() => {setSort('id');  OrderButtonClick();}}> ID </SelectBtn>
            <SelectBtn onClick={() => {setSort('level'); OrderButtonClick();}}>레벨</SelectBtn>
            <SelectBtn onClick={() => {setSort('title'); OrderButtonClick();}}>제목</SelectBtn>
            <SelectBtn onClick={() => {setSort('solved'); OrderButtonClick();}}>푼 사람 수</SelectBtn>
            <SelectBtn onClick={() => {setSort('average_try'); OrderButtonClick();}}>평균 시도</SelectBtn>
          </ButtonGroup>
        </SearchWrapper>
      
        {/* <SortList/> */}
        <Listheader>
          <h4 style={{width: '24px'}}>#</h4>
          <h4 style={{'width': '30%'}}>  제목 </h4>
          <h4 style={{'width': '10%'}}>  푼 사람 수 </h4>
          <h4 style={{'width': '10%'}}>  평균 시도 </h4>
        </Listheader>
        {/* <hr style= {{ width: '75%', margin: 'auto',marginBottom: '15px'}}></hr> */}
        <ListView>
          {/* <Listli>
            테스트 문제입니다 <Link to={'/problem'}>입장</Link>
          </Listli> */}
          {problems.map((item, index) => (
              <Item key={index}>
                 {(() => {
                    const link = `https://www.acmicpc.net/problem/${item.problemId}`;
                    const tiersrc = `https://static.solved.ac/tier_small/${item.level}.svg`;
                    return <ProblemComponent>
                      <TierImg src={tiersrc} /> 
                        <a href={link} style={{'width': '16%'}}> {item.problemId}</a> 
                        <a href={link} style={{'width': '44%'}}> {item.titleKo}</a>
                        <p style={{'width': '23%'}}> {item.acceptedUserCount}</p>
                        <p style={{'width': '10%'}}> {item.averageTries}</p>
                    </ProblemComponent>;
                  })()}
              </Item>
          ))}
        </ListView>
        <SearchWrapper>{page}</SearchWrapper> 

      </Modal>
      
    </motion.div>
  );
};

const ProblemComponent = styled.div`
  display: flex;
  margin: auto;
  align-items: center;
`;

const ListView = styled.div`
  background-color: #ffffff1d;
  width: 75%;
  height: 62%;
  overflow-y: auto;
  margin: auto;
  /* align-items: stretch;
  flex-direction: column; */
`;

const Listheader = styled.div`
  width: 75%;
  display: flex;
  margin: auto;
  justify-content: space-around;
  padding: 10px;
`;

const SearchWrapper = styled.div`
  text-align: center; 
  margin: 10px auto;
`;

/* 모달 */
const Modal = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  width: 75%;
  height: 100%;
  margin: auto;
  color: white;
  background: #47464630;
  border-radius: 20px;;
  filter: drop-shadow(0px 6px 4px rgba(0, 0, 0, 0.25));
  box-shadow: 0 0 10px 1px rgba(255, 255, 255, 0.267);
  @media (max-width: 550px) {
    width: 100vw;
  }
`;

const TierImg = styled.img`
  position :relative;
  width: 15px;
  margin-right: 2%;
`;

const Inputsearch = styled.input`
  width: 40%;
  padding: 5px;
  border-radius: 30px;
  box-shadow: 0 0 15px 7px rgba(255, 255, 255, 0.267);
`;

const Titleh1 = styled.p`
  padding: 10px;
  font-size: 1.2rem;
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
  color: black;
  padding: 15px;
`;

const Item = styled.div`
  border-bottom: 1px solid #8d8d8d;
  padding: 10px;
`;

const ButtonGroup = styled.div`
  border-radius: 10px;
`;


const SelectBtn = styled.button`
  color: white;
  background-color: transparent;
  padding: 4px 10px ;
  border: none;
  border-radius: 15px;
  outline: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.75;
  text-transform: uppercase;
  transition: background-color 0.3s;
  margin: 7px;

  &:hover {
    background-color: #4ea7ff52;
  }

  &:active {
    background-color: #4ea7ff52;
  }

  /* &:focus {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.584);
  } */
`;


export default ProblemList;
