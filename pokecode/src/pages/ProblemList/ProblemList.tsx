import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { probSearch } from '../../utils/api/solvedAc';
import upArrow from '../../assets/images/upArrow.png';
import downArrow from '../../assets/images/downArrow.png';
import Search from '../../assets/images/search.png';
import Modal from '../../components/Modal/Modal';

type ItemType = {
  problemId: string;
  titleKo: string;
  level: number;
  acceptedUserCount: number;
  averageTries: number;
};

const ProblemList = () => {
  const [query, setQuery] = useState(' '); // 검색 문자열 쿼리
  const [problems, setProblems] = useState<ItemType[]>([]); // 문제 데이터를 저장할 배열
  const [sort, setSort] = useState<string>('id');
  const [page, setPage] = useState<number>(1);
  const [order, setOrder] = useState<string>('asc');
  const [pageCount, setPageCount] = useState<number>(1);
  const [currentPageGroup, setCurrentPageGroup] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<string>('');
  const [probId, setProbId] = useState<string>('');

  const fetchProbData = async () => {
    try {
      const res = await probSearch(query, sort, page, order);
      return res;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSortClick = (currentClick: string) => {
    if (currentClick === sort) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setOrder('asc');
    }
    setSort(currentClick);
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
      console.log(res);
      const page_count = Math.ceil(res.count / parsedData.items.length);

      setPageCount(page_count);
      if (parsedData.count > 0) {
        const itemsArray = [];
        for (let i = 0; i < parsedData.items.length; i++) {
          const item = parsedData.items[i];
          itemsArray.push(item);
        }
        setProblems(itemsArray); // items 상태 업데이트
        console.log('items: ', problems);
      } else {
        setProblems([]);
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
      <MainWrapper>
        <SearchWrapper>
          <div
            style={{
              position: 'relative',
              width: '35%',
              margin: 'auto',
              marginTop: '4%',
            }}
          >
            <img
              src={Search}
              style={{
                position: 'absolute',
                width: '20px',
                right: '15px',
                top: '9px',
                cursor: 'pointer',
              }}
            ></img>
            <Inputsearch
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            />
          </div>
          <ButtonGroup style={{}}>
            <SelectBtn
              onClick={() => {
                handleSortClick('id');
              }}
            >
              ID
            </SelectBtn>
            <SelectBtn
              onClick={() => {
                handleSortClick('level');
              }}
            >
              레벨
            </SelectBtn>
            <SelectBtn
              onClick={() => {
                handleSortClick('title');
              }}
            >
              제목
            </SelectBtn>
            <SelectBtn
              onClick={() => {
                handleSortClick('solved');
              }}
            >
              푼 사람 수
            </SelectBtn>
            <SelectBtn
              onClick={() => {
                handleSortClick('average_try');
              }}
            >
              평균 시도
            </SelectBtn>
            <SelectBtn
              onClick={() => {
                handleSortClick('random');
              }}
            >
              랜덤
            </SelectBtn>
            <SelectBtn
              style={{
                fontSize: '1.5rem',
                fontFamily: 'math',
                lineHeight: '1.5rem',
              }}
              onClick={() => {
                setOrder(order === 'asc' ? 'desc' : 'asc');
              }}
            >
              {order === 'asc' ? (
                <OrderButton src={upArrow} />
              ) : (
                <OrderButton src={downArrow} />
              )}
            </SelectBtn>
          </ButtonGroup>
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
                    <TitleBtn
                      onClick={() => {
                        setIsModalOpen(true);
                        setSelected(item.titleKo);
                        setProbId(item.problemId);
                      }}
                      style={{}}
                    >
                      {' '}
                      {item.titleKo}
                    </TitleBtn>
                    <p style={{ width: '52%', textAlign: 'end' }}>
                      {' '}
                      {item.acceptedUserCount}
                    </p>
                    <p style={{ width: '21.5%', textAlign: 'end' }}>
                      {' '}
                      {item.averageTries}
                    </p>
                  </ProblemComponent>
                );
              })()}
            </Item>
          ))}
        </ListView>
        <Modal
          text={selected}
          id={probId}
          component={1}
          on={isModalOpen}
          event={setIsModalOpen}
        ></Modal>
        <ButtonGroup style={{ margin: '1.5%' }}>
          {renderPageButtons()}
        </ButtonGroup>
      </MainWrapper>
    </motion.div>
  );
};

const TitleBtn = styled.button`
  position: absolute;
  background-color: transparent;
  color: white;
  border: none;
  width: 60%;
  text-align: left;
  left: 20%;
`;

const OrderButton = styled.img`
  width: 20px;
  height: 20px;
  margin-top: 5px;
  filter: invert(1);
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
  position: relative;
`;

const ListView = styled.div`
  background-color: #6666661d;
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
  margin: 5px;
`;

/* 모달 */
const MainWrapper = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  width: 75%;
  height: 100%;
  margin: auto;
  color: white;
  background: #111826;
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
  width: 100%;
  padding: 7px 40px 7px 15px;
  border-radius: 30px;
  box-shadow: 0 0 15px 7px rgba(255, 255, 255, 0.267);
  box-sizing: border-box;
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

const SelectBtn = styled.button`
  color: white;
  background-color: transparent;
  padding: 4px 10px;
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
`;

export default ProblemList;
