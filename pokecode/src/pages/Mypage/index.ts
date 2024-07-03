export { default as Mypage } from './Mypage';
export { userSearch };

function userSearch(name: string) {
  fetch(`http://192.168.1.5:8481/proxy/search/user?query=${name}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'x-solvedac-language': 'ko',
    },
  }).then((res) => {
    res.json().then((data) => {
      console.log(data);
    });
  });
}
