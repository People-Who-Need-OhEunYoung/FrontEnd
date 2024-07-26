import { Link } from 'react-router-dom';
import styled from 'styled-components';
const Nav = () => {
  return (
    <NavWrap>
      <LinkButton to={'/usermain'}>메인</LinkButton>
      <LinkButton to={'/problemlist'}>문제 풀기</LinkButton>
      <LinkButton to={'/roomlist'}>코드 리뷰</LinkButton>
    </NavWrap>
  );
};

const NavWrap = styled.div`
  padding: 15px 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  @media (max-width: 550px) {
    width: 80%;
  }
`;

const LinkButton = styled(Link)`
  display: inline-block;
  padding: 0 20px;
  width: 33.3333%;
  box-sizing: border-box;
  border-radius: 20px;
  cursor: inherit;
  @media (min-width: 1900px) {
    font-size: 1.2em;
  }
  @media (max-width: 550px) {
    font-size: 11px;
  }

  &:focus {
    color: #50fa7b;
  }
`;

export default Nav;
