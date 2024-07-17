import { useEffect, useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import io, { Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

interface Message {
  username: any;
  message: any;
}

interface User {
  username: any;
}

const ChatRoom: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<any>('');
  const socketRef = useRef<Socket | null>(null);
  const navigate = useNavigate();

  const savedUsername: string | null = localStorage.getItem('username');
  const savedRoomId: string | null = localStorage.getItem('roomId');

  console.log('1---------------------------------' + savedUsername);
  console.log('2---------------------------------' + savedRoomId);

  useEffect(() => {
    if (!savedUsername || !savedRoomId) {
      alert('방정보 혹은 사용자정보가 없습니다. 다시 입장하세요');
      return;
    }

    const socket = io('https://api.poke-code.com:3334', {
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log(`Connected to socket, joining room ${savedRoomId}`);
      socket.emit('CONNECTED_TO_ROOM', {
        roomId: savedRoomId,
        username: savedUsername,
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
      console.log(`Leaving room ${savedRoomId}`);
      //socket.emit('DISCONNECT_FROM_ROOM', { roomId, username });
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
          roomId: savedRoomId,
          username: savedUsername,
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
      console.log(`Leaving room ${savedRoomId}`);
      socket.emit('DISCONNECT_FROM_ROOM', { savedRoomId, savedUsername }); // Request server to remove user info
      socket.off();
      setUsers([]);
      setMessages([]);
      setMessage('');
      localStorage.removeItem('username');
      localStorage.removeItem('roomId');
      navigate('roomlist');
    }
  };

  return (
    <>
      <h2>너의 이름은 {savedUsername}</h2>
      <h2>방 ID: {savedRoomId}</h2>
      <h2>
        방에 접속중인 사람 개수: <b>{users.length}</b>
      </h2>
      <button onClick={leaveRoom}>나가기</button>
      <div>
        <div
          style={{
            height: '300px',
            overflowY: 'scroll',
            border: '1px solid black',
          }}
        >
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.username}: </strong>
              {msg.message}
            </div>
          ))}
        </div>
        <input
          type="text"
          value={message}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setMessage(e.target.value)
          }
          onKeyPress={(e: KeyboardEvent<HTMLInputElement>) =>
            e.key === 'Enter' && sendMessage()
          }
        />
        <button onClick={sendMessage}>보내기</button>
      </div>
    </>
  );
};

export default ChatRoom;
