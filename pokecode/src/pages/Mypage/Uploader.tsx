import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import styled from 'styled-components';
import defaultImage from '../../assets/images/default_profile.png'
import { useNavigate  } from 'react-router-dom';
import { userSearch } from '../../utils/api/solvedAc';

type ImageState = {
  image_file: File | null;
  preview_URL: string;
};

const Uploader = () => {
  const [image, setImage] = useState<ImageState>({
    image_file: null,
    preview_URL: defaultImage,
  });

  const [buttonText, setButtonText] = useState<string>('수정하기');
  const navigate = useNavigate();

  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('jade0179'); // 사용자 검색 쿼리
  const [userData, setUserData] = useState(''); // API로부터 받은 데이터
  // const [page, setPage] = useState(1); // 페이지 번호, 초기값 1
  const [solvedCount, setsolvedCount] = useState(0); // 페이지 번호, 초기값 0
  const [tierImg, settierImg] = useState('');

  useEffect(() => {
    userSearch(query)
    .then((res) => {
      setUserData(JSON.stringify(res)); // 받아온 데이터를 state에 저장
    })
    .catch((error) => {
      console.error('Error fetching data:', error); // 에러 처리
    });

    if (userData) {
      const parsedData = JSON.parse(userData);
      if (parsedData.count > 0) {
        setsolvedCount(parsedData.items[0].solvedCount);
        const tiersrc = `https://static.solved.ac/tier_small/${parsedData.items[0].tier}.svg`;
        settierImg(tiersrc);
        console.log('solvedCount:', solvedCount);
      }
    }
  }, [userData, query]);

  const previewImage = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files && e.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        setImage({
          image_file: file,
          preview_URL: fileReader.result as string,
        });
      };
    }
  };

  // const deleteImage = () => {
  //   setImage({
  //     image_file: null,
  //     preview_URL: defaultImage,
  //   });
  //   if (inputRef.current) {
  //     inputRef.current.value = '';
  //   }
  // };

  const handleButtonClick = () => {
    setButtonText((prevText) =>
      prevText === '수정하기' ? '변경하기' : '수정하기'
    );
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const goToMain = () => {
    navigate('/usermain');
  };

  return (
    <Uploaderwrapper>
      <input type="file" accept="image/*"
        onChange={previewImage}
        onClick={(e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
          const target = e.target as HTMLInputElement;
          target.value = '';
        }}
        ref={inputRef}
        style={{ display: 'none' }}
      />
      <MainContainer>
        <UploadImageContainer>
          <TierImg src = {tierImg}/>
          <Image src={image.preview_URL} alt="Preview" />
          <Button onClick={() => inputRef.current?.click()}>
            이미지 업로드
          </Button> 
        </UploadImageContainer>
        <InfoContainer>
          <Text>닉네임: {query} </Text>
          <Text>크레딧:</Text>
          <Text>맞은 문제 수: {solvedCount} </Text>
          <Text>소속: </Text>
        </InfoContainer>
      </MainContainer>
      <Submit>
        <SubmitBtn onClick={handleButtonClick}>{buttonText}</SubmitBtn>
        <SubmitBtn onClick={goToMain}>메인으로</SubmitBtn>
      </Submit>
    </Uploaderwrapper>
  );
};

const Uploaderwrapper = styled.div`
  height: 75%;
  width: 50%;
`;

const Button = styled.button`
  background-color: transparent;
  border: 2px solid white; /* 2px 두께의 흰색 실선 테두리 */;
  color: #ffffff;
  padding: 4px 35px ;
  border-radius: 20px;
  outline: none;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.5;
  text-transform: uppercase;
  transition: background-color 0.3s;
  margin: 10px;

  &:hover {
    background-color: #4ea6ff;
  }

  &:active {
    background-color: #389ae6;
  }

  &:focus {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.584);
  }
`;

const Image = styled.img`
  width: 140px;
  height: 140px;
  object-fit: cover; // 이미지 비율을 유지하면서 요소에 완벽히 맞도록 조정
  border-radius: 50%; // 이미지를 원형으로 만듬
  margin: 10px;
  box-shadow: 0px 1px 22px #ffffff7d;
  //border: 2px,solid, white;
`;

const UploadImageContainer = styled.section`
  position: relative; // 내가 짱이다. (내 안에 있는 absolute들을 통치하겠다.)
  display: inline-block;
  flex-direction: column; // 세로 방향으로 정렬
  width: 40%;
  text-align: center;
  justify-content: center; // 세로 방향 중앙 정렬
  margin: 25px 50px;
`;

const MainContainer = styled.div`
  display: flex; // 자식 요소를 옆으로 나란히 배치
  background-color: #31313888;
  border-radius: 20px;
  margin-left: 10%;
  justify-content: center;
`;

const InfoContainer = styled.div`
  margin-top: 30px;
  width: 50%;
  font-size: 1.4em;
`;

const Text = styled.p`
  margin: 20px 40px;
  color: #ffffff;
  text-align: left;
  font-size: 1rem;
`;

const Submit = styled.div`
  display: flex; // 자식 요소를 옆으로 나란히 배치
  justify-content: center;
  margin-top: 40%;
`;

const SubmitBtn = styled.button`
  background-color: transparent;
  color: #ffffff;
  padding: 4px 70px ;
  border: 2px solid white; /* 2px 두께의 흰색 실선 테두리 */;
  border-radius: 15px;
  outline: none;
  cursor: pointer;
  font-size: 1 rem;
  font-weight: 500;
  line-height: 1.75;
  text-transform: uppercase;
  transition: background-color 0.3s;
  margin: 7px;

  &:hover {
    background-color: #4ea7ff52;
    box-shadow: 0px 1px 22px #ffffff7d;
  }

  &:active {
    background-color: #4ea7ff52;
  }

  &:focus {
    //box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.584);
  }
`;

const TierImg = styled.img`
  position: absolute; //나는 부모에게 빌붙겠다. 
  left : 50%;
  bottom: 50px;
  transform: translateX(-50%);
  width: 30px;
`;


export default Uploader;
