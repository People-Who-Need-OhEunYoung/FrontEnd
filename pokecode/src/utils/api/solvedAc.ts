export { userSearch, getTop100, probSearch, crawlUserprob };

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
      // console.log(data); // 받아온 데이터를 콘솔에 출력
      return data; // 데이터를 반환하여 Promise 체인을 통해 다음으로 전달
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      throw error; // 오류를 다시 throw하여 호출자에게 전파
    });
}

function getTop100(name: string): Promise<any> {
  return fetch(`http://localhost:8481/proxy/user/top_100?handle=${name}`, {
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
      // console.log(data); // 받아온 데이터를 콘솔에 출력
      return data; // 데이터를 반환하여 Promise 체인을 통해 다음으로 전달
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      throw error;
    });
}

function probSearch(title: string, sort: string, page: number): Promise<any> {
  return fetch(`http://localhost:8481/proxy/search/problem?query=+${title}&direction=asc&page=${page}&sort=${sort}`, {
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
      // console.log(data); // 받아온 데이터를 콘솔에 출력
      return data; // 데이터를 반환하여 Promise 체인을 통해 다음으로 전달
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      throw error;
    });
}


function crawlUserprob(name: string, page: number): Promise<any> {
  return fetch(`http://localhost:8481/proxy_profile/${name}/solved?page=${page}`, {
    method: 'GET',
    headers: {
      "Content-Type" : 'application/json',
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.text();
    })
    .then((data) => {
      // console.log(data); // 받아온 데이터를 콘솔에 출력
      return data; // 데이터를 반환하여 Promise 체인을 통해 다음으로 전달
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      throw error;
    });
}