import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, useDragControls } from 'framer-motion';
import { Pokemon } from '../../pages/UserMain/UserMain';
import { TestSharedEditor } from '../TestSharedEditor';
import { DesignedButton1 } from '../DesignedButton';
import { ProblemText } from '../ProblemText';
import { VoiceChat } from '../VoiceChat'; //진욱이 소스
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import ChatRoom from './ChatRoom';
import VoiceChatOV from './VoiceChatOV';
import { setRoomId, setUsername } from '../../store/roomdataSlice';
import { CodeAIWardBalloon } from '../CodeAIButton';
import EvolutionModal from '../EvolutionModal/EvolutionModal';
import { setUserArray } from '../../store/roomdataSlice';
import { Bar } from 'react-chartjs-2';

import { PokeAudioOne } from '../PokeAudio';

import { getRoomPeopleChecker } from '../../utils/api/api';

const Container = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  border: none;
  background-color: #111826;
`;

interface TabProps {
  width: number;
}

const Tab = styled.div<TabProps>`
  background-color: #111826;
  height: 100%;
  border-right: none;
  flex-basis: ${({ width }) => width}%;
  z-index: 100;
  padding: 10px;
  box-sizing: border-box;
`;

const Resizer = styled.div`
  opacity: 0;
  width: 10px;
  cursor: ew-resize;
  background-color: #00000089;
  transform: translateX(-50%);
  height: 100%;
  z-index: 9999;
  position: absolute;
  border-radius: 20px;
  transition: 0.5s;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -webkit-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  &:hover {
    opacity: 1;
  }
`;

interface ResizableTabsProps {
  id: string;
  title: string;
  editorRoom: string;
}

interface ContextMenuPosition {
  mouseX: number;
  mouseY: number;
}

const ResizableTabsReview: React.FC<ResizableTabsProps> = ({
  id,
  title,
}: any) => {
  const [width, setWidth] = useState<number>(30);
  const [width1, setWidth1] = useState<number>(30);
  const [tabWidth, setTabWidth] = useState(0); // Tab의 초기 너비 상태
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tabRef = useRef<HTMLDivElement | null>(null);
  const [usersInfo, setUsersInfo] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const { user } = useSelector((state: RootState) => state.userinfo);
  const [hoveredPokeId, setHoveredPokeId] = useState(null);

  const [contextMenus, setContextMenus] = useState<
    (ContextMenuPosition | null)[]
  >([null, null, null, null]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cry, setCry] = useState<boolean[]>([false, false, false, false]);
  const roomOwner = localStorage.getItem('roomOwner');

  const handleContextMenu = (event: MouseEvent, index: number) => {
    event.preventDefault();
    const newContextMenus = contextMenus.map((_, i) =>
      i === index
        ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
        : null
    );
    setContextMenus(newContextMenus);
  };

  const handleClickAway = () => {
    setContextMenus([null, null, null, null]);
  };

  const handleKickOut = (user: any) => {
    console.log(user);
    alert(`${user.nick_name} 강퇴되었습니다.`);
    setContextMenus([null, null, null, null]);
    setUserData(user.nick_name);
  };

  useEffect(() => {
    document.addEventListener('click', handleClickAway);

    return () => {
      document.removeEventListener('click', handleClickAway);
    };
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleClickAway);

    return () => {
      document.removeEventListener('click', handleClickAway);
    };
  }, []);

  const dispatch = useDispatch();

  const dragControls = useDragControls();
  const animationControls = useAnimation();

  const setIdData = localStorage.getItem('nick_name');
  const setRoomIdData = localStorage.getItem('roomId');

  if (setIdData != null) {
    dispatch(setUsername(setIdData));
  }
  if (setRoomIdData != null) {
    dispatch(setRoomId(setRoomIdData));
  }

  const handleDragEnd = () => {
    animationControls.start({
      x: 0,
      y: 0,
      transition: { duration: 0.5 }, // 이동하는 시간 설정 (예: 0.5초)
    });
  };

  const handleMouseDown = () => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown1 = () => {
    document.addEventListener('mousemove', handleMouseMove1);
    document.addEventListener('mouseup', handleMouseUp1);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.getBoundingClientRect().width;
      const newWidth =
        ((e.clientX - containerRef.current.getBoundingClientRect().left) /
          containerWidth) *
        100;
      setWidth(newWidth);
    }
  };
  const handleMouseMove1 = (e: MouseEvent) => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const newWidth =
        ((containerRect.right - e.clientX) / containerWidth) * 100;
      setWidth1(newWidth);
    }
  };
  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseUp1 = () => {
    document.removeEventListener('mousemove', handleMouseMove1);
    document.removeEventListener('mouseup', handleMouseUp1);
  };

  const handlePokemons = (users: any) => {
    setUsersInfo(users);
    const nicknames = users.map((user: any) => user.nick_name);
    dispatch(setUserArray(nicknames));
  };

  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const maxPeople = parseInt(params.get('max_people') || '4', 10);

  useEffect(() => {
    const tabElement = tabRef.current;
    if (tabElement) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const { width } = entry.contentRect;
          setTabWidth(width); // 너비 상태 업데이트
        }
      });
      console.log('tabWidth: ', tabWidth);
      resizeObserver.observe(tabElement); // 탭 요소 관찰 시작
      return () => resizeObserver.disconnect(); // 컴포넌트 언마운트 시 관찰 중단
    }
  }, [tabWidth]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      transition={{
        duration: 1,
      }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'relative', height: 'calc(100vh - 160px)' }}
    >
      {usersInfo !== null
        ? usersInfo.map((userOne, key) => {
            let myData;
            myData = [
              {
                label: '구현',
                value: userOne.impl_exp,
              },
              {
                label: '그래프',
                value: userOne.graph_exp,
              },
              {
                label: '자료구조',
                value: userOne.data_exp,
              },
              {
                label: '수학',
                value: userOne.math_exp,
              },
              {
                label: 'DP',
                value: userOne.dp_exp,
              },
            ];
            return (
              <motion.div
                drag
                dragControls={dragControls}
                animate={animationControls} // 애니메이션 컨트롤 적용
                style={{
                  position: 'fixed',
                  display: 'inline-block',
                  zIndex: 9999,
                  bottom: '90px',
                  left: `${30 + 10 * key}%`,
                  transform: 'translateX(0px) translateY(0px) translateZ(0px)',
                  transition: '0.1s',
                  textAlign: 'center',
                }}
                className="pokemon"
              >
                {userOne.nick_name == user.nick_name ? (
                  <CodeAIWardBalloon
                    width="300px"
                    left="-150px"
                    fontSize="1em"
                    padding="30px"
                    bottom="150px"
                    position="absolute"
                    maxHightSet=""
                    maxHightSet1=""
                  />
                ) : (
                  ''
                )}
                {hoveredPokeId === userOne.cur_poke_id && (
                  <div>
                    <BarGraph>
                      <Bar
                        data={{
                          labels: myData.map((data) => data.label),
                          datasets: [
                            {
                              label: 'Count',
                              data: myData.map((data) => data.value),
                              borderColor: '#6366F1', // 선 색
                              backgroundColor: '#38bff8ce ', // 막대 배경색
                              borderRadius: 7,
                            },
                          ],
                        }}
                        options={{
                          indexAxis: 'y',
                          scales: {
                            x: {
                              ticks: {
                                color: '#ffffff', // x축 눈금 색상
                                font: {
                                  size: 14, // x축 눈금 폰트 사이즈
                                },
                              },
                            },
                            y: {
                              ticks: {
                                color: '#ffffff', // y축 눈금 색상
                                font: {
                                  size: 14, // y축 눈금 폰트 사이즈
                                },
                              },
                            },
                          },
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                        }}
                      />
                    </BarGraph>
                  </div>
                )}
                <Pokemon
                  src={'/' + userOne.cur_poke_id + '.gif'}
                  onContextMenu={(e: any) => handleContextMenu(e, key)}
                  onMouseEnter={() => {
                    setHoveredPokeId(userOne.cur_poke_id);
                  }}
                  onMouseLeave={() => {
                    setHoveredPokeId(null);
                  }}
                  onClick={() => {
                    setCry(cry.map((item, i) => (i === key ? !item : item)));
                  }}
                ></Pokemon>
                {contextMenus[key] && roomOwner ? (
                  <ul
                    className="context-menu"
                    style={{
                      top: contextMenus[key].mouseY,
                      left: contextMenus[key].mouseX,
                      textAlign: 'center',
                    }}
                  >
                    <li
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '-40px',
                        transform: 'translateX(-50%)',
                        color: 'white',
                        borderRadius: '10px',
                        background: '#324056',
                        width: '50px',
                      }}
                      onClick={() => {
                        handleKickOut(userOne);
                      }}
                    >
                      강퇴
                    </li>
                  </ul>
                ) : null}

                <NicknameBox>{userOne.poke_title}</NicknameBox>
                <NicknameBox>{userOne.nick_name}</NicknameBox>
                <PokeAudioOne
                  runButton={userOne.cur_poke_id}
                  event={cry[key]}
                ></PokeAudioOne>
              </motion.div>
            );
          })
        : null}

      <Container ref={containerRef}>
        <Tab width={width}>
          <HeaderTxt>
            {id}번 {title}
          </HeaderTxt>
          <ProblemText
            id={id}
            isshowheader="false"
            size={'calc(100% - 80px)'}
            tabwidth={tabWidth}
          />
        </Tab>
        <Resizer onMouseDown={handleMouseDown} style={{ left: width + '%' }} />
        <div
          style={{
            width: 100 - width - width1 + '%',
            height: '100%',
          }}
        >
          <div style={{ width: '100%', height: '100%' }}>
            <TestSharedEditor />
          </div>
          <div style={{ position: 'relative' }}>
            <Home style={{ textAlign: 'center' }}>
              {/* 아마 이코드때문에 포켓몬 밑에 닉네임박스 길쭉해지고 난리날거임 */}
              <div
                style={{
                  width: '150px',
                  height: '30px',
                  lineHeight: '20px',
                  position: 'absolute',
                  bottom: '40px',
                  right: '30px',
                  margin: 0,
                }}
              >
                <button onClick={() => setIsModalOpen(true)}>
                  Evolve Pokemon
                </button>
                {isModalOpen && <EvolutionModal />}
                <button onClick={() => setIsModalOpen(false)}>Close</button>
              </div>
              {/* 아마 이코드때문에 포켓몬 밑에 닉네임박스 길쭉해지고 난리날거임 */}

              <DesignedButton1
                style={{
                  width: '150px',
                  height: '30px',
                  lineHeight: '20px',
                  position: 'absolute',
                  bottom: '10px',
                  right: '30px',
                  margin: 0,
                }}
                onClick={handleDragEnd}
              >
                원 위치로
              </DesignedButton1>
            </Home>
          </div>
        </div>
        <Resizer
          onMouseDown={handleMouseDown1}
          style={{ left: 100 - width1 + '%' }}
        />
        <Tab width={width1}>
          <ChatRoomDiv>
            <ChatRoom
              onUserChange={handlePokemons}
              kickOut={userData}
              kickOutReset={setUserData}
            />
          </ChatRoomDiv>

          <div
            style={{
              width: '100%',
              height: '30%',
              overflow: 'auto',
            }}
          >
            {maxPeople == 4 && <VoiceChatOV />}
            {(maxPeople == 2 || maxPeople == 3) && <VoiceChat />}{' '}
            {/*진욱이 소스*/}
          </div>
        </Tab>
      </Container>
    </motion.div>
  );
};

const HeaderTxt = styled.p`
  height: 80px;
  box-sizing: border-box;
  display: flex;
  line-height: 60px;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  border-bottom: 2px solid gray;
  padding: 10px;
  padding-left: 5%;
`;

const Home = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  background-color: #282a36;
`;

const ChatRoomDiv = styled.div`
  background-color: #1c2637;
  width: 100%;
  height: 70%;
  overflow: auto;
  background-size: cover;
  border-radius: 10px;
`;

const NicknameBox = styled.p`
  width: 120%;
  height: 10%;
  margin: 0 auto;
  overflow: hidden;
  color: white;
  background-color: #324056; /* 연보라색 배경 */
  opacity: 0.8; /* 수정된 부분 */
  border-radius: 8px; /* 둥근 모서리 */
  text-align: center; /* 텍스트 중앙 정렬 */
  font-size: 20px; /* 글씨 크기 조정 */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* 약간의 그림자 추가 */
`;

//막대 그래프
const BarGraph = styled.div`
  position: absolute;
  top: -250px; /* 그래프를 포켓몬 위로 이동시키기 위해 설정 */
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 200px;
  background-color: #1c1c1e; /* 배경색 설정 */
  border-radius: 10px; /* 둥근 모서리 설정 */
  padding: 10px; /* 패딩 설정 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 그림자 설정 */
`;

export default ResizableTabsReview;
