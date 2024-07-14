import { useRef, useState } from 'react';

const signalingServerDomain = 'wss://api.poke-code.com:8481';
const pcConfig = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

interface RemoteVideo {
  peerId: string;
  stream: MediaStream;
}

const VoiceChat = () => {
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
  let myId: string | null = null;

  const roomIdElem = useRef<HTMLInputElement>(null);
  const userIdElem = useRef<HTMLInputElement>(null);

  const startWebRTC = async () => {
    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream.current;
      }

      const roomId = roomIdElem.current?.value;
      console.log('들어갈 방번호:', roomId);
      const userId = userIdElem.current?.value;
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
    console.log('접속해제 감지');

    if (peers.current[sender].video) {
      setRemoteVideos((prevVideos) =>
        prevVideos.filter((video) => video.peerId !== sender)
      );
      delete peers.current[sender];
    }
  };

  return (
    <div className="App">
      <h1>WebRTC Multi-Peer Video Communication</h1>
      <video ref={localVideoRef} autoPlay muted className="local-video" />
      <br />
      <input ref={roomIdElem} placeholder="방번호" />
      <input ref={userIdElem} placeholder="사용자 아이디" />
      <button onClick={startWebRTC}>들어가기</button>
      <button onClick={quit}>나가기</button>
      {remoteVideos.map((video, index) => (
        <div key={index}>
          <h3>{video.peerId}</h3>
          <video
            ref={(elem) => {
              if (elem) {
                elem.srcObject = video.stream;
              }
            }}
            controls
            autoPlay
          />
        </div>
      ))}
    </div>
  );
};

export default VoiceChat;
