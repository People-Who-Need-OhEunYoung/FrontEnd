import React, { useState, useRef, ChangeEvent } from 'react';
import styled from 'styled-components';
import defaultImage from '../../assets/images/default_profile.png';
import { useNavigate } from 'react-router-dom';

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

  // const [query, setQuery] = useState(""); // 사용자 검색 쿼리
  // const [userData, setUserData] = useState(null); // API로부터 받은 데이터
  // const [page, setPage] = useState(1); // 페이지 번호, 초기값 1

  // useEffect(() => {
  // if (query.length > 0) {
  //   const fetchData = async () => {
  //     // 쿼리와 페이지 번호를 URL에 포함
  //     const url = `http://localhost:8481/proxy/search/user?query=${encodeURIComponent(query)}&page=${page}`;
  //     const response = await fetch(url, {
  //       method: "GET",
  //       headers: {
  //         // 'Content-Type': 'application/json',
  //         // 'x-solvedac-language': 'en' // 여기서 사용할 언어 설정, 'en' 또는 'ko' 등
  //       }
  //     })
  //     .then((res)=>{console.log(res)})
  //     if (response.ok) {
  //       const data = await response.json();
  //       setUserData(data);
  //     } else {
  //       console.error("Failed to fetch data:", response.status);
  //     }
  //   };
  //   fetchData();
  // }
  // }, [query, page]); // 쿼리 또는 페이지가 변경될 때마다 useEffect 실행

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
    <div className="uploader-wrapper">
      <input
        type="file"
        accept="image/*"
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
          <Image src={image.preview_URL} alt="Preview" />
          <Button onClick={() => inputRef.current?.click()}>
            이미지 업로드
          </Button>
          {/* <Button onClick={deleteImage}>
            삭제
          </Button> */}
        </UploadImageContainer>
        <InfoContainer>
          <Text>닉네임:</Text>
          <Text>크레딧:</Text>
          <Text>맞은 문제 수: </Text>
          <Text>소속: </Text>
          {/* {userData && <div>{JSON.stringify(userData)}</div>} */}
        </InfoContainer>
      </MainContainer>
      <Submit>
        <SubmitBtn onClick={handleButtonClick}>{buttonText}</SubmitBtn>
        <SubmitBtn onClick={goToMain}>메인으로</SubmitBtn>
      </Submit>
    </div>
  );
};

const Button = styled.button`
  background-color: #ffffff;
  color: #000000;
  padding: 4px 35px;
  border: none;
  border-radius: 20px;
  outline: none;
  cursor: pointer;
  font-size: 1em;
  font-weight: 500;
  line-height: 1.75;
  text-transform: uppercase;
  transition: background-color 0.3s;
  margin: 7px;

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
  width: 160px;
  height: 160px;
  object-fit: cover; // 이미지 비율을 유지하면서 요소에 완벽히 맞도록 조정
  border-radius: 50%; // 이미지를 원형으로 만듬
  margin: 10px;
`;

const UploadImageContainer = styled.section`
  display: inline-block;
  flex-direction: column; // 세로 방향으로 정렬
  width: 30%;
  text-align: center;
  justify-content: center; // 세로 방향 중앙 정렬
  align-items: center; // 가로 방향 중앙 정렬
  gap: 10px; // 버튼과 이미지 사이의 간격
  margin: 60px 10px 30px 100px; //상에서 시계방향
`;

const MainContainer = styled.div`
  display: inline-flex; // 자식 요소를 옆으로 나란히 배치
  flex-direction: row; // 가로 방향 정렬
`;

const InfoContainer = styled.div`
  margin-top: 70px;
  align-items: auto; // 가로 방향 중앙 정렬
  font-size: 1.4em;
`;

const Text = styled.h4`
  margin: 20px 40px;
  color: white;
  text-align: left;
`;

const Submit = styled.div`
  display: flex; // 자식 요소를 옆으로 나란히 배치
  justify-content: end;
  width: 92%;
`;

const SubmitBtn = styled.button`
  background-color: #ffffff;
  color: #000000;
  padding: 4px 70px;
  border: none;
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
    background-color: #4ea6ff;
  }

  &:active {
    background-color: #389ae6;
  }

  &:focus {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.584);
  }
`;

export default Uploader;
