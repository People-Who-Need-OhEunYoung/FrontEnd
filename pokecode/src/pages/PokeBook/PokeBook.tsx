import styled from 'styled-components';
import { MainWrapper } from '../../components/MainWrapper';
import { showPokemonBook } from '../../utils/api/api';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';


type PokemonType = {
  poke_id: number;
  poke_Lv: number;
  poke_Exp: number;
};


const PokeBook = () => {
  const [pokemons, setPokemons] = useState<PokemonType[]>([]);
  const { pokemonId } = useSelector((state: RootState) => state.userinfo);
  const [curPokeId, setCurPokeId] = useState<number>(pokemonId);

  const fetchPokeBook = async () => {
    try {
      const res = await showPokemonBook();
      return res;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(()=> {
    setCurPokeId(pokemonId)
  },[pokemonId]);


  useEffect(() => {
    fetchPokeBook().then((res) => {
      const ParseData = res.book;
      if (ParseData.length > 0) {
        const itemsArray = [];
        for (let i = 0; i < ParseData.length; i++) {
          const item = ParseData[i];
          itemsArray.push(item);
        }
        console.log('item:',itemsArray);
        setPokemons(itemsArray); 
      } else {
        setPokemons([]);
      }
    });
  },[])

  return (
    <MainWrapper>
      <PokeMonView>
        <PokemonGif
          src={
            curPokeId == 0
              ? 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'
              : 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/' +
                curPokeId +
                '.gif'
          }
        ></PokemonGif>
      </PokeMonView>
      <ListView>
         {pokemons.map((item, index) => (
            <Item key={index} onClick={() => {setCurPokeId(item.poke_id)}}>
               {(() => {
                return (
                  <div>
                    <div>
                      <Pokemon
                        src={
                          item.poke_id === 0
                            ? 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'
                            : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${item.poke_id}.svg`
                        }
                      />
                    </div>
                    <div>
                      <p  style={{padding:'10px', color: 'white'}}>
                        No. {item.poke_id}
                      </p>
                      <p  style={{padding:'10px', color: 'white'}}>
                        Level: {item.poke_Lv}
                      </p>
                      <p  style={{padding:'10px', color: 'white'}}>
                        Exp: {item.poke_Exp}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </Item>
          ))}
      </ListView>
    </MainWrapper>
  );
}

const PokeMonView = styled.div`
  width: 40%;
  border: 2px solid white;
  height: 80%;
  display: flex;
  justify-content: center;
  text-align: center;
  box-sizing: border-box;
  padding: 0%;
`;

const PokemonGif = styled.img`
  transform: scale(0.3)
`;

const Item = styled.button`
  padding: 15px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid white;
  margin: 5%;
  background-color:transparent;
`;

const ListView = styled.div`
  background-color: #c2c2c21d;
  width: 50%;
  height: 80%;
  overflow-y: auto;
  font-size: 1.2rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 400px;
`;

export const Pokemon = styled.img`
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -webkit-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  transform: scale(1.2);
  border: 2px solid white;
  width: 80px;
`;

export default PokeBook;