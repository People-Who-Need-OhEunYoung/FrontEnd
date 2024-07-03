import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = () => {
  return (
    <div style={cssHeadNav}>
      <LinkButton to={'/usermain'}>메인</LinkButton>
      <LinkButton to={'/problemlist'}>문제 풀기</LinkButton>
      <LinkButton to={'/review'}>코드 리뷰</LinkButton>
    </div>
  );
};

const cssHeadNav = {
  padding: '25px 0',
  width: '100%',
  height: '50px',
  'line-height': '50px',
};

const LinkButton = styled(Link)`
  display: inline-block;
  padding: 0 20px;
  width: 33.3333%;
  box-sizing: border-box;
  @media (min-width: 1900px) {
    font-size: 1.2em;
  }
`;

export default Nav;
