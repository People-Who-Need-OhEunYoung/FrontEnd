import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { OpenVidu, Session, Publisher } from 'openvidu-browser';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import styled from 'styled-components';
import microphone from '../../assets/images/microphone3.png';
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
  }, [roomId, token]);

  const joinSession = async () => {
    console.log('세션 참가 요청');
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
      console.log('token:', response.data);

      const OV = new OpenVidu();
      const newSession = OV.initSession();
      setSession(newSession);
      console.log('Session:', newSession);

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

      // Handle the signal that a user has left
      newSession.on('signal:userLeft', (event) => {
        if (event.data && typeof event.data === 'string') {
          try {
            // Parse the data received from the signal
            const data = JSON.parse(event.data);
            // Ensure data has the correct structure
            if (data && typeof data.userName === 'string') {
              setUsers((prevUsers) =>
                prevUsers.filter((user) => user.username !== data.userName)
              );
            } else {
              console.error('Invalid data format:', data);
            }
          } catch (error) {
            console.error('Error parsing userLeft signal data:', error);
          }
        } else {
          console.error(
            'Received data is undefined or not a string:',
            event.data
          );
        }
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
      // Check if error is an instance of AxiosError
      if (axios.isAxiosError(error)) {
        // Axios error
        console.error('Axios error:', error.message);
        if (error.response) {
          // Server responded with a status code outside the 2xx range
          console.error('Response error:', error.response.data);
        } else if (error.request) {
          // Request was made but no response received
          console.error('Request error:', error.request);
        }
      } else if (error instanceof Error) {
        // General JS error
        console.error('General error:', error.message);
      } else {
        // Unknown error type
        console.error('An unknown error occurred');
      }
    }
  };

  const leaveSession = () => {
    if (session) {
      //user가 떠날때 시그널링
      session.signal({
        type: 'userLeft',
        data: JSON.stringify({ userName: username }),
      });

      session.disconnect();
      setSession(null);
      setPublisher(null);
      setUsers([]); // Clear the users array
      setIsMuted(false);
    }
    setIsJoined(false);
    setToken(''); // Clear the token
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
      {isJoined && session ? (
        <div style={{ height: 'calc(100% - 80px)', overflowY: 'auto' }}>
          <div id="audio-container" style={{ display: 'none' }}></div>
          <h3>현재 참여 중인 사용자: </h3>
          <ul style={{ color: 'black' }}>
            {users.map((user) => (
              <li key={user.socketId}>
                {user.username} {user.isMuted ? '(Muted)' : ''}
              </li>
            ))}
          </ul>
          <VoiceBtn onClick={leaveSession}>음성채팅종료</VoiceBtn>
        </div>
      ) : (
        <JoinBtnDiv>
          <JoinBtn onClick={joinSession}>
            <WavesContainer>
              <svg
                className="waves"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 24 150 28"
                preserveAspectRatio="none"
                shapeRendering="auto"
              >
                <defs>
                  <path
                    id="gentle-wave"
                    d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
                  />
                </defs>
                <g className="parallax">
                  <use
                    xlinkHref="#gentle-wave"
                    x="48"
                    y="0"
                    fill="rgba(132, 178, 239, 0.901)"
                  />
                  <use
                    xlinkHref="#gentle-wave"
                    x="48"
                    y="3"
                    fill="rgba(113, 165, 233, 0.711)"
                  />
                  <use
                    xlinkHref="#gentle-wave"
                    x="48"
                    y="5"
                    fill="rgba(56, 123, 210, 0.434)"
                  />
                  <use
                    xlinkHref="#gentle-wave"
                    x="48"
                    y="7"
                    fill="rgba(56, 123, 210, 0.668)"
                  />
                </g>
              </svg>
            </WavesContainer>
            <MicrophoneImg src={microphone}></MicrophoneImg>
          </JoinBtn>
        </JoinBtnDiv>
      )}
      {publisher && (
        <VoiceBtn onClick={toggleMute}>{isMuted ? 'Unmute' : 'Mute'}</VoiceBtn>
      )}
    </div>
  );
};

export default VoiceChatOV;

const VoiceBtn = styled.button`
  display: inline-block;
  background-color: #5f6275;
  color: white;
  font-size: 1.2em;
  font-weight: bold;
  position: relative;
  height: 40px;
  right: 0;
  width: 100%;
`;

const MicrophoneImg = styled.img`
  width: 50px;
  height: 50px;
  text-align: center;
  overflow: hidden;
  z-index: 100;
`;

const JoinBtn = styled.button`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: none;
  background-color: #fefefe34;
  color: white;
  font-size: 1.2em;
  font-weight: bold;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    background-color: #fefefe82;
    box-shadow: 0 0 10px 2px white;
  }

  & .waves {
    position: absolute;
    width: 100%;
    height: 40%;
    top: 60%;
    left: 0%;
  }

  & .parallax > use {
    animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.15, 0.5) infinite;
  }

  & .parallax > use:nth-child(1) {
    animation-delay: -2s;
    animation-duration: 2s;
  }

  & .parallax > use:nth-child(2) {
    animation-delay: -3s;
    animation-duration: 3s;
  }

  & .parallax > use:nth-child(3) {
    animation-delay: -4s;
    animation-duration: 4s;
  }

  & .parallax > use:nth-child(4) {
    animation-delay: -5s;
    animation-duration: 4s;
  }

  @keyframes move-forever {
    0% {
      transform: translate3d(-90px, 0, 0);
    }
    100% {
      transform: translate3d(85px, 0, 0);
    }
  }
`;

const JoinBtnDiv = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

const WavesContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  border-radius: 50%;
`;
