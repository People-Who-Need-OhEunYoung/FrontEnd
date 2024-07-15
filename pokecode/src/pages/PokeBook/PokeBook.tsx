import styled from 'styled-components';
import { MainWrapper } from '../../components/MainWrapper';
import { showPokemonBook } from '../../utils/api/api';
import { useEffect } from 'react';

const PokeBook = () => {

  const fetchPokeBook = async () => {
    try {
      const res = await showPokemonBook();
      return res;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchPokeBook().then((res) => {
      console.log(res);
    });
  },[])

  return (
    <MainWrapper>
      <div>

      </div>
      <div>

      </div>
    </MainWrapper>
  );
}




export default PokeBook;