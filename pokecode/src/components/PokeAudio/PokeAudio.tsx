import { useEffect, useRef } from 'react';

// 오디오 파일 경로를 동적으로 설정하기 위해 숫자를 기반으로 파일명을 생성합니다.
const generateAudioSrc = (index: number) => `/voice/${index}.ogg`;
const pokeSound = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 25, 26, 145, 146, 150, 151, 172, 243, 244, 245,
  250, 251, 280, 281, 282, 382, 488, 490, 492, 640, 644,
];
const PokeAudio = ({ runButton, durationSec }: any) => {
  // 30개의 오디오 참조를 저장하기 위한 배열
  const audioRefs = useRef<HTMLAudioElement[]>([]);

  // 일정 시간 동안 오디오를 재생하는 함수
  const playSoundForDuration = (
    index: number | null,
    duration: number | null
  ) => {
    if (index != null && duration != null) {
      const audioElement = audioRefs.current[index];
      if (audioElement) {
        audioElement.volume = 0.5;
        audioElement.play();

        // duration 시간 후에 오디오를 멈춤
        setTimeout(() => {
          if (audioElement) {
            audioElement.pause();
            audioElement.currentTime = 0; // 오디오를 처음으로 되돌림
          }
        }, duration);
      }
    }
  };

  useEffect(() => {
    if (runButton != null) {
      playSoundForDuration(pokeSound.indexOf(runButton), durationSec);
    }
  }, [runButton]);
  return (
    <div style={{ display: 'none' }}>
      {pokeSound.map((number, index) => (
        <div key={index}>
          <button onClick={() => playSoundForDuration(index, durationSec)}>
            소리 {index + 1} 재생 (3초)
          </button>
          <audio
            ref={(el) => (audioRefs.current[index] = el!)}
            src={generateAudioSrc(number)}
          />
        </div>
      ))}
    </div>
  );
};

export default PokeAudio;
