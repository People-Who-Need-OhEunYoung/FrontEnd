// import { useState } from 'react';
import styled from 'styled-components';
import defaultImage from '../../assets/images/default_profile.png';
import { Link } from 'react-router-dom';
import { useState } from 'react';
export const Profile = ({ ...props }) => {
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    setIsHovering(true);
  };
  const handleMouseOut = () => {
    setIsHovering(false);
  };
  return (
    <div onMouseLeave={handleMouseOut} onMouseOver={handleMouseOver}>
      <MyPic src={defaultImage} alt="" />
      <Myinfo>
        <p>
          {props.name}님
          <br />
          <span style={{ fontSize: '0.7em' }}>보유크래딧 : {props.credit}</span>
        </p>
      </Myinfo>
      <DownMenu
        className="downmenu"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        fill="white"
      >
        <path d="M256 464a208 208 0 1 1 0-416 208 208 0 1 1 0 416zM256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM376.9 294.6c4.5-4.2 7.1-10.1 7.1-16.3c0-12.3-10-22.3-22.3-22.3H304V160c0-17.7-14.3-32-32-32l-32 0c-17.7 0-32 14.3-32 32v96H150.3C138 256 128 266 128 278.3c0 6.2 2.6 12.1 7.1 16.3l107.1 99.9c3.8 3.5 8.7 5.5 13.8 5.5s10.1-2 13.8-5.5l107.1-99.9z" />
      </DownMenu>
      <MyMenu style={isHovering ? { display: 'flex', opacity: 1 } : {}}>
        <MyMenuList>
          <Link to={'/mypage'}>마이페이지</Link>
        </MyMenuList>
        <MyMenuList>
          <Link to={'/gacha'}>뽑기</Link>
        </MyMenuList>
        <MyMenuList>
          <Link to={'/'}>로그아웃</Link>
        </MyMenuList>
      </MyMenu>
      <Logout>
        <svg
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
        </svg>
      </Logout>
    </div>
  );
};

const MyPic = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin: 25px 0 25px;
  @media (max-width: 1240px) {
    display: none;
  }
`;
const Myinfo = styled.div`
  width: 150px;
  padding: 20px;
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50px;
  transform: translateY(-50%);
  @media (max-width: 1240px) {
    display: none;
  }
`;
const MyMenu = styled.ul`
  display: none;
  opacity: 0;
  z-index: 200;
  position: absolute;
  right: 0;
  top: 90px;
  align-content: space-around;
  flex-wrap: wrap;
  flex-direction: column;
  background: violet;
  border-radius: 20px;
`;
const MyMenuList = styled.li`
  padding: 15px;
  border-radius: 20px;
  text-align: center;
  &:hover {
    background: #e96fe9;
  }
`;
const DownMenu = styled.svg`
  width: 50px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 200px;
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
export default Profile;
