export { userSearch };

function userSearch(name: string): Promise<any> {
  return fetch(`http://localhost:8481/proxy/search/user?query=${name}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'x-solvedac-language': 'ko',
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log(data); // 받아온 데이터를 콘솔에 출력
      return data; // 데이터를 반환하여 Promise 체인을 통해 다음으로 전달
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      throw error; // 오류를 다시 throw하여 호출자에게 전파
    });
}
