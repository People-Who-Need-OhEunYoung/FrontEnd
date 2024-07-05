import styled from 'styled-components';


/* 모달 */
const Modal = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  width: 75%;
  height: 100%;
  margin: auto;
  text-align: center;
  color: white;
  background: #625787;
  border-radius: 50px;
  filter: drop-shadow(0px 6px 4px rgba(0, 0, 0, 0.25));
  @media (max-width: 550px) {
    width: 100vw;
  }
`;


export default Modal;