import { useEffect, useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import io, { Socket } from 'socket.io-client';
import { setWrittenCode } from '../../store/problemSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

interface Message {
  nick_name: any;
  message: any;
}

interface User {
  username: any;
}

const ChatRoom: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<any>('');
  const [first, setFirst] = useState(false);
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

  const savedUsername: string | null = localStorage.getItem('nickname');
  const savedRoomId: string | null = localStorage.getItem('roomId');
  const savedPokeId: string | null = localStorage.getItem('cur_poke_id');
  const savedUserId: string | null = localStorage.getItem('user_id');

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
      alert('방정보 혹은 사용자정보가 없습니다. 다시 입장하세요');
      navigate('/roomlist');
      return;
    }

    //const socket = io('https://api.poke-code.com:3334', {
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
    });

    socket.on('ROOM:MESSAGES', (messages: Message[]) => {
      setMessages(messages);
    });

    socket.on('MESSAGE', (message: Message) => {
      console.log(`Received message in room ${savedRoomId}:`, message);
      setMessages((prevMessages) => [...prevMessages, message]);
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
        roomId: savedRoomId,
        username: savedUsername,
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
      localStorage.removeItem('username');
      localStorage.removeItem('roomId');
    }
  };

  return (
    <div style={{ overflow: 'hidden', height: '100%' }}>
      {/* <h2>너의 이름은 {savedUsername}</h2>
      <h2>방 ID: {savedRoomId}</h2>
      <h2>
      방에 접속중인 사람 개수: <b>{users.length}</b>
      </h2>
      <button onClick={leaveRoom}>나가기</button> */}

      <div
        style={{
          height: '8%',
          color: 'white',
          lineHeight: '20px',
          boxSizing: 'border-box',
          backgroundColor: '#111826',
          width: '100%',
          display:'flex',
          alignItems:'center'
          
        }}
      >

        방에 접속중인 인원: <b>{users.length}</b>
      </div>
      <div
        style={{
          overflowY: 'scroll',
          height: '70%',
        }}
      >
        {messages.map((msg, index) =>
          msg.message.includes('[notice]') ? (
            <h2
              key={index}
              style={{
                background: 'white',
                textAlign: 'center',
                borderRadius: '10px',
                boxSizing: 'border-box',
                margin: '10px',
                padding: '10px',
              }}
            >
              {msg.message.replace('[notice]', '')}
            </h2>
          ) : msg.nick_name == savedUsername ? (
            <div style={{ textAlign: 'right' }}>
              <br />
              <pre
                style={{
                  boxSizing: 'border-box',
                  padding: '10px',
                  background: 'yellow',
                  display: 'inline-block',
                  borderRadius: '5px',
                  margin: '0 10px',
                  maxWidth: '300px',
                  whiteSpace: 'break-spaces',
                  wordBreak: 'break-all',
                }}
                key={index}
              >
                {msg.message}
              </pre>
            </div>
          ) : (
            <div>
              <strong
                style={{
                  display: 'inline-block',
                  background: 'white',
                  padding: '5px',
                  borderRadius: '5px',
                  margin: '0 10px',
                }}
              >
                {msg.nick_name}
              </strong>
              <br />
              <pre
                style={{
                  boxSizing: 'border-box',
                  padding: '10px',
                  background: 'white',
                  display: 'inline-block',
                  borderRadius: '5px',
                  margin: '10px',
                  maxWidth: '300px',
                  whiteSpace: 'break-spaces',
                  wordBreak: 'break-all',
                }}
                key={index}
              >
                {msg.message}
              </pre>
            </div>
          )
        )}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ height: '15%' }}>
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

export default ChatRoom;
