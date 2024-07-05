import styled from 'styled-components';
import { useState, useEffect  } from 'react';
import { getTop100, probSearch } from '../../utils/api/solvedAc';

type ItemType = {
  problemId: number;
  titleKo: string;
  level: number;
};

const Solvedlist = () => {
  const [query, setQuery] = useState('jade0179'); // 사용자 검색 쿼리
  const [userData, setUserData] = useState(''); // API로부터 받은 데이터
  const [items, setItems] = useState<ItemType[]>([]); // 문제 데이터를 저장할 배열
  const [visibleList, setVisibleList] = useState('list1'); // Manage which list is visible
  const [id, setId] = useState('');

  const fetchUserData = async () => {
    try {
      const res = await getTop100(query);
      setUserData(JSON.stringify(res));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
    if (userData) {
      const parsedData = JSON.parse(userData);
      if (parsedData.count > 0) {
        const itemsArray = [];
        for (let i = 0; i < parsedData.items.length; i++) {
          const item = parsedData.items[i];
          itemsArray.push(item);
        }
        setItems(itemsArray); // items 상태 업데이트
        console.log(items);
      }
    }
  }, [userData, query]);

  return (
     <Wrap>
        <ButtonGroup>
          <SelectBtn onClick={() => setVisibleList('list1')}>Top 100 </SelectBtn>
          <SelectBtn onClick={() => setVisibleList('list2')}>내가 해결한 문제 </SelectBtn>
          <SelectBtn onClick={() => setVisibleList('list3')}>List 3</SelectBtn>
        </ButtonGroup>
        <hr style= {{marginBottom: '12px'}}></hr>
        <ListView>
          {visibleList === 'list1' && items.map((item, index) => (
              <Item key={index}>
                 {(() => {
                    const link = `https://www.acmicpc.net/problem/${item.problemId}`;
                    return <a href={link}>{index} {item.problemId} {item.titleKo}</a>;
                  })()}
              </Item>
          ))}
          {visibleList === 'list2' && <div>List 2 content here</div>}
          {visibleList === 'list3' && <div>List 3 content here</div>}
        </ListView>
     </Wrap>
    
  )

}

const Wrap = styled.div`
    position: relative;
    height: 90%;
    width: 40%;
    margin: auto;    
`;

const ListView = styled.div`
  background-color: #020202;
  border-radius: 10px;
  height: 90%;
  overflow-y: scroll;
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
  padding: 4px 10px ;
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

export default Solvedlist;
