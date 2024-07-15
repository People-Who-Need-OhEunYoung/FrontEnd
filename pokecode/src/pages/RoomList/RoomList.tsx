import styled, { css } from 'styled-components';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from '../../components/Modal/Modal';


type ItemType = {
  roomId: number;
  problemId: string;
  problemTitle: string;
  roomTitle: string;
  level: number;
  limit_num: number;
  cur_num: number;
  nickname: string;
};

const RoomList = () => {
  const [query, setQuery] = useState(' '); // 검색 문자열 쿼리
  const [page, setPage] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(1);
  const [currentPageGroup, setCurrentPageGroup] = useState<number>(0);
  const [check, setCheck] = useState('OFF');
  const [isEnterModalOpen, setIsEnterModalOpen] = useState(false);
  const [isMakeModalOpen, setIsMakeModalOpen] = useState(false);

  const [roomTitle, setRoomTitle] = useState<string>('');
  const [problemTitle, setproblemTitle] = useState<string>('');
  const [problemId, setproblemId] = useState<string>('');
  const [roomlist, setRoomlist] = useState<ItemType[]>([
    {
      roomId: 1,
      problemId: '1000',
      problemTitle: 'A+B',
      roomTitle: '해결 좀 ㅎ ㅐ주세요',
      level: 1,
      limit_num: 3,
      cur_num: 1,
      nickname: 'ㅇㅇㅇ',
    },
  ]); // 문제 데이터를 저장할 배열
  if (roomlist == null)
    setRoomlist([
      {
        roomId: 1,
        problemId: '1000',
        problemTitle: 'A+B',
        roomTitle: '해결 좀 ㅎ ㅐ주세요',
        level: 1,
        limit_num: 3,
        cur_num: 1,
        nickname: 'ㅇㅇㅇ',
      },
    ]);

  //임시 빌드 로직 제거 해도 돼요 start
  if (pageCount == null) setPageCount(1);
  //임시 빌드 로직 제거 해도 돼요 end

  console.log(page);
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
      <MainWrapper>
        <SearchWrapper>
          <SearchHeader>
            <div
              style={{ position: 'relative', width: '35%', display: 'flex' }}
            >
              <Inputsearch
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
              />
              <CheckSlide
                onClick={switchButton}
                timeck={check}
                style={{ position: 'absolute', right: 0, top: '6px' }}
              >
                <CheckBtn timeck={check}></CheckBtn>
                <OnOffText timeck={check}>{check}</OnOffText>
              </CheckSlide>
              <CheckDoc>내가 푼 문제만 보기</CheckDoc>
            </div>
            <MakeRoomButton
              onClick={() => {
                setIsMakeModalOpen(true);
              }}
            >
              방 만들기
            </MakeRoomButton>
          </SearchHeader>
        </SearchWrapper>

        <ListView>
          {roomlist.map((item, index) => (
            <Item key={index}>
              {(() => {
                //const link = `https://www.acmicpc.net/problem/${item.problemId}`;
                const tiersrc = `https://static.solved.ac/tier_small/${item.level}.svg`;
                return (
                  <ProblemComponent
                    onClick={() => {
                      setIsEnterModalOpen(true);
                      setRoomTitle(item.roomTitle);
                      setproblemId(item.problemId);
                      setproblemTitle(item.problemTitle);
                    }}
                  >
                    <Probinfo>
                      <TierImg src={tiersrc} style={{ marginRight: '2%' }} />
                      <p style={{ marginRight: '5%' }}>{item.problemId}</p>
                      <p style={{ marginRight: '8%' }}>{item.problemTitle}</p>
                      <p>{item.roomTitle}</p>
                    </Probinfo>

                    <Roominfo>
                      <p style={{ marginBottom: '10px' }}>
                        {' '}
                        참여 인원: {item.cur_num} /{item.limit_num}
                      </p>
                      <p> 닉네임: {item.nickname} </p>
                    </Roominfo>
                  </ProblemComponent>
                );
              })()}
            </Item>
          ))}
        </ListView>

        <Modal
          title={roomTitle}
          prob_title={problemTitle}
          id={problemId}
          component={6}
          on={isEnterModalOpen}
          event={setIsEnterModalOpen}
        ></Modal>

        <Modal
          component={2}
          on={isMakeModalOpen}
          event={setIsMakeModalOpen}
        ></Modal>

        <ButtonGroup style={{ margin: '1.5%' }}>
          {renderPageButtons()}
        </ButtonGroup>
      </MainWrapper>
    </motion.div>
  );
};

const Probinfo = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  font-size: 1.3rem;
  width: 70%;
`;

const Roominfo = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  text-align: end;
  right: 0;
  color: #c0c0c0;
  width: 30%;
`;

const TierImg = styled.img`
  position: relative;
  width: 20px;
  margin-right: 2%;
  padding: 6px;
`;

const ProblemComponent = styled.div`
  display: flex;
  margin: auto;
  align-items: center;
  position: relative;
`;

const Item = styled.div`
  border: 1px solid #8d8d8d;
  padding: 4%;
`;

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

  &:hover + p {
    display: block;
  }
`;

const CheckDoc = styled.p`
  display: none;
  position: absolute;
  width: 130px;
  padding: 8px;
  right: -8%;
  top: 100%;
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;
  border-radius: 8px;
  background: #646464;
  color: #fff;
  font-size: 14px;

  &::after {
    position: absolute;
    bottom: 100%;
    left: 50%;
    width: 0;
    height: 0;
    margin-left: -10px;
    border: solid transparent;
    border-color: rgba(51, 51, 51, 0);
    border-bottom-color: #646464;
    border-width: 10px;
    pointer-events: none;
    content: ' ';
  }
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
  font-weight: bold;
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
  justify-content: center;
`;

const MakeRoomButton = styled.button`
  width: 10%;
  padding: 5px;
  background-color: #4152b3;
  color: #e6e6e6;
  border-radius: 20px;
  font-size: 1.1rem;
  font-weight: bold;
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

const ListView = styled.div`
  background-color: #ffffff1d;
  width: 75%;
  height: 70%;
  overflow-y: auto;
  margin: auto;
  /* align-items: stretch;
  flex-direction: column; */
`;

const SearchWrapper = styled.div`
  text-align: center;
  margin: 5% auto 3%;
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

const Inputsearch = styled.input`
  width: 100%;
  border-radius: 30px;
  box-shadow: 0 0 15px 7px rgba(255, 255, 255, 0.267);
  padding: 10px 90px 10px 20px;
`;

// const Titleh1 = styled.p`
//   padding: 10px;
//   font-size: 1.2rem;
// `;

const ButtonGroup = styled.div`
  border-radius: 10px;
  display: flex;
  justify-content: center;
`;

export default RoomList;
