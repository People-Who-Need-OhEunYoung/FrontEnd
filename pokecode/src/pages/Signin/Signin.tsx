import styled from 'styled-components';
import { DesignedButton } from '../../components/DesignedButton';
import { motion } from 'framer-motion';
import { userChecker } from '../../utils/api/solvedAc';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nicknameChecker } from '../../utils/api/api';

const Signin = () => {
  const [baekjoonid, setBaekjoonid] = useState('');
  const [baekjoonck, setBaekjoonck] = useState('');
  const [password, setPassword] = useState('');
  const [passwordck, setPasswordck] = useState('');
  const [nickname, setNickname] = useState('');
  const [nicknameck, setNicknameck] = useState('');

  const navigate = useNavigate();

  const handleAsyncOperation = async (value: any) => {
    try {
      const result: string = await userChecker(value);
      setBaekjoonck(result);
      console.error(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleAsyncNicknameOperation = async (value: any) => {
    try {
      const result = await nicknameChecker(value);
      setNicknameck(result);
      console.error('result');
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const signinChecker = async (params: any) => {
    await fetch(`http://${import.meta.env.VITE_APP_IP}/signUp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: params.id,
        pw: params.pw,
        nickName: params.nickName,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        console.log(res);
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data.result == 'success') {
          alert('가입 성공, 로그인 바랍니다.');
          navigate('/login');
        } else {
          alert(
            '이미 가입한 정보가 있거나 문제가 발생했습니다. \n서버관리자에게 문의하세요'
          );
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        alert('통신에러');
        throw error;
      });
  };
  const signinRun = () => {
    if (password != passwordck) {
      alert('패스워드 재확인 바랍니다');
      return;
    }
    if (baekjoonck != 'ok') {
      alert('백준 아이디 연동 실패 : 재확인 바랍니다');
      return;
    }
    if (password != passwordck) {
      alert('닉네임을 재확인 바랍니다');
      return;
    }
    signinChecker({ id: baekjoonid, pw: password, nickName: nickname });
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      transition={{
        duration: 1,
      }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Div className="Signin">
        <Modal>
          <H1>SIGN IN</H1>
          <div>
            <Input
              type="text"
              name="id"
              placeholder="BaekjoonID"
              value={baekjoonid}
              onChange={(e) => {
                setBaekjoonid(e.target.value);
                handleAsyncOperation(e.target.value);
              }}
            />
          </div>

          {baekjoonck == '' ? (
            <p>백준아이디를 검증합니다</p>
          ) : baekjoonck == 'ok' ? (
            <p style={{ color: 'green', fontWeight: 'bold' }}>
              백준아이디검증완료
            </p>
          ) : (
            <p style={{ color: 'red', fontWeight: 'bold' }}>
              백준에서 해당 아이디를 식별할 수 없습니다
            </p>
          )}

          <Input
            type="text"
            placeholder="Nickname"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              handleAsyncNicknameOperation(e.target.value);
            }}
          />

          {nicknameck == '' ? (
            <p>닉네임 중복 체크</p>
          ) : nicknameck == 'ok' ? (
            <p style={{ color: 'green', fontWeight: 'bold' }}>
              사용가능한 닉네임입니다
            </p>
          ) : (
            <p style={{ color: 'red', fontWeight: 'bold' }}>
              사용불가한 닉네임입니다
            </p>
          )}
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password Check"
            value={passwordck}
            onChange={(e) => setPasswordck(e.target.value)}
          />
          {passwordck == '' ? (
            <p>패스워드 검증</p>
          ) : password == passwordck ? (
            <p style={{ color: 'green', fontWeight: 'bold' }}>
              패스워드가 일치합니다.
            </p>
          ) : (
            <p style={{ color: 'red', fontWeight: 'bold' }}>
              패스워드가 일치하지 않습니다.
            </p>
          )}
          <ButtonDiv>
            <DesignedButton text="회원가입" event={signinRun} />
            <DesignedButton text="메인으로" link="/" />
          </ButtonDiv>
        </Modal>
      </Div>
    </motion.div>
  );
};
/* 모달 */
const Modal = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  width: 30vw;
  margin: auto;
  filter: drop-shadow(0px 6px 4px rgba(0, 0, 0, 0.25));
  background: rgba(161, 174, 219, 0.15);
  border-radius: 50px;
  @media (max-width: 1240px) {
    width: 80vw;
  }
  @media (max-width: 850px) {
    width: 100vw;
  }
`;

// /* INPUT */
const Input = styled.input`
  width: 15vw;
  margin: 1em;
  background: none;
  border: none;
  border-bottom: 1px solid #fff;
  padding: 10px;
  box-sizing: border-box;
  color: white;
  @media (max-width: 1240px) {
    width: 60vw;
  }
  @media (max-width: 850px) {
    width: 80vw;
  }
`;

const Div = styled.div`
  position: relative;
  color: white;
  text-align: center;
  height: calc(100vh - 180px);
  transition: 1s;
`;
const ButtonDiv = styled.div`
  margin: 1em 0 4em 0;
`;
const H1 = styled.h1`
  padding-top: 1em;
  font-size: 4em;
`;

export default Signin;
