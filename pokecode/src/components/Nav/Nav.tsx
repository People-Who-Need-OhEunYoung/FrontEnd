import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = () => {
  return (
    <div className="headNav" style={cssHeadNav}>
      <LinkButton to={'/usermain'}>메인</LinkButton>
      <LinkButton to={'/problem'}>문제 풀기</LinkButton>
      <LinkButton to={'/review'}>코드 리뷰</LinkButton>
    </div>
  );
};

const cssHeadNav = {
  margin: 'auto',
  padding: '10px 0 10px 0',
};

const LinkButton = styled(Link)`
  display: inline-block;
  padding: 0 20px;
  width: 15vh;
  @media (min-width: 1900px) {
    width: 12em;
    height: 2em;
    font-size: 1.5em;
  }
`;

export default Nav;
