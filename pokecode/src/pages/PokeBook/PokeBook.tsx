import styled from 'styled-components';
import { MainWrapper } from '../../components/MainWrapper';
import { showPokemonBook } from '../../utils/api/api';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import background from '../../assets/images/background2.jpg';

type PokemonType = {
  poke_id: number;
  poke_Lv: number;
  poke_Exp: number;
  
};


const PokeBook = () => {
  
  const [allPokemons, setAllPokemons] = useState<PokemonType[]>([]);
  const [gatchPokemons, setGatchPpokemons] = useState<PokemonType[]>([]);
  const { pokemonId } = useSelector((state: RootState) => state.userinfo);
  const [curPokeId, setCurPokeId] = useState<number>(pokemonId);
  const [visibleList, setVisibleList] = useState<string>('all_list'); 
  const [page, setPage] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(1);
  const [currentPageGroup, setCurrentPageGroup] = useState<number>(0);
  const itemsPerPage = 50;

  const fetchPokeBook = async () => {
    try {
      const res = await showPokemonBook();
      return res;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

   const renderPageButtons = () => {
    const totalItems = visibleList === 'all_list' ? allPokemons.length : gatchPokemons.length;
    const pageCount = Math.ceil(totalItems / itemsPerPage);
    const buttons = [];

    for (let i = 1; i <= pageCount; i++) {
      buttons.push(
        <PageButton key={i} onClick={() => setPage(i)} active={i === page}>
          {i}
        </PageButton>
      );
    }

    return buttons;
  };

  const getPagedItems = (items: PokemonType[], page: number) => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return items.slice(start, end);
  };

  const displayedItems = visibleList === 'all_list' ? getPagedItems(allPokemons, page) : getPagedItems(gatchPokemons, page);

  useEffect(()=> {
    setCurPokeId(pokemonId)
  },[pokemonId]);


  useEffect(() => {
    fetchPokeBook().then((res) => {
      const ParseData = res.book;
      if (ParseData.length > 0) {
        const defaultPokemon = Array.from({ length: 649 }, (_, index) => ({
          poke_id: index + 1,
          poke_Lv: 0,
          poke_Exp: 0,
        }));
        const GatchaPokemon = []
        for (let i = 0; i < ParseData.length; i++) {
          const item = ParseData[i];
          defaultPokemon[item.poke_id-1] = item; // ID를 인덱스에 맞게 설정
          GatchaPokemon.push(item);
        }
        setAllPokemons(defaultPokemon); 
        setGatchPpokemons(GatchaPokemon);
      } else {
        setAllPokemons([]);
        setGatchPpokemons([]);
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
      <ListWrap>
        <ButtonGroup>
          <SelectBtn onClick={() => setVisibleList('all_list')}> 전체 </SelectBtn>
          <SelectBtn onClick={() => setVisibleList('gatcha_list')}> 획득한 포켓몬 </SelectBtn>
        </ButtonGroup>
        <ListView>
          {visibleList === 'all_list' && 
              displayedItems.map((item, index) => (
              <Item key={index} onClick={() => {setCurPokeId(item.poke_id)}}>
                {(() => {
                  return (
                    <div>
                      <div>
                        <Pokemon
                          src={
                            item.poke_Lv === 0
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
            {visibleList === 'gatcha_list' && 
              gatchPokemons.map((item, index) => (
              <Item key={index} onClick={() => {setCurPokeId(item.poke_id)}}>
                {(() => {
                  return (
                    <div>
                      <div>
                        <Pokemon
                          src={
                            item.poke_Lv === 0
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
        <ButtonGroup style={{ margin: '1.5%' }}>
          {renderPageButtons()}
        </ButtonGroup>
      </ListWrap>
       
    </MainWrapper>
  );
}


const PageButton = styled.button<{ active: boolean }>`
  width: 30px;
  margin-right: 10px;
  background-color: ${({ active }) => (active ? '#4ea7ff' : 'transparent')};
  color: white;
  border-radius: 10px;
  font-size: 1rem;
  border: none;

  &:hover {
    background-color: #4ea7ff52;
  }

  &:active {
    background-color: #4ea7ff52;
  }
`;

const ButtonGroup = styled.div`
  border-radius: 10px;
`;

const SelectBtn = styled.button`
  color: white;
  background-color: transparent;
  padding: 4px 10px;
  border: none;
  border-radius: 15px;
  outline: none;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 500;
  line-height: 1.75;
  text-transform: uppercase;
  transition: background-color 0.3s;
  margin: 7px;

  &:hover {
    background-color: #4ea7ff52;
  }

  &:active {
    background-color: #4ea7ff52;
  }

  &:focus {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.584);
  }
`;


const PokeMonView = styled.div`
  width: 40%;
  height: 80%;
  display: flex;
  justify-content: center; 
  text-align: center;
  box-sizing: border-box;
  border-radius: 30px 20px;
  background: url(${background}) no-repeat;
  background-size: cover;
  overflow: hidden;
  position: relative;
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
  border-radius: 10px;
`;

const ListWrap = styled.div`
  width: 50%;
  height: 90%;

`;

const ListView = styled.div`
  background-color: #c2c2c21d;
  height: 86%;
  overflow-y: auto;
  font-size: 1.2rem;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-auto-rows: 300px;
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
  //transform: scale(1.6);
  /* border: 2px solid white; */
  width: 40px;
`;

export default PokeBook;