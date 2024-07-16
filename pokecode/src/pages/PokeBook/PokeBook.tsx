import styled from 'styled-components';
import { MainWrapper } from '../../components/MainWrapper';
import { showPokemonBook, pokemonName } from '../../utils/api/api';
import { useEffect, useRef, useState } from 'react';
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
  const [selectedPokemon, setSelectedPokemon] = useState<boolean>(true);
  const [visibleList, setVisibleList] = useState<string>('all_list'); 
  const [page, setPage] = useState<number>(1);
  const pokemonGifRef = useRef<HTMLImageElement>(null);
  const [activeButton, setActiveButton] = useState<string>('all_list');
  const [pokemonname, setPokemonname] = useState('');

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

  const pokemonnameSet = async (name: number) => {
    if(name === 0){
      setPokemonname('???');
    }else {
      setPokemonname(await pokemonName(name));
    }
  };

  const displayedItems = visibleList === 'all_list' ? getPagedItems(allPokemons, page) : getPagedItems(gatchPokemons, page);

  useEffect( ()=> {
    setCurPokeId(pokemonId);
    //pokemonnameSet(pokemonId);
    //console.log(pokemonname);
  },[pokemonId]);

  const setFilter = () => {
    if (pokemonGifRef.current) {
      if (!selectedPokemon) {
        pokemonGifRef.current.style.filter = 'brightness(0.01)';
        pokemonnameSet(0);
      } else {
        pokemonGifRef.current.style.filter = '';
        pokemonnameSet(curPokeId);
      }
    }
  }

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
          ref={pokemonGifRef}
          src={
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/' +
                curPokeId +
                '.gif'
          }
          onLoad={() => {setFilter()}}
        ></PokemonGif>
        <PokemonName>  {curPokeId}. {pokemonname} </PokemonName>
      </PokeMonView>
      <ListWrap>
        <ButtonGroup>
          <SelectBtn active={activeButton === 'all_list'} onClick={() => {setVisibleList('all_list');  setActiveButton('all_list');}}> 전체 </SelectBtn>
          <SelectBtn active={activeButton === 'gatcha_list'} onClick={() => {setVisibleList('gatcha_list');  setActiveButton('gatcha_list');}}> 획득한 포켓몬 </SelectBtn>
        </ButtonGroup>
        <ListView>
          {visibleList === 'all_list' && 
              displayedItems.map((item, index) => (
              <Item key={index} onClick={() => {setCurPokeId(item.poke_id); setSelectedPokemon(item.poke_Lv !== 0)}}>
                {(() => {
                  return (
                    <BookText>
                      <div>
                        <p  style={{padding:'20px 0'}}>
                          No. {item.poke_id}
                        </p>
                        <Pokemon 
                          src={
                            item.poke_Lv === 0
                              ? 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'
                              : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${item.poke_id}.svg`
                          }
                        />
                      </div>
                      <div>
                        <p >
                          Level: {item.poke_Lv}
                        </p>
                        <p>
                          Exp: {item.poke_Exp}
                        </p>
                      </div>
                    </BookText>
                  );
                })()}
              </Item>
            ))}
            {visibleList === 'gatcha_list' && 
              gatchPokemons.map((item, index) => (
              <Item key={index} onClick={() => {setCurPokeId(item.poke_id); setSelectedPokemon(true)}}>
                {(() => {
                  return (
                    <BookText>
                      <div>
                        <p  style={{padding:'10px'}}>
                          No. {item.poke_id}
                        </p>
                        <Pokemon
                          src={
                            item.poke_Lv === 0
                              ? 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'
                              : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${item.poke_id}.svg`
                          }
                        />
                      </div>
                      <div>
                        <p>
                          Level: {item.poke_Lv}
                        </p>
                        <p>
                          Exp: {item.poke_Exp}
                        </p>
                      </div>
                    </BookText>
                  );
                })()}
              </Item>
            ))}
        </ListView>
        <PageBtnGroup>
          {renderPageButtons()}
        </PageBtnGroup>
      </ListWrap>
       
    </MainWrapper>
  );
}

const PokemonName = styled.div`
  position: absolute;
  background-color: #333449;
  font-size: 1.7rem;
  font-weight: bold;
  width: 50%;
  height: 8%;
  text-align: center;
  line-height: 1.6;
  border-radius: 20px;
  left: 25%;
  bottom: 5%;
`;

const BookText = styled.div`
  color: #1e504d;
  font-size: 1rem;
  font-weight: bold;
`;

const PageButton = styled.button<{ active: boolean }>`
  width: 30px;
  margin-right: 10px;
  background-color: ${({ active }) => (active ? '#BA94B4' : 'transparent')};
  color: white;
  border-radius: 10px;
  font-size: 1rem;
  border: none;


`;

const ButtonGroup = styled.div`
  border-radius: 10px;
`;

const PageBtnGroup = styled.div`
  margin: 1.5%;
  position: absolute;
  left: 10%;
`;

const SelectBtn = styled.button<{ active: boolean }>`
  padding: 1px 50px;
  border: none;
  border-radius: 15px 15px 0 0;
  outline: none;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  line-height: 1.75;
  text-transform: uppercase;
  transition: background-color 0.3s;
  background-color: ${({ active }) => (active ? '#333449' : '#5C536D')};
  color:  ${({ active }) => (active ? 'white' : 'white')};
`;


const PokeMonView = styled.div`
  width: 30%;
  height: 70%;
  text-align: center;
  box-sizing: border-box;
  border-radius: 30px 20px;
  background: url(${background}) no-repeat;
  background-size: cover;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const PokemonGif = styled.img`
  transform: scale(0.5);
`;

const Item = styled.button`
  padding: 15px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  margin: 7%;
  background-color: #ffffff;
  border-radius: 10px;
  cursor: pointer;
`;

const ListWrap = styled.div`
  width: 50%;
  height: 80%;
  margin-left: 10px;
  position: relative;
`;

const ListView = styled.div`
  background-color: #333449;
  height: 87%;
  overflow-y: auto;
  font-size: 1.2rem;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-auto-rows: 260px;
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
  margin-top: 20%;
`;

export default PokeBook;