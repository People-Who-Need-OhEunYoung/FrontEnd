import styled from 'styled-components';
import Uploader from './Uploader';
import Solvedlist from './Solvedlist';

const Mypage = () => {

  return (
    <div>
        <RectangleWrap>
          <Uploader/>
          <Solvedlist/>
        </RectangleWrap>
    </div>
  )
}

const RectangleWrap = styled.div`
  height: 80vh;
  width: 60vw;
  background-color: #424068;
  border-radius: 40px;
  margin : auto;
  justify-content:center;
  align-items: center; // 자식 요소들을 세로 방향으로 중앙 정렬
`;


export default Mypage;
