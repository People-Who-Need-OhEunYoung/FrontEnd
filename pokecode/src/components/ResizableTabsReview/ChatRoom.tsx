import { useEffect, useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import io, { Socket } from 'socket.io-client';
import { setWrittenCode } from '../../store/problemSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { getRoomPeopleChecker } from '../../utils/api/api';

interface Message {
  nick_name: any;
  message: any;
}

interface User {
  username: any;
}

interface ChatRoomProps {
  onUserChange: (users: any) => void;
  kickOut: any;
  kickOutReset: (set: boolean | null) => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({
  onUserChange,
  kickOut,
  kickOutReset,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<any>('');
  //진화 로직 테스트
  //const { user } = useSelector((state: RootState) => state.userinfo);
  const dispatch = useDispatch();
  const socketRef = useRef<Socket | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const navigate = useNavigate();
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    if (kickOut != null) forceOut(kickOut);
    kickOutReset(null);
  }, [kickOut, users.length]);

  const savedUsername: string | null = localStorage.getItem('nick_name');
  const savedRoomId: string | null = localStorage.getItem('roomId');
  const savedPokeId: string | null = localStorage.getItem('cur_poke_id');
  const savedUserId: string | null = localStorage.getItem('bakjoon_id');

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const userChecker = async () => {
    let counter = await getRoomPeopleChecker(savedRoomId);
    console.log('-------------------유저인원', counter);
    if (counter.count == 0) {
      alert('사용자정보가 없습니다. 다시 입장하세요');
      navigate('/roomlist');
      return;
    }
  };
  //진화 로직 테스트
  // useEffect(() => {
  //   onUserChange(users);
  // }, [user]);

  useEffect(() => {
    if (!savedUsername || !savedRoomId) {
      alert('방정보 혹은 사용자정보가 없습니다. 다시 입장하세요');
      navigate('/roomlist');
      return;
    }

    setTimeout(() => {
      userChecker();
    }, 500);

    const socket = io(import.meta.env.VITE_APP_ROOM, {
      transports: ['websocket'],
    });

    socketRef.current = socket;

    window.addEventListener('beforeunload', () => {
      const leaveMessage = `[notice]${savedUsername}님이 퇴장했습니다.`;
      socket.emit('SEND_MESSAGE', {
        room_id: savedRoomId,
        nick_name: savedUsername,
        message: leaveMessage,
      });
    });

    socket.on('connect', () => {
      console.log(`Connected to socket, joining room ${savedRoomId}`);
      socket.emit('CONNECTED_TO_ROOM', {
        room_id: savedRoomId,
        bakjoon_id: savedUserId,
        nick_name: savedUsername,
        cur_poke_id: savedPokeId,
      });
      console.log(`Disconnected from socket, leaving room ${savedRoomId}`);
      const leaveMessage = `[notice]${savedUsername}님이 입장했습니다.`;
      socket.emit('SEND_MESSAGE', {
        room_id: savedRoomId,
        nick_name: savedUsername,
        message: leaveMessage,
      });
    });

    socket.on('disconnect', () => {
      console.log(`Disconnected from socket, leaving room ${savedRoomId}`);
    });

    socket.on('ROOM:CONNECTION', (users: User[]) => {
      console.log(`Users in room ${savedRoomId}:`, users);
      setUsers(users);
      onUserChange(users);
    });

    socket.on('ROOM:MESSAGES', (messages: Message[]) => {
      setMessages(messages);
    });

    socket.on('MESSAGE', (message: Message) => {
      console.log(`Received message in room ${savedRoomId}:`, message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    //강퇴기능 추가 필요
    socket.on('USER:FORCED_OUT', () => {
      alert('강제퇴장 당했습니다.');
      navigate('/roomlist');
    });

    return () => {
      dispatch(setWrittenCode(''));
      console.log(`Leaving room ${savedRoomId}`);
      leaveRoom();
      socket.off();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== '') {
      const socket = socketRef.current;
      if (socket) {
        console.log(`Sending message: ${message}`);
        socket.emit('SEND_MESSAGE', {
          room_id: savedRoomId,
          nick_name: savedUsername,
          message: message,
        });
        console.log(savedRoomId);
        console.log(savedUsername);
        setMessage('');
      }
    }
  };

  const leaveRoom = () => {
    const socket = socketRef.current;
    if (socket) {
      const leaveMessage = `[notice]${savedUsername}님이 퇴장했습니다.`;
      socket.emit('SEND_MESSAGE', {
        room_id: savedRoomId,
        nick_name: savedUsername,
        message: leaveMessage,
      });

      socket.emit('DISCONNECT_FROM_ROOM', {
        room_id: savedRoomId,
        nick_name: savedUsername,
      });

      socket.off();
      setUsers([]);
      setMessages([]);
      setMessage('');
    }
    if (users.length === 0) localStorage.removeItem('roomId');
  };

  //강퇴기능 추가 필요
  const forceOut = (nick_name: string) => {
    const socket = socketRef.current;
    if (socket) {
      console.log(nick_name);
      socket.emit('FORCE_OUT', {
        room_id: savedRoomId,
        nick_name: nick_name,
      });

      const leaveMessage = `[notice]${nick_name}님이 강퇴당했습니다.`;
      socket.emit('SEND_MESSAGE', {
        room_id: savedRoomId,
        nick_name: savedUsername,
        message: leaveMessage,
      });
    }
  };

  return (
    <div
      style={{
        overflow: 'hidden',
        height: '100%',
        borderRadius: '10px',
        boxSizing: 'border-box',
      }}
    >
      <Header>
        <p style={{ position: 'absolute', left: '15px', fontSize: '1.5rem' }}>
          채팅
        </p>
        <p style={{ position: 'absolute', right: '20px', fontSize: '1.2rem' }}>
          접속중인 인원: <b> {users.length}</b>
        </p>
      </Header>
      <div
        style={{
          overflowY: 'scroll',
          height: '75%',
        }}
      >
        {messages.map((msg, index) =>
          msg.message.includes('[notice]') ? (
            <NoticeMessage key={index}>
              {msg.message.replace('[notice]', '')}
            </NoticeMessage>
          ) : msg.nick_name == savedUsername ? (
            <MessageContainer key={index} isOwnMessage>
              <MessageBubble isOwnMessage={true}>{msg.message}</MessageBubble>
            </MessageContainer>
          ) : (
            <MessageContainer key={index}>
              <UserName>{msg.nick_name}</UserName>
              <MessageBubble isOwnMessage={false}>{msg.message}</MessageBubble>
            </MessageContainer>
          )
        )}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ height: '15%', boxSizing: 'border-box', padding:'15px' }}>
        <textarea
          value={message}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setMessage(e.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요..."
          rows={2}
          style={{
            height: '100%',
            width: '72%',
            border: 'none',
            borderRadius: '10px',
            padding: '10px',
            boxSizing: 'border-box',
            resize: 'none',
            overflow: 'hidden'
          }}
        />
        <SendBtn onClick={sendMessage}>보내기</SendBtn>
      </div>
    </div>
  );
};

const SendBtn = styled.button`
  height: 100%;
  width: 25%;
  border: none;
  float: right;
  font-size: 1.2rem;
  background-color: #6365f19f;
  color: white;
  font-weight: bold;
  border-radius: 10px;
`;

const UserName = styled.strong`
  display: inline-block;
  padding: 5px;
  border-radius: 5px;
  margin: 0 10px 5px 10px; /* Add bottom margin to create space between nickname and message bubble */
  color: #d3dde8;
`;

const NoticeMessage = styled.p`
  background: #ffffff1d;
  width: 70%;
  text-align: center;
  color: white;
  border-radius: 30px;
  box-sizing: border-box;
  margin: 40px auto;
  padding: 5px;
  font-size: 1.3rem;
`;

const MessageContainer = styled.div<{ isOwnMessage?: boolean }>`
  text-align: ${({ isOwnMessage }) => (isOwnMessage ? 'right' : 'left')};
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items: ${({ isOwnMessage }) =>
    isOwnMessage ? 'flex-end' : 'flex-start'};
`;

const MessageBubble = styled.pre<{ isOwnMessage?: boolean }>`
  box-sizing: border-box;
  padding: 10px 20px;
  background: ${({ isOwnMessage }) =>
    isOwnMessage ? '#9fa1fb78' : '#64aaf68e'};
  display: inline-block;
  border-radius: 30px 30px 0 30px;
  margin: 0 10px;
  max-width: 300px;
  white-space: break-spaces;
  word-break: break-all;
  position: relative;
  color: white;
  border-radius: ${({ isOwnMessage }) =>
    isOwnMessage ? '30px 30px 0 30px' : '30px 30px 30px 0'};
  font-size: 1.3rem;
`;

const Header = styled.div`
  height: 10%;
  color: #d3dde8;
  line-height: 40px;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  align-items: center;
  padding-left: 10px;
  position: relative;
  background-color: #111826;
`;

export default ChatRoom;
