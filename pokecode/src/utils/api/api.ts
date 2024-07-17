export {
  nicknameChecker,
  userInfo,
  pokemonName,
  getPooCount,
  removePoo,
  getGachaPokemon,
  updateMyPokemon,
  setGachaPokemon,
  problemSearch,
  showPokemonBook,
  showRoomList,
  createRoom,
  SubmitCode,
  RunCode,
};

//닉네임 중복 검사
const nicknameChecker = async (name: string): Promise<string> => {
  return await fetch(`${import.meta.env.VITE_APP_IP}/checkNickName`, {
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

//사용자 데이터 요청
const userInfo = async () => {
  return await fetch(`${import.meta.env.VITE_APP_IP}/headerData`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((error) => {
      return 'ERROR : ' + error;
    });
};

//사용자 똥 갯수 가져오기
const getPooCount = async () => {
  return await fetch(`${import.meta.env.VITE_APP_IP}/getPoo`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((error) => {
      return 'ERROR : ' + error;
    });
};

//사용자 똥 지우기
const removePoo = async () => {
  return await fetch(`${import.meta.env.VITE_APP_IP}/clearPoo`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  });
};

//포켓몬 이름 가져오기
const pokemonName = async (number: number) => {
  return await fetch(`https://pokeapi.co/api/v2/pokemon-species/${number}`, {
    method: 'GET',
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data.names[2].name);
      return data.names[2].name;
    }).catch(() =>{
      return 'error';
  });
};

//사용자 포켓몬 도감 등록 및 크래딧 차감
const setGachaPokemon = async (number: number) => {
  return await fetch(`${import.meta.env.VITE_APP_IP}/gambling`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pok_id: number,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then(async (data) => {
      console.log(data);
      return data;
    })
    .catch((error) => {
      return 'ERROR : ' + error;
    });
};

//사용자 포켓몬 뽑기
const getGachaPokemon: Function = async () => {
  return await fetch(
    `https://pokeapi.co/api/v2/evolution-chain/${Math.floor(
      Math.random() * 336 + 1
    )}/`,
    {
      method: 'GET',
    }
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then(async (data) => {
      console.log(data);
      return await fetch(data.chain.species.url, {
        method: 'GET',
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then(async (idData) => {
          console.log(idData.id);
          if (idData.id > 649) {
            await getGachaPokemon();
          }
          return idData.id;
        });
    })
    .catch(async (error) => {
      console.log(error);
      return await getGachaPokemon();
    });
};

//현재 포켓몬 변경
const updateMyPokemon = async (pokId: number) => {
  return await fetch(`${import.meta.env.VITE_APP_IP}/changeMonster`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pok_id: pokId,
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
      console.log(pokId);
      return data;
    })
    .catch((error) => {
      console.log(error);
      return 'ERROR : ' + error;
    });
};


//문제 검색
function problemSearch(title: string, sort: string, page: number, order: string): Promise<any> {
  return fetch(`${import.meta.env.VITE_APP_IP}/problemList?query=${title}&direction=${order}&page=${page}&sort=${sort}`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json',
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

//포켓몬 도감 확인
const showPokemonBook = async () => {
  return await fetch(`${import.meta.env.VITE_APP_IP}/book`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json',
    }
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log(error);
      return 'ERROR : ' + error;
    });
};

//코드리뷰방 목록 가져오기
const showRoomList = async () => {
  return await fetch(`${import.meta.env.VITE_APP_IP}/reviewList`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json',
    }
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.log(error);
      return 'ERROR : ' + error;
    });
};

//코드리뷰방 목록 가져오기
const createRoom = async (title: string, no: string, tier: number, problem_title: string, limit: number): Promise<any> => {
  return await fetch(`${import.meta.env.VITE_APP_IP}/createReview`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      reviewTitle: title,
      problemNo: no,
      problemTier: tier,
      problemTitle: problem_title,
      maxPerson: limit,
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
      return data;
    })
    .catch((error) => {
      console.log(error);
      return 'ERROR : ' + error;
    });
};


//코드 제출하기
const SubmitCode = async (editorContent: string, id: string): Promise<any> => {
  return await fetch(`${import.meta.env.VITE_APP_IP}/runCode`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code: editorContent, bojNumber: id 
    }),
    
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.statusText}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.log(error);
      return 'ERROR : ' + error;
    });
};

interface TestCase {
  input_case: string;
  output_case: string;
}

const RunCode = async (editorContent: string, id: string, testCases: TestCase[]): Promise<any> => {

  return await fetch(`${import.meta.env.VITE_APP_IP}/runCode`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify( {
      code: editorContent,
      bojNumber: id,
      testCase: testCases
    }),
  })
  .then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.statusText}`);
    }
    return res.json();
  })
  .then((data) => {
    console.log(data);
    return data;
  })
  .catch((error) => {
    console.log(error);
    return 'ERROR : ' + error;
  });
};