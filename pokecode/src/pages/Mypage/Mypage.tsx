import styled from 'styled-components';
import Uploader from './Uploader';
import Solvedlist from './Solvedlist';
import { MainWrapper } from '../../components/MainWrapper';

const Mypage = () => {
  return (
      <MainWrapper>
        <Uploader />
        <Solvedlist />
      </MainWrapper>
    
  );
};

// const RectangleWrap = styled.div`
//   position: relative;
//   margin: auto;
//   height: 80vh;
//   width: 75vw;
//   background-color: #47464630;
//   border-radius: 40px;
//   margin: auto;
//   justify-content: center;
//   align-items: center; // 자식 요소들을 세로 방향으로 중앙 정렬
//   box-shadow: 0px 1px 4px #ffffff48;
//   display:flex;
// `;

export default Mypage;
