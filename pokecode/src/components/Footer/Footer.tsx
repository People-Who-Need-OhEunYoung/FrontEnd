import { useState } from 'react';
import { DesignedButton1 } from '../DesignedButton';
import { Modal } from '../Modal';

const css = {
  height: '80px',
};

const Footer = () => {
  return <footer style={css}></footer>;
};

export const Footer1 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <footer style={css}>
      <Modal on={isModalOpen}></Modal>
      <DesignedButton1 onClick={() => setIsModalOpen(true)} color="#a62df1">
        테스트케이스 추가
      </DesignedButton1>
      <DesignedButton1 color="#a62df1">테스트케이스 실행</DesignedButton1>
      <DesignedButton1 color="#a62df1">제출하기</DesignedButton1>
    </footer>
  );
};

export default Footer;
