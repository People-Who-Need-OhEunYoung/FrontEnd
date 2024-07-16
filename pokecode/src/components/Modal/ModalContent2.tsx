import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { DesignedButton1 } from '../DesignedButton';
import Select from 'react-select';
import { problemSearch } from '../../utils/api/api';

type ProblemType = {
  id: string;
  title: string;
};

const ModalContent2 = ({ width, onOff, reset }: any) => {
  const [title, setTitle] = useState('');
  const [query, setQuery] = useState('');
  const [person, setPerson] = useState(2);
  const [isEditing, setIsEditing] = useState(false);
  const [problems, setProblems] = useState<ProblemType[]>([]); // 문제 데이터를 저장할 배열

  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'apricot', label: 'Apricot' },
    { value: 'mango', label: 'Mango' },
    { value: 'mangosteens', label: 'Mangosteens' },
    { value: 'avocado', label: 'Avocado' },
    { value: 'avocado', label: 'Avocado' },
  ];

  const fetchProbData = async () => {
    try {
      const res = await problemSearch(query, 'id', 1, 'asc');
      // console.log(res);
      return res;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (reset) {
      console.log('reset: ', reset);
      setTitle('');
      setQuery('');
      setPerson(2);
      setIsEditing(false);
      setProblems([]);
      console.log('title:', title);
    }
  }, [reset]);

  useEffect(() => {
    fetchProbData().then((res) => {
      const parsedData = res.problem;
      if (parsedData.length > 0) {
        const itemsArray = [];
        for (let i = 0; i < parsedData.length; i++) {
          const item = parsedData[i];
          // console.log('item:', item);
          itemsArray.push(item);
        }
        setProblems(itemsArray); // items 상태 업데이트
        console.log('reset: ', reset);
      } else {
        setProblems([]);
      }
    });
  }, [query]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e: any) => {
    setTitle(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const personPlus = () => {
    if (person < 4) setPerson(person + 1);
  };

  const personMinus = () => {
    if (person > 2) setPerson(person - 1);
  };

  const customStyles = {
    container: (provided: any) => ({
      ...provided,
      width: '70%', // 부모 요소의 너비를 100%로 설정
      margin: 'auto',
    }),
    control: (provided: any) => ({
      ...provided,
      width: '100%', // Select 컴포넌트의 너비를 설정
    }),
  };

  return (
    <div style={{ width: '400px' }}>
      <div
        style={{
          width: width,
          padding: '30px 0 20px',
          fontWeight: 'bold',
        }}
      >
        <Select
          options={problems}
          //styles={customStyles}
          placeholder="문제 검색"
          //isSearchable
          //onInputChange={(value) => setQuery(value)}
        />

        <div style={{ minHeight: '40px' }} onDoubleClick={handleDoubleClick}>
          {isEditing ? (
            <Titleinput
              value={title}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ padding: '10px' }}
              onKeyDown={(e) => {
                if (e.keyCode === 13) handleBlur();
              }}
              rows={1}
              autoFocus
            />
          ) : (
            <Titleinput
              value={title}
              style={{
                display: 'inline-block',
                wordBreak: 'break-all',
                padding: '10px',
                cursor: 'pointer',
              }}
              rows={1}
              placeholder="방 제목을 입력해주세요"
            >
              {/* {title == '' ? '방 제목을 입력해주세요.' : title} */}
            </Titleinput>
          )}
        </div>
        <PersonWrap>
          <span
            style={{ width: '40px', cursor: 'pointer', userSelect: 'none' }}
            onClick={personMinus}
          >
            &lt;
          </span>
          <Person type="text" value={person} readOnly />
          <span
            style={{ width: '40px', cursor: 'pointer', userSelect: 'none' }}
            onClick={personPlus}
          >
            &gt;
          </span>
        </PersonWrap>
        <p>최대인원은 4명 입니다.</p>
      </div>

      <DesignedButton1 color="#5d5d5d" onClick={onOff}>
        방만들기
      </DesignedButton1>
    </div>
  );
};

const Titleinput = styled.textarea`
  width: 65%;
  height: auto;
  min-height: 11.5px; /* 최소 높이를 설정 */
  text-align: center;
  background: #6ebfee2b;
  word-break: break-all;
  /* border: 1px solid #000000; */
  border: none;
  font-size: 1rem;
  font-weight: bold;
  outline: none;
  resize: none;
  overflow: auto;
  height: 5%;
`;
const Person = styled.input`
  text-align: center;
  border: none;
  font-weight: bold;
  width: 80px;
  font-size: 35px;
  background: none;
  color: #000000;
`;

const PersonWrap = styled.div`
  display: flex;
  margin: 30px auto;
  width: 100%;
  font-size: 40px;
  justify-content: center;
`;

export default ModalContent2;
