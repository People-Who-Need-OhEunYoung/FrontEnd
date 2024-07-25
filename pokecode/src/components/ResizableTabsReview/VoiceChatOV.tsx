import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { OpenVidu, Session, Publisher } from 'openvidu-browser';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import styled from 'styled-components';
import microphone from '../../assets/images/microphone3.png';
import exit from '../../assets/images/exit.png';
import MicOn from '../../assets/images/Mic.png';
import MicOff from '../../assets/images/Micoff.png';

const SERVER_URL = 'https://api.poke-code.com:1235';

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
  //GPT 해결
  const handleBeforeUnload = () => {
    leaveSession();
  };
  //GPT 해결
  window.addEventListener('beforeunload', handleBeforeUnload);

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

    return () => {
      //if (isJoined && session && publisher) {
      console.log('세션참가중');
      leaveSession();
      //}
    };
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
            const data = JSON.parse(event.data);
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
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.message);
        if (error.response) {
          console.error('Response error:', error.response.data);
        } else if (error.request) {
          console.error('Request error:', error.request);
        }
      } else if (error instanceof Error) {
        console.error('General error:', error.message);
      } else {
        console.error('An unknown error occurred');
      }
    }
  };

  const leaveSession = () => {
    if (session) {
      session
        .signal({
          type: 'userLeft',
          data: JSON.stringify({ userName: username }),
        })
        .then(() => {
          session.disconnect();
          setSession(null);
          setPublisher(null);
          setUsers([]);
          setIsMuted(false);
          setIsJoined(false);
          setToken('');
        })
        .catch((error) => {
          console.error('Failed to send signal:', error);
          session.disconnect();
          setSession(null);
          setPublisher(null);
          setUsers([]);
          setIsMuted(false);
          setIsJoined(false);
          setToken('');
        });
    }
  };

  const toggleMute = () => {
    if (publisher) {
      const newMuteState = !isMuted;
      publisher.publishAudio(!newMuteState);
      setIsMuted(newMuteState);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.username === username ? { ...user, isMuted: newMuteState } : user
        )
      );
    }
  };

  return (
    <div className="VoiceChat" style={{ position: 'relative', height: '100%' }}>
      {isJoined && publisher ? (
        <div
          style={{
            height: 'calc(100% - 80px)',
            overflowY: 'auto',
            width: '100%',
          }}
        >
          <div id="audio-container" style={{ display: 'none' }}></div>
          <VoiceChatInfo>
            <VoicechatTxt>현재 참여 중인 사용자 </VoicechatTxt>
            <BtnGroup>
              <VoiceBtn
                onClick={toggleMute}
                style={{
                  backgroundImage: `url(${isMuted ? MicOff : MicOn})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  backgroundSize: '80%',
                  backgroundColor: 'rgb(204, 201, 244)',
                }}
              ></VoiceBtn>
              <VoiceBtn
                style={{
                  backgroundImage: `url(${exit})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  backgroundSize: '80%',
                  backgroundColor: 'rgb(204, 201, 244)',
                }}
                onClick={leaveSession}
              ></VoiceBtn>
            </BtnGroup>
          </VoiceChatInfo>
          <ul style={{ color: 'black' }}>
            {users.map((user) => {
              return (
                <li key={user.socketId}>
                  <VoiceChatNickname
                    style={{
                      backgroundColor: '#64aaf68e',
                    }}
                  >
                    {user.username} {user.isMuted ? '(Muted)' : ''}
                  </VoiceChatNickname>
                </li>
              );
            })}
          </ul>
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
    </div>
  );
};

export default VoiceChatOV;

const BtnGroup = styled.div`
  position: absolute;
  right: 0;
`;

const VoiceChatNickname = styled.div`
  display: flex;
  width: 50%;
  margin: 10px 30px;
  border-radius: 30px 30px 0 30px;
  justify-content: center;
  font-size: 1.2rem;
  color: #ffffff;
`;

const VoicechatTxt = styled.div`
  display: flex;
  width: 40%;
  margin: 10px;
  justify-content: center;
  background-color: #d3dde873;
  text-align: center;
  font-size: 1rem;
  border-radius: 30px;
  font-weight: bold;
  line-height: 30px;
  color: #ffffff;
`;

const VoiceChatInfo = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  height: 50px;
`;

const VoiceBtn = styled.button`
  display: inline-block;
  color: white;
  font-size: 1.2em;
  font-weight: bold;
  height: 40px;
  width: 40px;
  margin: 10px;
  background-color: white;
  border-radius: 50%;
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
