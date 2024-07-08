import styled, { css }  from 'styled-components';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {Modal} from '../../components/Modal/Modal';


type ItemType = {
  problemId: number;
  titleKo: string;
  level: number;
  roomTitle: string;
  acceptedUserCount: number;
  nickname: string;
};

const RoomList = () => {
  const [query, setQuery] = useState(' '); // 검색 문자열 쿼리
  const [Room, setRoom] = useState<ItemType[]>([]); // 문제 데이터를 저장할 배열
  const [page, setPage] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(1);
  const [currentPageGroup, setCurrentPageGroup] = useState<number>(0);
  const [check, setCheck] = useState('OFF');


  const switchButton = () => {
    setCheck(check === 'ON' ? 'OFF' : 'ON');
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
      <Modal1>
        <SearchWrapper>
          <Titleh1>코드 리뷰 방</Titleh1>
          <SearchHeader>
            <div style = {{position:'relative', width:'35%', display: 'flex'}}>
              <Inputsearch 
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
              />
              <CheckSlide onClick={switchButton} timeck={check} style = {{position: 'absolute' , right: 0, top: '6px'}}>
                <CheckBtn timeck={check}></CheckBtn>
                <OnOffText timeck={check}>{check}</OnOffText>
              </CheckSlide>
              <CheckDoc>내가 푼 문제만 보기</CheckDoc>
            </div>
            <MakeRoomButton onClick={() => {}}>
              방 만들기
            </MakeRoomButton>
          </SearchHeader>
        </SearchWrapper>

        <ListView>
          
        </ListView>
        <ButtonGroup style={{ margin: '1.5%' }}>{renderPageButtons()}</ButtonGroup>
      </Modal1>
    </motion.div>
  );
};

const CheckSlide = styled.div<{ timeck: string }>`
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  border-width: 5px;
  border-style: solid;
  border-color: #75757c;
  pointer-events: auto;
  height: 2rem;
  line-height: 1.4rem;
  width: 4.6rem;
  border-radius: 9999px;
  background: #ffffff;
  padding: 0.25rem;
  margin: 0 10px;
  cursor: pointer;
  ${(props: any) =>
    props.timeck === 'ON' &&
    css`
      background: #4ce285;
    `}

  &:hover + span {
    display: block;
  }
`;

const CheckDoc = styled.span`
  position: absolute;
  bottom: 100%;
  width: 130px;
  right: -12%;
  background-color: #6e6e6e;
  color: #ffffff;
  padding: 5px;
  border-radius: 5px;
  display: none;
  transition: opacity 0.3s;
  z-index: 100;
  text-align: center;
`;

const CheckBtn = styled.div<{ timeck: string }>`
  height: 1rem;
  width: 1rem;
  color: white;
  text-align: right;
  border-radius: 50%;
  transition-property: color, background-color, border-color,
    text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter,
    backdrop-filter, -webkit-backdrop-filter;
  transition-duration: 0.2s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  background: #47c47b;
  ${(props: any) =>
    props.timeck === 'ON' &&
    css`
      transform: translateX(40px);
      background: #ffffff;
    `}
`;

const OnOffText = styled.span<{ timeck: string }>`
  position: absolute;
  color: #4b4b4b;
  font-weight:bold;
  top: 0px;
  right: 7px;
  ${(props: any) =>
    props.timeck === 'ON' &&
    css`
      transform: translateX(-23px);
    `}
`;

const SearchHeader = styled.div`
  display: flex;
  justify-content:center;
`;



const MakeRoomButton = styled.button`
  width: 10%;
  padding: 5px;
  background-color: #4152b3;
  color: #e6e6e6;
  border-radius: 20px;
  font-size: 1.1rem;
  font-weight:bold;
  border: none;
  margin-left: 2%;

  &:hover {
    box-shadow: 0 0 5px 3px rgba(255, 255, 255, 0.267);
  }

  &:active {
    background-color: #35428b;
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
  margin: 3% auto;
`;

/* 모달 */
const Modal1 = styled.div`
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
  width: 100%;
  border-radius: 30px;
  box-shadow: 0 0 15px 7px rgba(255, 255, 255, 0.267);
  padding: 10px 90px 10px 20px;
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

export default RoomList;
