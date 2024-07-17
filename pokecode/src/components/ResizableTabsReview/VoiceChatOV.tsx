import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { OpenVidu, Session, Publisher } from 'openvidu-browser';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
// import { useStore } from '../store';
// import io from 'socket.io-client';

const SERVER_URL = 'https://api.poke-code.com:1235';
// const SOCKETIO_SERVER_URL = 'http://192.168.1.18:3334'

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
      setIsJoined(false);
    }
  };

  const toggleMute = () => {
    if (publisher) {
      const newMuteState = !isMuted;
      publisher.publishAudio(!newMuteState);
      setIsMuted(newMuteState);
    }
  };

  return (
    <div className="VoiceChat">
      <h1>오픈비두</h1>
      <button onClick={joinSession}>음성채팅 참여하기</button>
      {session && <button onClick={leaveSession}>음성채팅 나가기</button>}
      <div id="audio-container"></div>
      {publisher && (
        <button onClick={toggleMute}>{isMuted ? 'Unmute' : 'Mute'}</button>
      )}
      <h3>참여 중인 사용자:</h3>
      <ul>
        {users.map((user) => (
          <li key={user.socketId}>
            {user.username} {user.isMuted ? '(Muted)' : ''}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VoiceChatOV;
