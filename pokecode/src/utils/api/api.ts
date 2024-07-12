export {
  nicknameChecker,
  userInfo,
  pokemonName,
  getPooCount,
  removePoo,
  getGachaPokemon,
  updateMyPokemon,
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
    });
};

//사용자 포켓몬 뽑기
const getGachaPokemon = async () => {
  return await fetch(`${import.meta.env.VITE_APP_IP}/gambling`, {
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

//현재 포켓몬 변경
const updateMyPokemon = async (pokId: number) => {
  return await fetch(`${import.meta.env.VITE_APP_IP}/changeMonster`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
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
      return 'ERROR : ' + error;
    });
};
