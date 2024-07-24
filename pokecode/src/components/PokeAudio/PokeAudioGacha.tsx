import { useEffect, useRef } from 'react';

const PokeAudioGacha = ({ runButton, event }: any) => {
  // 30개의 오디오 참조를 저장하기 위한 배열
  const audioRefs = useRef<HTMLAudioElement | null>(null);
  const audioRefs1 = useRef<HTMLAudioElement | null>(null);
  const audioRefs2 = useRef<HTMLAudioElement | null>(null);

  // 모든 오디오 요소를 멈추는 함수
  const stopAllSounds = () => {
    const audioElements = [
      audioRefs.current,
      audioRefs1.current,
      audioRefs2.current,
    ];
    audioElements.forEach((audio) => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  };

  // 특정 오디오 요소를 재생하는 함수
  const playSound = (audioElement: HTMLAudioElement | null) => {
    if (audioElement) {
      audioElement.play();
    }
  };

  useEffect(() => {
    stopAllSounds(); // 다른 모든 소리를 멈춤
    if (runButton == 1) {
      playSound(audioRefs.current);
    } else if (runButton == 2) {
      playSound(audioRefs1.current);
    } else if (runButton == 3) {
      playSound(audioRefs2.current);
    }
  }, [runButton, event]);

  return (
    <div style={{ display: 'none' }}>
      <div>
        <audio ref={audioRefs} src="/voice/gacha2.mp3" />
        <audio ref={audioRefs1} src="/voice/gacha4.mp3" />
        <audio ref={audioRefs2} src="/voice/pokecen.mp3" loop />
      </div>
    </div>
  );
};

export default PokeAudioGacha;
