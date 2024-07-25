import { useEffect, useRef } from 'react';

// 오디오 파일 경로를 동적으로 설정하기 위해 숫자를 기반으로 파일명을 생성합니다.
const generateAudioSrc = (index: number) => `/voice/${index}.ogg`;

const PokeAudioOne = ({ runButton, event }: any) => {
  // 30개의 오디오 참조를 저장하기 위한 배열
  const audioRefs = useRef<HTMLAudioElement | null>(null);

  // 일정 시간 동안 오디오를 재생하는 함수
  const playSoundForDuration = (index: number | null) => {
    if (index != null) {
      const audioElement = audioRefs.current;
      if (audioElement) {
        audioElement.volume = 0.4;
        audioElement.play();
      }
    }
  };

  useEffect(() => {
    if (runButton != null) {
      playSoundForDuration(runButton);
    }
  }, [event]);
  return (
    <div style={{ display: 'none' }}>
      <div>
        <audio ref={audioRefs} src={generateAudioSrc(runButton)} />
      </div>
    </div>
  );
};

export default PokeAudioOne;
