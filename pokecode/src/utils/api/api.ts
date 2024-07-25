export {
  nicknameChecker,
  userInfo,
  pokemonName,
  getPooCount,
  removePoo,
  setEvolutionPokemon,
  getGachaPokemon,
  updateMyPokemon,
  problemSearch,
  showPokemonBook,
  showRoomList,
  createRoom,
  SubmitCode,
  RunCode,
  getResolvedProblems,
  SetTime,
  SetNickName,
  getRoomList,
  setRoom,
  getRoomPeopleChecker,
  reviewSearch,
  resolveCall,
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
      console.log('poke', data.user[0]);
      localStorage.setItem('bakjoon_id', data.user[0].bakjoon_id);
      localStorage.setItem('cur_poke_id', data.user[0].cur_poke_id);
      localStorage.setItem('data_coin', data.user[0].data_coin);
      localStorage.setItem('data_exp', data.user[0].data_exp);
      localStorage.setItem('dp_coin', data.user[0].dp_coin);
      localStorage.setItem('dp_exp', data.user[0].dp_exp);
      localStorage.setItem('exp_index', data.user[0].exp_index);
      localStorage.setItem('graph_coin', data.user[0].graph_coin);
      localStorage.setItem('graph_exp', data.user[0].graph_exp);
      localStorage.setItem('impl_coin', data.user[0].impl_coin);
      localStorage.setItem('impl_exp', data.user[0].impl_exp);
      localStorage.setItem('last_login', data.user[0].last_login);
      localStorage.setItem('math_coin', data.user[0].math_coin);
      localStorage.setItem('math_exp', data.user[0].math_exp);
      localStorage.setItem('nick_name', data.user[0].nick_name);
      localStorage.setItem('user_exp', data.user[0].user_exp);
      localStorage.setItem('user_level', data.user[0].user_level);
      localStorage.setItem('poke_title', data.user[0].poke_title);
      localStorage.setItem('poke_eval', data.user[0].poke_eval);
      localStorage.setItem('poke_legend_yn', data.user[0].poke_legend_yn);
      localStorage.setItem('poke_type', data.user[0].poke_type);
      localStorage.setItem('poke_name', data.user[0].poke_name);
      localStorage.setItem('poke_img', data.user[0].poke_img);
      localStorage.setItem('poke_profile_img', data.user[0].poke_profile_img);
      return data.user[0];
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
      return data.names[2].name;
    })
    .catch(() => {
      return 'error';
    });
};

//진화한 포켓몬 도감 등록 및 현재포켓몬으로 변경
const setEvolutionPokemon = async (number: number) => {
  return await fetch(`${import.meta.env.VITE_APP_IP}/evolution`, {
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
const getGachaPokemon: Function = async (coinSet: string) => {
  return await fetch(`${import.meta.env.VITE_APP_IP}/legendGambling`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      coin: coinSet,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then(async (data) => {
      return data;
    })
    .catch(async (error) => {
      console.log(error);
      return { result: 'fail', message: '알수 없는 에러' + error };
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
      console.log('변경요청 결과:', data);
      return data;
    })
    .catch((error) => {
      console.log(error);
      return 'ERROR : ' + error;
    });
};

//문제 검색
function problemSearch(
  title: string,
  sort: string,
  page: number,
  order: string
): Promise<any> {
  return fetch(
    `${
      import.meta.env.VITE_APP_IP
    }/problemList?query=${title}&direction=${order}&page=${page}&sort=${sort}`,
    {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
    }
  )
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
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      //진욱 기술적챌린지 주석
      // console.log(data);
      return data;
    })
    .catch((error) => {
      console.log(error);
      return 'ERROR : ' + error;
    });
};

//코드리뷰방 목록 가져오기
const createRoom = async (
  title: string,
  no: string,
  tier: number,
  problem_title: string,
  limit: number
): Promise<any> => {
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
const SubmitCode = async (
  editorContent: string,
  id: string,
  elapsedTime: number,
  limitTime: number,
  correct : boolean,
): Promise<any> => {
  return await fetch(`http://52.79.197.126:3000/runCode`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code: editorContent,
      bojNumber: id,
      lang: 'python',
      elapsed_time: elapsedTime,
      limit_time: limitTime,
      correct: correct,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.statusText}`);
      }
      console.log('testruncode1-------------------', editorContent, id);
      return res.json();
    })
    .then((data) => {
      console.log('data : ', data);
      return data;
    })
    .catch((error) => {
      console.log('error : ', error);
      return 'ERROR : ' + error;
    });
};

interface TestCase {
  input_case: string;
  output_case: string;
}

//테스트케이스 실행하기
const RunCode = async (
  editorContent: string,
  id: string,
  testCases: TestCase[]
): Promise<any> => {
  return await fetch(`${import.meta.env.VITE_APP_IP}/runCode`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code: editorContent,
      bojNumber: id,
      testCase: testCases,
      elapsed_time: 0,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        console.log(
          'testruncode1-------------------',
          editorContent,
          id,
          testCases
        );
        throw new Error(`HTTP error! Status: ${res.statusText}`);
      }
      console.log(
        'testruncode2-------------------',
        editorContent,
        id,
        testCases
      );
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

const SetTime = async (
  elapsedTime: number,
  limitTime: number,
  problemId: string
): Promise<any> => {
  return await fetch(`${import.meta.env.VITE_APP_IP}/setTime`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      elapsed_time: elapsedTime,
      limit_time: limitTime,
      problem_id: problemId,
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

//푼 문제 정보 가져오기
const getResolvedProblems = async () => {
  return await fetch(`${import.meta.env.VITE_APP_IP}/resolvedProblems`, {
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
      return data;
    })
    .catch((error) => {
      console.log(error);
      return 'ERROR : ' + error;
    });
};

const SetNickName = async (nickName: string): Promise<any> => {
  return await fetch(`${import.meta.env.VITE_APP_IP}/changeNickName`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nickName: nickName,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.statusText}`);
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

const getRoomList = async (page: number) => {
  return await fetch(`${import.meta.env.VITE_APP_ROOM}/roomlist?page=${page}`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json',
    },
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

const setRoom = async (
  roomTitle: string,
  problemTitle: string,
  problemNo: number,
  problemTier: number,
  roomOwner: string,
  maxPeople: number
) => {
  return await fetch(`${import.meta.env.VITE_APP_ROOM}/roomlist`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      room_title: roomTitle,
      problem_title: problemTitle,
      problem_no: problemNo,
      problem_tier: problemTier,
      room_owner: roomOwner,
      max_people: maxPeople,
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

const getRoomPeopleChecker = async (roomId: string | null) => {
  return await fetch(`${import.meta.env.VITE_APP_ROOM}/max-people-check`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      room_id: roomId,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.statusText}`);
      }
      console.log(res);
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

//코드리뷰방 검색
const reviewSearch = async (query: string) => {
  return await fetch(
    `${import.meta.env.VITE_APP_IP}/reviewList?search=${query}`,
    {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
    }
  )
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

//내가 푼 문제 화면
const resolveCall = async (
  problem_id: string | number,
  problem_title: string,
  limit_time: number
) => {
  return await fetch(
    `${import.meta.env.VITE_APP_IP}/selectOrUpdateResolvedProblem`,
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        problem_id: problem_id,
        problem_title: problem_title,
        limit_time: limit_time,
      }),
    }
  )
    .then((res) => {
      console.log('전송 데이터 : ', problem_id, problem_title, limit_time);
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
