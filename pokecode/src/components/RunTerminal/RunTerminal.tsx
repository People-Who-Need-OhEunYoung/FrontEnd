import { useEffect, useState } from "react";



const RunTerminal = ({sequence}:any) => {

  // 한글자씩 글자를 추가할 빈문자열 변수 sequence를 선언합니다.
  const [inputsequence, setInputSequence] = useState <string>('');

  useEffect(() => {
    setInputSequence;(sequence)
  }, [sequence]);


  return (
    <>
      <pre
        style={{
          height: '100%',
          background: '#000',
          color: 'white',
          overflow: 'auto',
        }}
      >
        {inputsequence}
      </pre>
    </>
  );
};


export default RunTerminal;