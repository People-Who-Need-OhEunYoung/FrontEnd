import { useEffect, useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import io, { Socket } from 'socket.io-client';
import { setWrittenCode } from '../../store/problemSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { RootState } from '../../store';

interface Message {
  nick_name: any;
  message: any;
}

interface User {
  username: any;
}

interface ChatRoomProps {
  onUserChange: (users: any) => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ onUserChange }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<any>('');
  const [first, setFirst] = useState(false);
  const { user } = useSelector((state: RootState) => state.userinfo);
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

  useEffect(() => {
    setMessage('[notice]' + savedUsername + '님이 입장했습니다.');
    setFirst(true);
    sendMessage();
  }, [first]);

  useEffect(() => {
    if (!savedUsername || !savedRoomId) {
      alert('방정보 혹은 사용자정보가 없습니다. 다시 입장하세요1');
      navigate('/roomlist');
      return;
    }
    if (user.nick_name == '') {
      alert('방정보 혹은 사용자정보가 없습니다. 다시 입장하세요2');
      navigate('/roomlist');
      return;
    }

    const socket = io(import.meta.env.VITE_APP_ROOM, {
      transports: ['websocket'],
    });

    socketRef.current = socket;
    socket.on('connect', () => {
      console.log(`Connected to socket, joining room ${savedRoomId}`);
      socket.emit('CONNECTED_TO_ROOM', {
        room_id: savedRoomId,
        bakjoon_id: savedUserId,
        nick_name: savedUsername,
        cur_poke_id: savedPokeId,
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
    socket.on('USER:FORCED_OUT', (a) => {
      setMessage(`[notice]${a}님이 퇴장당했습니다.`);
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
    localStorage.removeItem('nickname');
    localStorage.removeItem('roomId');
  };

  //강퇴기능 추가 필요
  const forceOut = (nickname: string) => {
    const socket = socketRef.current;
    if (socket) {
      socket.emit('FORCE_OUT', {
        room_id: savedRoomId,
        nick_name: nickname,
      });

      //localStorage.removeItem('nickname');
      //localStorage.removeItem('roomId');
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
        <p style={{ position: 'absolute', left: '15px', fontSize: '1.2rem' }}>
          채팅
        </p>
        <p style={{ position: 'absolute', right: '20px', fontSize: '1rem' }}>
          접속중인 인원: <b> {users.length}</b>
        </p>
        <button
          onClick={() => {
            forceOut('우주최강다흰짱짱');
          }}
        >
          강퇴 테스트
        </button>
      </Header>
      <div
        style={{
          overflowY: 'scroll',
          height: '80%',
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
      <div style={{ height: '10%' }}>
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
            width: '80%',
            margin: '0',
            border: '1px solid #ccc',
            padding: '10px',
            boxSizing: 'border-box',
            resize: 'none',
          }}
        />
        <button
          style={{
            height: '100%',
            width: '20%',
            margin: '0',
            border: 'none',
            float: 'right',
          }}
          onClick={sendMessage}
        >
          보내기
        </button>
      </div>
    </div>
  );
};

const UserName = styled.strong`
  display: inline-block;
  padding: 5px;
  border-radius: 5px;
  margin: 0 10px;
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
`;

const MessageContainer = styled.div<{ isOwnMessage?: boolean }>`
  text-align: ${({ isOwnMessage }) => (isOwnMessage ? 'right' : 'left')};
  margin: 10px;
`;

const MessageBubble = styled.pre<{ isOwnMessage?: boolean }>`
  box-sizing: border-box;
  padding: 10px;
  background: ${({ isOwnMessage }) =>
    isOwnMessage
      ? 'linear-gradient(to right, #6295A2, #538392)'
      : 'linear-gradient(to right, #97b9b2, #80B9AD)'};
  display: inline-block;
  border-radius: 10px;
  margin: 0 10px;
  max-width: 300px;
  white-space: break-spaces;
  word-break: break-all;
  position: relative;
  color: ${({ isOwnMessage }) => (isOwnMessage ? 'white' : 'black')};

  &:after {
    content: '';
    position: absolute;
    bottom: 10px;
    left: ${({ isOwnMessage }) => (isOwnMessage ? 'auto' : '-10px')};
    right: ${({ isOwnMessage }) => (isOwnMessage ? '-10px' : 'auto')};
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-top-color: ${({ isOwnMessage }) =>
      isOwnMessage ? '#538392' : '#97b9b2'};
    border-bottom: 0;
    margin-top: -5px;
    /* transform: ${({ isOwnMessage }) =>
      isOwnMessage ? 'rotate(180deg)' : 'none'}; */
  }
`;

const Header = styled.div`
  height: 10%;
  color: #d3dde8;
  line-height: 20px;
  box-sizing: border-box;
  border-bottom: 2px solid white;
  width: 100%;
  display: flex;
  align-items: center;
  padding-left: 10px;
  position: relative;
`;

export default ChatRoom;
