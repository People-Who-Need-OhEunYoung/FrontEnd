import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, useDragControls } from 'framer-motion';
import { Pokemon } from '../../pages/UserMain/UserMain';
import { TestSharedEditor } from '../TestSharedEditor';
import { DesignedButton1 } from '../DesignedButton';
import { ProblemText } from '../ProblemText';
// 진욱이 소스 import { VoiceChat } from '../VoiceChat';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import ChatRoom from './ChatRoom';
import VoiceChatOV from './VoiceChatOV';
import { setRoomId, setUsername } from '../../store/roomdataSlice';
import { CodeAIWardBalloon } from '../CodeAIButton';
// import { Terminal } from '../Terminal';

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
  const { user } = useSelector((state: RootState) => state.userinfo);

  const [hoveredPokeId, setHoveredPokeId] = useState(null);

  const [contextMenus, setContextMenus] = useState<
    (ContextMenuPosition | null)[]
  >([null, null, null, null]);

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

  const handleKickOut = (index: number) => {
    alert(`객체 ${index + 1} 강퇴되었습니다.`);
    setContextMenus([null, null, null, null]);
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
  };

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
        ? usersInfo.map((userOne, key) => (
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
                  bottom="100px"
                  position="absolute"
                />
              ) : (
                ''
              )}
              {hoveredPokeId === userOne.cur_poke_id && (
                <div>
                  <div>구현:{userOne.impl_exp}</div>
                  <div>수학:{userOne.math_exp}</div>
                  <div>자료구조:{userOne.data_exp}</div>
                  <div>그래프:{userOne.graph_exp}</div>
                  <div>DP:{userOne.dp_exp}</div>
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
              ></Pokemon>
              {contextMenus[key] ? (
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
                    onClick={() => handleKickOut(key)}
                  >
                    강퇴
                  </li>
                </ul>
              ) : null}
              <NicknameBox>{userOne.nick_name}</NicknameBox>
            </motion.div>
          ))
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
            <ChatRoom onUserChange={handlePokemons} />
          </ChatRoomDiv>

          <div
            style={{
              width: '100%',
              height: '30%',
              overflow: 'auto',
            }}
          >
            <VoiceChatOV />
            {/* 진욱이 소스 <VoiceChat /> */}
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
  background-color: #282a3a;
  width: 100%;
  height: 70%;
  overflow: auto;
  background-size: cover;
`;

const NicknameBox = styled.p`
  transform: translateX(-10%);
  width: 120%;
  height: 10%;
  margin: 0 auto;
  overflow: hidden;
  color: white;
  background-color: #324056; /* 연보라색 배경 */
  opacity: 60%; /* 수정된 부분 */
  border-radius: 8px; /* 둥근 모서리 */
  text-align: center; /* 텍스트 중앙 정렬 */
  font-size: 14px; /* 글씨 크기 조정 */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* 약간의 그림자 추가 */
`;

export default ResizableTabsReview;
