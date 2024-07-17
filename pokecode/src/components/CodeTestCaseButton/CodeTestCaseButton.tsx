import { useState } from 'react';
import { DesignedButton1 } from '../DesignedButton';
import { Modal } from '../Modal';

const CodeTestCaseButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <Modal component={5} on={isModalOpen} event={setIsModalOpen}></Modal>
      <DesignedButton1
        style={{
          margin: '0',
          width: '190px',
          fontSize: '1em',
          marginRight: '10px',
          position: 'absolute',
          left: '10px',
          top: '23px',
        }}
        onClick={() => {
          console.log(isModalOpen);
          setIsModalOpen(true);
        }}
        color="#a62df1"
      >
        테스트케이스 추가
      </DesignedButton1>
    </>
  );
};
export default CodeTestCaseButton;
