import { useState } from 'react';
import styled from 'styled-components';
import { DesignedButton1 } from '../DesignedButton';
const ModalContent2 = ({ width, onOff }: any) => {
  const [title, setTitle] = useState('');
  const [person, setPerson] = useState(2);
  const [isEditing, setIsEditing] = useState(false);

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

  return (
    <div style={{ width: '400px' }}>
      <div
        style={{
          width: width,
          padding: '30px 0 20px',
          fontWeight: 'bold',
        }}
      >
        <div style={{ minHeight: '40px' }} onDoubleClick={handleDoubleClick}>
          {isEditing ? (
            <Titleinput
              value={title}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ padding: '10px', borderRadius: '20px' }}
              onKeyDown={(e) => {
                if (e.keyCode === 13) handleBlur();
              }}
              autoFocus
              placeholder="방 제목을 입력해주세요"
            />
          ) : (
            <span
              style={{
                display: 'inline-block',
                width: '70%',
                wordBreak: 'break-all',
                padding: '10px',
              }}
            >
              {title == '' ? '방 제목을 입력해주세요.' : title}
            </span>
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
  width: 70%;
  height: 21.5px;
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
