import { useState } from 'react';
import { DesignedButton1 } from '../DesignedButton';
import { Modal } from '../Modal';

const Footer = () => {
  return (
    <footer
      style={{
        height: '80px',
        position: 'relative',
      }}
    ></footer>
  );
};

export const Footer1 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <footer
      style={{
        height: '80px',
        position: 'relative',
      }}
    >
      <Modal component={5} on={isModalOpen} event={setIsModalOpen}></Modal>
      <div
        style={{
          position: 'relative',
          height: '100%',
          lineHeight: '80px',
          textAlign: 'right',
        }}
      >
        <DesignedButton1
          style={{
            position: 'absolute',
            left: '10px',
            top: '20px',
            margin: '0',
            width: '190px',
            fontSize: '1em',
          }}
          onClick={() => {
            console.log(isModalOpen);
            setIsModalOpen(true);
          }}
          color="#a62df1"
        >
          테스트케이스 추가
        </DesignedButton1>
        <DesignedButton1
          style={{
            margin: '0',
            width: '190px',
            fontSize: '1em',
            marginRight: '10px',
          }}
          color="#a62df1"
        >
          테스트케이스 실행
        </DesignedButton1>
        <DesignedButton1
          style={{
            margin: '0',
            width: '190px',
            fontSize: '1em',
            marginRight: '10px',
          }}
          color="#a62df1"
        >
          제출하기
        </DesignedButton1>
      </div>
    </footer>
  );
};

export default Footer;
