export { nicknameChecker };

//닉네임 중복 검사
const nicknameChecker = async (name: string): Promise<string> => {
  return await fetch(`http://${import.meta.env.VITE_APP_IP}/checkNickName`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nickName: name,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      if (data.result == 'success') {
        return 'ok';
      } else {
        return 'fail';
      }
    })
    .catch((error) => {
      return 'ERROR : ' + error;
    });
};
