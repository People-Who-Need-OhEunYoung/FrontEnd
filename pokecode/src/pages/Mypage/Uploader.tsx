import { useState, useRef } from 'react';
import styled from 'styled-components';
import { RootState } from '../../store/index';
import { useDispatch, useSelector } from 'react-redux';
import { SetNickName } from '../../utils/api/api';
import { setUserNickname } from '../../store/userInfo';
const Uploader = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useSelector((state: RootState) => state.userinfo);

  const [editedNickname, setEditedNickname] = useState<string>(user.nick_name);
  const [buttonText, setButtonText] = useState<string>('수정하기');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const dispatch = useDispatch();
  const sendNewNickName = async (nickname: string) => {
    try {
      const res = await SetNickName(nickname);
      console.log(res);
      if (res.result == 'fail') {
        return res.result;
      }
      return res;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleButtonClick = async () => {
    if (!isEditing) {
      setIsEditing(true);
      setButtonText('변경하기');
    } else {
      // 현재 편집 모드이면 저장하고 편집 모드 종료
      if ((await sendNewNickName(editedNickname)) == 'fail') {
        alert('중복된 닉네임 입니다'); // 사용자에게 피드백 제공
        return;
      }
      setIsEditing(false);
      setButtonText('수정하기');
      dispatch(setUserNickname(editedNickname));
    }
  };
  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedNickname(event.target.value);
  };
  return (
    <Uploaderwrapper>
      <MainContainer>
        <Image>
          <img
            style={{
              width: '100%',
              height: '100%',
              boxSizing: 'border-box',
              padding: '15px',
            }}
            src={`/dw/${user.cur_poke_id}.svg`}
            alt="Preview"
          />
        </Image>
        <InfoContainer>
          {isEditing ? (
            <Text>
              닉네임:
              <Input
                ref={inputRef}
                value={editedNickname}
                onChange={handleNicknameChange}
                autoFocus
              />
            </Text>
          ) : (
            <Text>닉네임: {user.nick_name}</Text>
          )}
          <Text>수학코인 : {user.math_coin}</Text>
          <Text>구현코인 : {user.impl_coin}</Text>
          <Text>DP코인 : {user.dp_coin}</Text>
          <Text>자료구조코인 : {user.data_coin}</Text>
          <Text>그래프코인 : {user.graph_coin}</Text>
          <Text>맞은 문제 수: </Text>
        </InfoContainer>
        <ButtonGroup>
          <Button
            onClick={() => {
              handleButtonClick();
            }}
          >
            {buttonText}
          </Button>
        </ButtonGroup>
      </MainContainer>
    </Uploaderwrapper>
  );
};

const Input = styled.input`
  background-color: #ffffff2b;
  color: #ffffff;
  text-align: left;
  font-size: 1rem;
  min-height: 11.5px; /* 최소 높이를 설정 */
  border: none;
  width: 50%;
  margin: 0 10px;
`;

const ButtonGroup = styled.div`
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  right: 10px;
  bottom: -25%;
`;

const Uploaderwrapper = styled.div`
  height: 75%;
  width: 50%;
`;

const Button = styled.button`
  background-color: #6366f1;
  color: #ffffff;
  padding: 4px 35px;
  border-radius: 10px;
  outline: none;
  cursor: inherut;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.5;
  border: none;

  transition: background-color 0.3s;
  margin: 5px;

  &:hover {
    background-color: #7f81f7;
  }

  &:active {
    background-color: #7f81f7;
  }
`;

const Image = styled.div`
  width: 140px;
  height: 140px;
  object-fit: cover; // 이미지 비율을 유지하면서 요소에 완벽히 맞도록 조정
  border-radius: 50%; // 이미지를 원형으로 만듬
  margin: 5%;
  margin-left: 10%;
  box-shadow: 0px 1px 22px #ffffff7d;
  //border: 2px,solid, white;
`;

const MainContainer = styled.div`
  display: flex; // 자식 요소를 옆으로 나란히 배치
  background-color: #1e293b7d;
  border-radius: 20px;
  margin-left: 10%;
  position: relative;
  align-items: center;
`;

const InfoContainer = styled.div``;

const Text = styled.p`
  margin: 20px 40px;
  color: #d3dde8;
  text-align: left;
  font-size: 1em;
`;

export default Uploader;
