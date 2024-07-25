import { ProblemDetails } from './index';
import axios from 'axios';
import _path from 'path';

/**
 * 문제의 id를 인자 받아서 해당 문제의 설명, 입출력 조건과 입출력 샘플 등의 디테일을 반환하는 비동기 함수
 * */

const getDetails = async (id: string): Promise<ProblemDetails> => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_SOLVED}/problem/${id}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching problem details: ${error}`);
  }
};

export default getDetails;
