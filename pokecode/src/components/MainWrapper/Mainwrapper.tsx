import styled from 'styled-components';

/* 모달 */
const Modal = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center; // 자식 요소들을 세로 방향으로 중앙 정렬
  width: 75%;
  height: calc(100vh - 180px);
  margin: 0 auto;
  color: #ffffff;
  background: #111826;
  border-radius: 20px;
  filter: drop-shadow(0px 6px 4px rgba(0, 0, 0, 0.25));

  box-shadow: 0 0 10px 1px rgba(255, 255, 255, 0.267);
  @media (max-width: 750px) {
    width: 100vw;
  }
`;

export default Modal;
