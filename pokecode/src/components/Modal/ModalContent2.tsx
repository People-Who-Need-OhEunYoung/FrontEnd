import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { DesignedButton1 } from '../DesignedButton';
import Select from 'react-select';
import { problemSearch } from '../../utils/api/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

type ProblemType = {
  id: string;
  title: string;
  level: number;
};

const ModalContent2 = ({ width, reset }: any) => {
  const [title, setTitle] = useState('');
  const [query, setQuery] = useState('');
  const [person, setPerson] = useState(2);
  const [isEditing, setIsEditing] = useState(false);
  const [problems, setProblems] = useState<ProblemType[]>([]); // 문제 데이터를 저장할 배열


  // const [selectedProblem, setSelectedProblem] = useState<ProblemType | null>(
  //   null
  // );


  //우현코드 start
  const navigate = useNavigate();
  //우현코드 end
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
    //빌드를 위해 임시 콘솔 처리
    console.log(problems);
  }, []);

  useEffect(() => {
    if (reset) {
      console.log('reset: ', reset);
      setTitle('');
      setQuery('');
      setPerson(2);
      setIsEditing(false);
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

  const selecthandleChange = (selectedOption: any) => {
    // 선택된 옵션을 처리합니다. selectedOption 객체가 전달됩니다.
    console.log(selectedOption); // 전체 선택된 객체를 로그로 확인

    if (selectedOption) {
      console.log('Selected problem ID: ', selectedOption.id);
      console.log('Selected problem title: ', selectedOption.title);
    }
  };

  const customStyles = {
    container: (provided: any) => ({
      ...provided,
      width: '70%', // 부모 요소의 너비를 100%로 설정
      margin: 'auto',
      padding: '10px 0',
      cursor: 'pointer',
      color: 'black',
    }),
    control: (provided: any) => ({
      ...provided,
      width: '100%', // Select 컴포넌트의 너비를 설정
      color: 'black',
    }),
  };
  //우현코드 start
  const createRoom = async () => {
    const userId = localStorage.getItem('loginuserid');

    if (!userId) {
      alert('사용자 정보가 없습니다. 재로그인 바랍니다.');
      return;
    }

    try {
      const { data } = await axios.post(
        //'https://api.poke-code.com:3334/create-room-with-user',
        'http://192.168.1.18:3334/create-room-with-user',
        {
          username: userId, // 닉네임.
        }
      );
      localStorage.setItem('username', userId);
      localStorage.setItem('roomId', data.roomId);

      alert('성공적으로 방이 생성되었습니다.');
      navigate(`/room?roomid=${data.roomId}`);
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room.');
    }
  };
  // 우현코드 end

  return (
    <div style={{ width: '400px', marginTop: '20px' }}>
      <div
        style={{
          width: width,
          fontWeight: 'bold',
        }}
      >
        <div style={{ lineHeight: '20px' }}>
          <Select
            options={problems}
            styles={customStyles}
            placeholder="문제 검색"
            getOptionLabel={(option) => option.title} // 라벨을 지정
            getOptionValue={(option) => option.id} // 값을 지정
            onChange={selecthandleChange}
          />
        </div>
        <div style={{ minHeight: '20px' }} onDoubleClick={handleDoubleClick}>
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
              readOnly
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
        <p style={{ marginBottom: '30px' }}>최대인원은 4명 입니다</p>
      </div>

      <DesignedButton1
        color="#6c37fd"
        onClick={() => {
          createRoom();
        }}
      >
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
  word-break: break-all;
  border: none;
  font-size: 1rem;
  font-weight: bold;
  outline: none;
  resize: none;
  overflow: auto;
  border-radius: 5px;
  height: 5%;
`;
const Person = styled.input`
  text-align: center;
  border: none;
  font-weight: bold;
  width: 80px;
  font-size: 35px;
  background: none;
  color: #fff;
`;

const PersonWrap = styled.div`
  display: flex;
  margin: auto;
  width: 100%;
  font-size: 40px;
  margin: 20px 0 0;
  justify-content: center;
`;

export default ModalContent2;
