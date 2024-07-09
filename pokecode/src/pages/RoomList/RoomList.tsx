import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
//import { Link } from 'react-router-dom';
import { probSearch } from '../../utils/api/solvedAc';
import upArrow from '../../assets/images/upArrow.png';
import downArrow from '../../assets/images/downArrow.png';


type ItemType = {
  problemId: number;
  titleKo: string;
  level: number;
  acceptedUserCount: number;
  averageTries: number;
};

const RoomList = () => {
  const [query, setQuery] = useState(' '); // 검색 문자열 쿼리
  const [problems, setProblems] = useState<ItemType[]>([]); // 문제 데이터를 저장할 배열
  const sort = 'id';
  //const [sort, setSort] = useState<string>('id');
  const [page, setPage] = useState<number>(1);
  const [order, setOrder] = useState<string>('asc');
  const [pageCount, setPageCount] = useState<number>(1);
  const [currentPageGroup, setCurrentPageGroup] = useState<number>(0);
  const [orderButtonText, setOrderButtonText] = useState<JSX.Element>(<OrderButton src= {upArrow}/>);
  console.log(orderButtonText);
  const fetchProbData = async () => {
    try {
      const res = await probSearch(query, sort, page, order);
      return res;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const OrderButtonClick = () => {
    setOrder((prevText) => (prevText === 'asc' ? 'desc' : 'asc'));
    setOrderButtonText(order === 'asc' ? <OrderButton  src={downArrow} /> : <OrderButton src={upArrow} /> );
  };

  const renderPageButtons = () => {
      const buttons = [];
      const startPage = currentPageGroup * 10 + 1;
      const endPage = Math.min(startPage + 9, pageCount);

      for (let i = startPage; i <= endPage; i++) {
        buttons.push(
          <PageButton key={i} onClick={() => setPage(i)}>
            {i}
          </PageButton>
        );
      }

      return (
        <>
          {currentPageGroup > 0 && (
            <PageButton onClick={() => setCurrentPageGroup(currentPageGroup - 1)}>
              &lt;
            </PageButton>
          )}
          {buttons}
          {endPage < pageCount && (
            <PageButton onClick={() => setCurrentPageGroup(currentPageGroup + 1)}>
              &gt;
            </PageButton>
          )}
        </>
      );
    };

  useEffect(() => {
    fetchProbData().then((res) => {
      const parsedData = res;
      const page_count = Math.ceil((res.count)/parsedData.items.length);
      setPageCount(page_count);
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
    });
  }, [query, sort, page, order]);

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
          <Titleh1>코드 리뷰 방</Titleh1>
          <SearchHeader>
            <Inputsearch
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            />
            <MakeRoomButton onClick={() => {
                OrderButtonClick();
              }}>
              방 만들기
            </MakeRoomButton>
          </SearchHeader>
          
        </SearchWrapper>

        {/* <SortList/> */}
        <Listheader>
          <h4 style={{ width: '24px' }}>#</h4>
          <h4 style={{ width: '30%' }}> 제목 </h4>
          <h4 style={{ width: '10%' }}> 푼 사람 수 </h4>
          <h4 style={{ width: '10%' }}> 평균 시도 </h4>
        </Listheader>
        <ListView>
          {problems.map((item, index) => (
            <Item key={index}>
              {(() => {
                const link = `https://www.acmicpc.net/problem/${item.problemId}`;
                const tiersrc = `https://static.solved.ac/tier_small/${item.level}.svg`;
                return (
                  <ProblemComponent>
                    <TierImg src={tiersrc} />
                    <a href={link} style={{ width: '16%' }}>
                      {' '}
                      {item.problemId}
                    </a>
                    <a href={link} style={{ width: '44%' }}>
                      {' '}
                      {item.titleKo}
                    </a>
                    <p style={{ width: '23%' }}> {item.acceptedUserCount}</p>
                    <p style={{ width: '10%' }}> {item.averageTries}</p>
                  </ProblemComponent>
                );
              })()}
            </Item>
          ))}
        </ListView>
        <ButtonGroup style={{ margin: '1.5%' }}>{renderPageButtons()}</ButtonGroup>
      </Modal>
    </motion.div>
  );
};

const SearchHeader = styled.div`
  display: flex;
  justify-content:center;
`;

const OrderButton = styled.img`
  width: 20px;
  height: 20px;
  margin-top: 5px;
  filter: invert(1);
`;

const MakeRoomButton = styled.button`
  width: 10%;
  margin: 0 20px;
  padding: 5px;
  background-color: black;
  color: white;
  border-radius: 10px;
  font-size: 1.2rem;
  border: none;
  box-shadow: 0 0 10px 7px rgba(255, 255, 255, 0.267);
  
  &:hover {
    background-color: #4ea7ff52;
  }

  &:active {
    background-color: #4ea7ff52;
  }
`;


const PageButton = styled.button`
  width: 30px;
  margin-right: 10px;
  background-color: transparent;
  color: white;
  border-radius: 10px;
  font-size: 1rem;
  border: none;
  
  &:hover {
    background-color: #4ea7ff52;
  }

  &:active {
    background-color: #4ea7ff52;
  }
`;

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
  border-radius: 20px;
  filter: drop-shadow(0px 6px 4px rgba(0, 0, 0, 0.25));
  box-shadow: 0 0 10px 1px rgba(255, 255, 255, 0.267);
  @media (max-width: 550px) {
    width: 100vw;
  }
`;

const TierImg = styled.img`
  position: relative;
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


const Item = styled.div`
  border-bottom: 1px solid #8d8d8d;
  padding: 10px;
`;

const ButtonGroup = styled.div`
  border-radius: 10px;
  display: flex;
  justify-content: center;
`;

// const SelectBtn = styled.button`
//   color: white;
//   background-color: transparent;
//   padding: 4px 10px;
//   border: none;
//   border-radius: 15px;
//   outline: none;
//   cursor: pointer;
//   font-size: 1rem;
//   font-weight: 500;
//   line-height: 1.75;
//   text-transform: uppercase;
//   transition: background-color 0.3s;
//   margin: 7px;

//   &:hover {
//     background-color: #4ea7ff52;
//   }

//   &:active {
//     background-color: #4ea7ff52;
//   }

// `;

export default RoomList;
