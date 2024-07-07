import styled from 'styled-components';
import { Link } from 'react-router-dom';

const SortList = () => {
  return <Orderul>
          <Orderli>
            <Link to={'./id'}>ID</Link>
          </Orderli>
          <Orderli>
            <Link to={'./level'}>레벨</Link>
          </Orderli>
          <Orderli>
            <Link to={'./title'}>제목</Link>
          </Orderli>
          <Orderli>
            <Link to={'./resolvedUser'}>푼 사람 수</Link>
          </Orderli>
          <Orderli>
            <Link to={'./try'}>평균시도</Link>
          </Orderli>
          <Orderli>
            <Link to={'./randum'}>랜덤</Link>
          </Orderli>
        </Orderul>
};


const Orderul = styled.ul`
  width: 50%;
  display: flex;
  justify-content: center;
  margin: 0 auto;
`;
const Orderli = styled.li`
  padding: 15px;
`;

export default SortList;