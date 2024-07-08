import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { getTop100 } from '../../utils/api/solvedAc';
import { crawlUserprob } from '../../utils/api/solvedAc';
import cheerio from 'cheerio';

type ItemType = {
  problemId: number;
  titleKo: string;
  level: number;
};

const Solvedlist = () => {
  const [query, setQuery] = useState('jade0179'); // 사용자 검색 쿼리

  const [userData, setUserData] = useState(''); // API로부터 받은 데이터
  const [items, setItems] = useState<ItemType[]>([]); // 문제 데이터를 저장할 배열

  const [visibleList, setVisibleList] = useState<string>('list1'); // Manage which list is visible
  const [problems, setProblems] = useState<ItemType[]>([]); // 문제 데이터를 저장할 배열

  const fetchUserData = async () => {
    try {
      const res = await getTop100(query);
      setUserData(JSON.stringify(res));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchCrawlData = async () => {
    let allProblems: ItemType[] = [];
    let page = 1;

    while (true) {
      try {
        const res = await crawlUserprob(query, page);
        const $ = cheerio.load(res);
        const nextData: any = $('#__NEXT_DATA__').html();
        const parsedData = JSON.parse(nextData);
        const solvedProblems: ItemType[] =
          parsedData.props.pageProps.problems.items; // Adjust this part according to the actual data structure.

        if (solvedProblems.length === 0) {
          break;
        }
        allProblems = allProblems.concat(solvedProblems);
        page++;
      } catch (error) {
        console.error('Error fetching data:', error);
        break;
      }
    }

    setProblems(allProblems);
    console.log(allProblems);
  };

  useEffect(() => {
    fetchUserData();
    fetchCrawlData();
    if (userData) {
      const parsedData = JSON.parse(userData);
      if (parsedData.count > 0) {
        const itemsArray = [];
        for (let i = 0; i < parsedData.items.length; i++) {
          const item = parsedData.items[i];
          itemsArray.push(item);
        }
        setItems(itemsArray); // items 상태 업데이트
        console.log('items: ', items);
      }
    }
  }, [userData, query]);

  return (
    <Wrap>
      <ButtonGroup>
        <SelectBtn onClick={() => setVisibleList('list1')}>Top 100 </SelectBtn>
        <SelectBtn onClick={() => setVisibleList('list2')}>
          내가 해결한 문제{' '}
        </SelectBtn>
        <SelectBtn onClick={() => setVisibleList('list3')}>List 3</SelectBtn>
      </ButtonGroup>
      <hr style={{ marginBottom: '12px' }}></hr>
      <ListView>
        <Tiergrid>
          {visibleList === 'list1' &&
            items.map((item, index) => (
              <div style={{ position: 'relative' }} key={index}>
                {(() => {
                  const tiersrc = `https://static.solved.ac/tier_small/${item.level}.svg`;
                  const link = `https://www.acmicpc.net/problem/${item.problemId}`;
                  return (
                    <a href={link}>
                      <TierImg src={tiersrc} />
                      <ProblemId>
                        {item.problemId}번 {item.titleKo}
                      </ProblemId>
                    </a>
                  );
                })()}
              </div>
            ))}
        </Tiergrid>
        {visibleList === 'list2' &&
          problems.map((item, index) => (
            <Item key={index}>
              {(() => {
                const link = `https://www.acmicpc.net/problem/${item.problemId}`;
                const tiersrc = `https://static.solved.ac/tier_small/${item.level}.svg`;
                return (
                  <ProblemList>
                    <TierImg src={tiersrc} />
                    <a href={link} style={{ width: '20%' }}>
                      {' '}
                      {item.problemId}
                    </a>
                    <a href={link} style={{ width: '60%' }}>
                      {' '}
                      {item.titleKo}
                    </a>
                  </ProblemList>
                );
              })()}
            </Item>
          ))}
        {visibleList === 'list3' && <div>List 3 content here</div>}
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
`;

const List_title = styled.p`
  color: white;
  margin-bottom: 10px;
  font-size: 1.2rem;
`;

const Item = styled.div`
  border-bottom: 1px solid #eee;
  padding: 10px;
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

  &:hover {
    background-color: #4ea7ff52;
  }

  &:active {
    background-color: #4ea7ff52;
  }

  &:focus {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.584);
  }
`;

const TierImg = styled.img`
  position: relative;

  width: 15px;
  margin-right: 3%;

  cursor: pointer;

  &:hover + span {
    display: block;
  }
`;

const ProblemList = styled.div`
  display: flex;
`;

const ProblemId = styled.span`
  position: absolute;
  top: 100%;
  width: 130px;
  left: -65px;
  background-color: #000000;
  color: #ffffff;
  padding: 5px;
  border-radius: 5px;
  display: none;
  transition: opacity 0.3s;
  z-index: 100;
  text-align: center;
`;

const Tiergrid = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 25px;
  margin: auto;
`;
export default Solvedlist;
