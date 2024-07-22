import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
export const Profile = ({ ...props }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isHovering2, setIsHovering2] = useState(false);
  const handleMouseOver = () => {
    setIsHovering(true);
  };
  const handleMouseOut = () => {
    setIsHovering(false);
  };

  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    alert('로그아웃했습니다.');
    navigate('/');
  };
  return (
    <div>
      <MyPic src={`/dw/${props.pokemonId}.svg`} alt="" />
      <Myinfo>
        <p>
          {props.name}님
          <br />
          <div
            onMouseEnter={() => setIsHovering2(true)}
            onMouseLeave={() => setIsHovering2(false)}
          >
            총코인 :
            {props.math_coin +
              props.impl_coin +
              props.dp_coin +
              props.data_coin +
              props.graph_coin}
          </div>
        </p>
      </Myinfo>

      {isHovering2 ? (
        <HoverModal>
          <span style={{ fontSize: '1em' }}>수학코인 : {props.math_coin}</span>
          <br />
          <span style={{ fontSize: '1em' }}>구현코인 : {props.impl_coin}</span>
          <br />
          <span style={{ fontSize: '1em' }}>DP코인 : {props.dp_coin}</span>
          <br />
          <span style={{ fontSize: '1em' }}>
            자료구조코인 : {props.data_coin}
          </span>
          <br />
          <span style={{ fontSize: '1em' }}>
            그래프코인 : {props.graph_coin}
          </span>
        </HoverModal>
      ) : (
        ''
      )}
      <DownMenu
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 320 512"
        onMouseOver={handleMouseOver}
        className="downmenu"
        fill="white"
      >
        <path d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8l256 0c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z" />
      </DownMenu>
      <MyMenu
        style={isHovering ? { display: 'flex', opacity: 1 } : {}}
        onMouseLeave={handleMouseOut}
      >
        <MyMenuList>
          <Link
            style={{
              display: 'inline-block',
              width: '100%',
              padding: '15px',
              boxSizing: 'border-box',
            }}
            to={'/mypage'}
          >
            마이페이지
          </Link>
        </MyMenuList>
        <MyMenuList>
          <Link
            style={{
              display: 'inline-block',
              width: '100%',
              padding: '15px',
              boxSizing: 'border-box',
            }}
            to={'/gacha'}
          >
            전설 뽑기
          </Link>
        </MyMenuList>
        <MyMenuList>
          <a
            style={{
              display: 'inline-block',
              width: '100%',
              padding: '15px',
              cursor: 'pointer',
              boxSizing: 'border-box',
            }}
            onClick={logout}
          >
            로그아웃
          </a>
        </MyMenuList>
      </MyMenu>
      <Logout>
        <svg
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          onMouseOver={handleMouseOver}
        >
          <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
        </svg>
      </Logout>
    </div>
  );
};

const MyPic = styled.img`
  position: absolute;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  margin: 20px;
  left: -15px;
  @media (max-width: 1240px) {
    display: none;
  }
`;

const Myinfo = styled.div`
  width: 150px;
  padding: 0 20px;
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50px;
  transform: translateY(-50%);
  font-size: 0.7em;
  @media (max-width: 1240px) {
    display: none;
  }
`;
const MyMenu = styled.ul`
  display: none;
  opacity: 0;
  z-index: 200;
  position: absolute;
  right: -60px;
  top: 60px;
  width: 150px;
  align-content: space-around;
  flex-wrap: wrap;
  flex-direction: column;
  background: #2e3b53;
  border-radius: 10px;
`;
const MyMenuList = styled.li`
  width: 100%;
  text-align: center;
  border-radius: 10px;
  line-height: 10px;
  font-size: 1em;
  font-weight: bold;
  &:hover {
    color: #38bdf8;
  }
`;
const DownMenu = styled.svg`
  position: absolute;
  left: 200px;
  top: 5%;
  width: 30px;
  @media (max-width: 1240px) {
    display: none;
  }
`;
const Logout = styled.div`
  display: none;
  position: absolute;
  right: 20px;
  width: 40px;
  @media (max-width: 1240px) {
    display: block;
    width: 40px;
    line-height: 125px;
  }
`;
const HoverModal = styled.p`
  text-align: center;
  margin: 0;
  font-family: 'Noto Sans KR', 'Arsenal SC', sans-serif;
  font-optical-sizing: auto;
  position: absolute;
  width: 100px;
  left: 50%;
  top: 100%;
  border-radius: 8px;
  background: #38bdf8;
  color: #fff;
  font-size: 10px;
  display: block;
  z-index: 1000;
  border: none;
  transform: translatex(-50%);
  &::after {
    position: absolute;
    bottom: 100%;
    width: 0;
    height: 0;
    margin-left: -70px;
    border: solid transparent;
    border-color: rgba(51, 51, 51, 0);
    border-bottom-color: #38bdf8;
    border-width: 5px;
    pointer-events: none;
    content: '';
  }
`;
export default Profile;
