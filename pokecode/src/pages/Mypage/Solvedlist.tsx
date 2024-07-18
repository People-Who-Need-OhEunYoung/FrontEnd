import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { getTop100 } from '../../utils/api/solvedAc';
import { crawlUserprob } from '../../utils/api/solvedAc';
import cheerio from 'cheerio';
// import { getResolvedProblems } from '../../utils/api/api';

type ItemType = {
  problemId: number;
  titleKo: string;
  level: number;
};

const Solvedlist = () => {
  const [query, setQuery] = useState(''); // 사용자 검색 쿼리
  const [userData, setUserData] = useState(''); // API로부터 받은 데이터
  const [items, setItems] = useState<ItemType[]>([]); // 문제 데이터를 저장할 배열
  const [problems, setProblems] = useState<ItemType[]>([]); // 문제 데이터를 저장할 배열
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  console.log(items);

  const fetchUserData = async () => {
    try {
      const res = await getTop100(query);
      setUserData(JSON.stringify(res));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchCrawlData = async () => {
    try {
      const res = await crawlUserprob(query, page);
      const $ = cheerio.load(res);
      const nextData: any = $('#__NEXT_DATA__').html();
      const parsedData = JSON.parse(nextData);
      const solvedProblems: ItemType[] =
        parsedData.props.pageProps.problems.items; // Adjust this part according to the actual data structure.

      setProblems(solvedProblems);
      setTotalPages(parsedData.props.pageProps.problems.totalPages); // Adjust this part according to the actual data structure.
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const renderPageButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <PageButton key={i} onClick={() => setPage(i)}>
          {i}
        </PageButton>
      );
    }
    return buttons;
  };

  useEffect(() => {
    setQuery('ejrrl6931');
    if (query != '') {
      fetchUserData();
      fetchCrawlData();
    }

    if (userData) {
      const parsedData = JSON.parse(userData);
      if (parsedData.count > 0) {
        const itemsArray = [];
        for (let i = 0; i < parsedData.items.length; i++) {
          const item = parsedData.items[i];
          itemsArray.push(item);
        }
        setItems(itemsArray); // items 상태 업데이트
      }
    }
    // const result = getResolvedProblems;
    // console.log("문제쿼리 결과:", result);
  }, [userData, query, problems]);

  return (
    <Wrap>
      <ButtonGroup>
        <SelectBtn>문제별 획득한 크레딧</SelectBtn>
      </ButtonGroup>
      <hr style={{ marginBottom: '12px' }}></hr>
      <ListView>{<div>문제 별 획득한 크레딧 확인 페이지</div>}</ListView>
      {renderPageButtons()}
    </Wrap>
  );
};

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
`;

// const List_title = styled.p`
//   color: white;
//   margin-bottom: 10px;
//   font-size: 1.2rem;
// `;
// const List_title = styled.p`
//   color: white;
//   margin-bottom: 10px;
//   font-size: 1.2rem;
// `;

// const Item = styled.div`
//   border-bottom: 1px solid #eee;
//   padding: 10px;
// `;

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

// const TierImg = styled.img`
//   position: relative;

//   width: 15px;
//   margin-right: 3%;

//   cursor: pointer;

//   &:hover + span {
//     display: block;
//   }
// `;

// const ProblemList = styled.div`
//   display: flex;
// `;

export default Solvedlist;
