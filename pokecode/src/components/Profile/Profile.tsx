import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
export const Profile = ({ ...props }) => {
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    setIsHovering(true);
  };
  const handleMouseOut = () => {
    setIsHovering(false);
  };

  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('token');
    alert('로그아웃했습니다.');
    navigate('/');
  };
  return (
    <div>
      <MyPic
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${props.pokemonId}.svg`}
        alt=""
      />
      <p
        style={{
          position: 'absolute',
          bottom: '5px',
          width: '45px',
          textAlign: 'center',
        }}
      >
        LV100
      </p>
      <Myinfo>
        <p>
          {props.name}님
          <br />
          <span style={{ fontSize: '0.7em' }}>보유크래딧 : {props.credit}</span>
        </p>
      </Myinfo>

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
            뽑기
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
        >
          <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
        </svg>
      </Logout>
    </div>
  );
};

const MyPic = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  margin: 10px 0 10px 0;
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
  right: 0;
  top: 75px;
  align-content: space-around;
  flex-wrap: wrap;
  flex-direction: column;
  background: violet;
  border-radius: 20px;
`;
const MyMenuList = styled.li`
  width: 100%;
  border-radius: 20px;
  text-align: center;
  &:hover {
    background: #e96fe9;
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
export default Profile;
