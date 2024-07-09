import { useNavigate } from 'react-router-dom';
type userinfo = {
  id: string;
  pw: string;
};
const loginChecker = async (params: userinfo) => {
  const navigate = useNavigate();
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
        alert('체크');
      } else {
        confirm('세션이 만료되었습니다. 현재화면을 유지하시겠습니까?')
          ? ''
          : navigate('/');
      }
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      alert('통신에러');
      throw error;
    });
};

export default loginChecker;
