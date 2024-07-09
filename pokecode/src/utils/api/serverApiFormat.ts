type userinfo = {
  id: string;
  pw: string;
};

// 이동예시
// const navigate = useNavigate();
// navigate('/usermain');

const loginCall = async (params: userinfo) => {
  await fetch(`http://52.79.197.126/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: params.id, pw: params.pw }),
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
        alert('로그인에 성공했습니다.');
      } else {
        alert(data.message);
      }
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      alert('통신에러');
      throw error;
    });
};
