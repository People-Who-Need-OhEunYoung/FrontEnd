import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import styled from 'styled-components';

const signalingServerDomain = 'wss://api.poke-code.com:8481';
//const signalingServerDomain = 'wss://3.38.59.126:3000';
const pcConfig = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

interface RemoteVideo {
  peerId: string;
  stream: MediaStream;
}

const VoiceChat = ({ room = 1000 }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [remoteVideos, setRemoteVideos] = useState<RemoteVideo[]>([]);
  const localStream = useRef<MediaStream | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const peers = useRef<{
    [key: string]: {
      pc: RTCPeerConnection;
      video: boolean;
      iceCandidates: RTCIceCandidate[];
    };
  }>({});
  const { userNickname } = useSelector((state: RootState) => state.userinfo);
  const { pokemonId } = useSelector((state: RootState) => state.userinfo);

  let myId: string | null = null;

  const roomIdElem = room;
  const userIdElem = userNickname;

  const startWebRTC = async () => {
    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream.current;
      }

      const roomId = roomIdElem;
      console.log('들어갈 방번호:', roomId);
      const userId = userIdElem;
      console.log('들어갈 방번호:', userId);
      const signalingServerUrl = `${signalingServerDomain}?roomId=${roomId}&userId=${userId}`;

      ws.current = new WebSocket(signalingServerUrl);

      ws.current.onmessage = async (message) => {
        const data = JSON.parse(message.data);
        switch (data.type) {
          case 'id':
            myId = data.id;
            console.log('내 아이디:', myId);
            ws.current?.send(JSON.stringify({ type: 'join', sender: myId }));
            break;
          case 'offer':
            await handleOffer(data.offer, data.sender);
            break;
          case 'answer':
            await handleAnswer(data.answer, data.sender);
            break;
          case 'candidate':
            handleCandidate(data.candidate, data.sender);
            break;
          case 'new-peer':
            await handleNewPeer(data.sender);
            break;
          case 'disconnect':
            await handleDisconnect(data.sender);
            break;
          default:
            console.error('Unknown message type:', data.type);
            break;
        }
      };
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const quit = () => {
    ws.current?.close();
    localStream.current?.getTracks().forEach((track) => track.stop());
    setRemoteVideos([]);
  };

  const createPeerConnection = (partner: string): RTCPeerConnection => {
    const pc = new RTCPeerConnection(pcConfig);
    peers.current[partner] = { pc, video: false, iceCandidates: [] };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        ws.current?.send(
          JSON.stringify({
            type: 'candidate',
            candidate: event.candidate,
            sender: myId,
            receiver: partner,
          })
        );
      }
    };

    pc.ontrack = (event) => {
      if (!peers.current[partner].video) {
        setRemoteVideos((prevVideos) => [
          ...prevVideos,
          { peerId: partner, stream: event.streams[0] },
        ]);
        peers.current[partner].video = true;
      }
    };

    localStream.current
      ?.getTracks()
      .forEach((track) => pc.addTrack(track, localStream.current!));

    return pc;
  };

  const handleOffer = async (
    offer: RTCSessionDescriptionInit,
    sender: string
  ) => {
    const pc = createPeerConnection(sender);

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      peers.current[sender].iceCandidates.forEach((candidate) =>
        pc.addIceCandidate(candidate)
      );
      peers.current[sender].iceCandidates = [];

      ws.current?.send(
        JSON.stringify({
          type: 'answer',
          answer: pc.localDescription,
          sender: myId,
          receiver: sender,
        })
      );
    } catch (error) {
      console.error('Failed to handle offer:', error);
    }
  };

  const handleAnswer = async (
    answer: RTCSessionDescriptionInit,
    sender: string
  ) => {
    const pc = peers.current[sender].pc;
    try {
      console.log(
        `Setting remote description for ${sender}, current signaling state: ${pc.signalingState}`
      );
      if (
        pc.signalingState === 'have-remote-offer' ||
        pc.signalingState === 'have-local-offer'
      ) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        console.log(
          `Remote description set for ${sender}, new signaling state: ${pc.signalingState}`
        );

        peers.current[sender].iceCandidates.forEach((candidate) =>
          pc.addIceCandidate(candidate)
        );
        peers.current[sender].iceCandidates = [];
      } else {
        console.warn('Unexpected signaling state:', pc.signalingState);
      }
    } catch (error) {
      console.error('Failed to handle answer:', error);
    }
  };

  const handleCandidate = (candidate: RTCIceCandidateInit, sender: string) => {
    const pc = peers.current[sender].pc;
    if (pc.remoteDescription && pc.remoteDescription.type) {
      pc.addIceCandidate(new RTCIceCandidate(candidate));
    } else {
      peers.current[sender].iceCandidates.push(new RTCIceCandidate(candidate));
    }
  };

  const handleNewPeer = async (newPeerId: string) => {
    const pc = createPeerConnection(newPeerId);

    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      ws.current?.send(
        JSON.stringify({
          type: 'offer',
          offer: pc.localDescription,
          receiver: newPeerId,
          sender: myId,
        })
      );
    } catch (error) {
      console.error('Failed to handle new peer:', error);
    }
  };

  const handleDisconnect = async (sender: string) => {
    console.log('접속해제 감지 : ', sender);

    if (peers.current[sender].video) {
      setRemoteVideos((prevVideos) =>
        prevVideos.filter((video) => video.peerId !== sender)
      );
      delete peers.current[sender];
    }
  };

  return (
    <>
      <AudioWrap className="">
        <div style={{ display: 'flex' }}>
          <img
            style={{ background: 'white', borderRadius: '50%' }}
            width={'50'}
            height={'50'}
            src={'/dw/' + pokemonId + '.svg'}
            alt=""
          />
          <p
            style={{
              width: '180px',
              height: '50px',
              margin: '0 0 0 10px',
              lineHeight: '50px',
              color: 'white',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {userNickname}
          </p>
          <audio ref={localVideoRef} autoPlay className="local-video" />
          <button
            onClick={startWebRTC}
            style={{ padding: '0 3px', cursor: 'pointer' }}
          >
            <svg
              style={{ width: '30px' }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
            </svg>
          </button>
          <button
            onClick={quit}
            style={{ margin: '0 10px', cursor: 'pointer' }}
          >
            <svg
              style={{ width: '37px' }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 512"
            >
              <path d="M228.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C76.1 30.2 64 46 64 64c0 107.4 37.8 206 100.8 283.1L9.2 469.1c-10.4 8.2-12.3 23.3-4.1 33.7s23.3 12.3 33.7 4.1l592-464c10.4-8.2 12.3-23.3 4.1-33.7s-23.3-12.3-33.7-4.1L253 278c-17.8-21.5-32.9-45.2-45-70.7L257.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96zm96.8 319l-91.3 72C310.7 476 407.1 512 512 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L368.7 368c-15-7.1-29.3-15.2-43-24.3z" />
            </svg>
          </button>
        </div>
      </AudioWrap>
      {remoteVideos.map((video, index) => (
        <AudioWrap className="">
          <div key={index} style={{ display: 'flex' }}>
            <img
              style={{ background: 'white', borderRadius: '50%' }}
              width={'50'}
              height={'50'}
              src={'/dw/' + pokemonId + '.svg'}
              alt=""
            />
            <p
              style={{
                width: '180px',
                height: '50px',
                margin: '0 0 0 10px',
                lineHeight: '50px',
                color: 'white',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
            >
              {video.peerId}
            </p>
            <audio
              ref={(elem) => {
                if (elem) {
                  elem.srcObject = video.stream;
                }
              }}
              autoPlay
            />
            <button
              onClick={startWebRTC}
              style={{ padding: '0 3px', cursor: 'pointer' }}
            >
              <svg
                style={{ width: '30px' }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
              </svg>
            </button>
            <button
              onClick={quit}
              style={{ margin: '0 10px', cursor: 'pointer' }}
            >
              <svg
                style={{ width: '37px' }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
              >
                <path d="M228.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C76.1 30.2 64 46 64 64c0 107.4 37.8 206 100.8 283.1L9.2 469.1c-10.4 8.2-12.3 23.3-4.1 33.7s23.3 12.3 33.7 4.1l592-464c10.4-8.2 12.3-23.3 4.1-33.7s-23.3-12.3-33.7-4.1L253 278c-17.8-21.5-32.9-45.2-45-70.7L257.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96zm96.8 319l-91.3 72C310.7 476 407.1 512 512 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L368.7 368c-15-7.1-29.3-15.2-43-24.3z" />
              </svg>
            </button>
          </div>
        </AudioWrap>
      ))}
      ;
    </>
  );
};

const AudioWrap = styled.div`
  width: 100%;
  height: 50px;
`;

export default VoiceChat;
