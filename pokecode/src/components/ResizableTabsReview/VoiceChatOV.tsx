import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { OpenVidu, Session, Publisher } from 'openvidu-browser';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
// import { useStore } from '../store';
// import io from 'socket.io-client';

const SERVER_URL = 'https://api.poke-code.com:1235';
//const SERVER_URL = 'http://192.168.1.18:3334';

interface User {
  username: string;
  socketId: string;
  isMuted: boolean;
}

const VoiceChatOV: React.FC = () => {
  const [sessionId, setSessionId] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [session, setSession] = useState<Session | null>(null);
  const [publisher, setPublisher] = useState<Publisher | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isJoined, setIsJoined] = useState<boolean>(false);

  console.log(token);

  const { username, roomId } = useSelector(
    (state: RootState) => state.roomdata
  );

  useEffect(() => {
    const createSession = async () => {
      try {
        const response = await axios.post(`${SERVER_URL}/api/sessions`, {
          customSessionId: roomId,
        });
        console.log('Session created with ID: ', response.data);
        setSessionId(response.data);
      } catch (error) {
        console.error('Error creating session:', error);
      }
    };
    if (roomId) {
      createSession();
    }
  }, [roomId]);

  const joinSession = async () => {
    if (isJoined) {
      console.log('이미 세션에 참가중입니다.');
      return;
    }

    try {
      const response = await axios.post(
        `${SERVER_URL}/api/sessions/${sessionId}/connections`,
        {}
      );
      setToken(response.data);
      console.log('Token received: ', response.data);

      const OV = new OpenVidu();
      const newSession = OV.initSession();
      setSession(newSession);

      newSession.on('streamCreated', (event) => {
        const subscriber = newSession.subscribe(
          event.stream,
          'audio-container'
        );

        setUsers((prevUsers) => [
          ...prevUsers,
          {
            username: JSON.parse(event.stream.connection.data).clientData,
            socketId: event.stream.connection.connectionId,
            isMuted: false,
          },
        ]);

        console.log('Subscriber added:', subscriber);
      });

      await newSession.connect(response.data, { clientData: username });

      const newPublisher = OV.initPublisher('audio-container', {
        audioSource: true,
        videoSource: false,
        publishAudio: !isMuted,
        publishVideo: false,
      });

      newSession.publish(newPublisher);
      setPublisher(newPublisher);
      setIsJoined(true);
    } catch (error) {
      console.error('Error joining session:', error);
    }
  };

  const leaveSession = () => {
    if (session) {
      session.disconnect();
      setSession(null);
      setPublisher(null);
      setUsers((prevUsers) => prevUsers.filter((u) => u.username !== username));
      setIsMuted(false);
    }
    setIsJoined(false);
  };

  const toggleMute = () => {
    if (publisher) {
      const newMuteState = !isMuted;
      publisher.publishAudio(!newMuteState);
      setIsMuted(newMuteState);
    }
  };

  return (
    <div className="VoiceChat" style={{ position: 'relative', height: '100%' }}>
      <div style={{ height: 'calc(100% - 80px)', overflowY: 'auto' }}>
        <div id="audio-container" style={{ display: 'none' }}></div>
        <h3 style={{ color: 'white' }}>참여 중인 사용자:</h3>
        <ul style={{ color: 'white' }}>
          {users.map((user) => (
            <li key={user.socketId}>
              {user.username} {user.isMuted ? '(Muted)' : ''}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            textAlign: 'center',
            width: '100%',
            display: 'inline-block',
          }}
        >
          {publisher && (
            <button
              style={{
                display: 'inline-block',
                background: '#5F6275',
                color: 'white',
                fontSize: '1.2em',
                fontWeight: 'bold',
                position: 'relative',
                height: '40px',
                right: 0,
                width: '100%',
              }}
              onClick={toggleMute}
            >
              {isMuted ? 'Unmute' : 'Mute'}
            </button>
          )}
          {isJoined ? (
            session && (
              <button
                onClick={leaveSession}
                style={{
                  display: 'inline-block',
                  background: '#5F6275',
                  color: 'white',
                  fontSize: '1.2em',
                  fontWeight: 'bold',
                  position: 'relative',
                  height: '40px',
                  right: 0,
                  width: '100%',
                }}
              >
                음성채팅종료
                <svg
                  style={{ width: '37px' }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                  fill="white"
                >
                  <path d="M228.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C76.1 30.2 64 46 64 64c0 107.4 37.8 206 100.8 283.1L9.2 469.1c-10.4 8.2-12.3 23.3-4.1 33.7s23.3 12.3 33.7 4.1l592-464c10.4-8.2 12.3-23.3 4.1-33.7s-23.3-12.3-33.7-4.1L253 278c-17.8-21.5-32.9-45.2-45-70.7L257.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96zm96.8 319l-91.3 72C310.7 476 407.1 512 512 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L368.7 368c-15-7.1-29.3-15.2-43-24.3z" />
                </svg>
              </button>
            )
          ) : (
            <button
              onClick={joinSession}
              style={{
                display: 'inline-block',
                background: '#5F6275',
                color: 'white',
                fontSize: '1.2em',
                fontWeight: 'bold',
                position: 'relative',
                height: '40px',
                right: 0,
                width: '100%',
              }}
            >
              음성채팅참여
              <svg
                style={{ width: '30px' }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                fill="white"
              >
                <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceChatOV;
