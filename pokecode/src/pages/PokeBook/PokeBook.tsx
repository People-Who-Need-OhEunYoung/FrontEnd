import styled from 'styled-components';
import { MainWrapper } from '../../components/MainWrapper';
import {
  showPokemonBook,
  pokemonName,
  updateMyPokemon,
} from '../../utils/api/api';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import background from '../../assets/images/background2.jpg';
import waterIcon from '../../assets/images/물.png';
import fireIcon from '../../assets/images/불.png';
import grassIcon from '../../assets/images/풀.png';
import electricIcon from '../../assets/images/전기.png';
import psychicIcon from '../../assets/images/에스퍼.png';
import { useDispatch } from 'react-redux';
import { setPokemonId } from '../../store/userInfo';

// const dispatch = useDispatch();

type PokemonType = {
  poke_id: number;
  poke_Lv: number;
  poke_Exp: number;
};

const PokeBook = () => {
  const dispatch = useDispatch();

  const [allPokemons, setAllPokemons] = useState<PokemonType[]>([]);
  const [gatchPokemons, setGatchPpokemons] = useState<PokemonType[]>([]);
  const { pokemonId } = useSelector((state: RootState) => state.userinfo);
  const [curPokeId, setCurPokeId] = useState<number>(pokemonId);
  const [selectedPokemon, setSelectedPokemon] = useState<boolean>(true);
  const [visibleList, setVisibleList] = useState<string>('Stats_listt');
  const [page, setPage] = useState<number>(1);
  const pokemonGifRef = useRef<HTMLImageElement>(null);
  const [activeButton, setActiveButton] = useState<string>('Stats_list');
  const [pokemonname, setPokemonname] = useState('');

  const itemsPerPage = 50;

  const handleUpdate = async (poke_id: number) => {
    let 결과 = await updateMyPokemon(poke_id);
    if (결과.result == 'success') {
      dispatch(setPokemonId(poke_id));
    }
  };

  const fetchPokeBook = async () => {
    try {
      const res = await showPokemonBook();
      return res;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const renderPageButtons = () => {
    const totalItems =
      visibleList === 'Stats_list' ? allPokemons.length : gatchPokemons.length;
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
    if (name === 0) {
      setPokemonname('???');
    } else {
      setPokemonname(await pokemonName(name));
    }
  };

  const displayedItems =
    visibleList === 'Stats_list'
      ? getPagedItems(allPokemons, page)
      : getPagedItems(gatchPokemons, page);

  useEffect(() => {
    setCurPokeId(pokemonId);
    //pokemonnameSet(pokemonId);
    //console.log(pokemonname);
  }, [pokemonId]);

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
  };

  useEffect(() => {
    fetchPokeBook().then((res) => {
      const ParseData = res.book;
      if (ParseData.length > 0) {
        const defaultPokemon = Array.from({ length: 649 }, (_, index) => ({
          poke_id: index + 1,
          poke_Lv: 0,
          poke_Exp: 0,
        }));
        const GatchaPokemon = [];
        for (let i = 0; i < ParseData.length; i++) {
          const item = ParseData[i];
          defaultPokemon[item.poke_id - 1] = item; // ID를 인덱스에 맞게 설정
          GatchaPokemon.push(item);
        }
        setAllPokemons(defaultPokemon);
        setGatchPpokemons(GatchaPokemon);
      } else {
        setAllPokemons([]);
        setGatchPpokemons([]);
      }
    });
  }, []);

  return (
    <MainWrapper>
      <PokeMonView>
        <PokemonGif
          ref={pokemonGifRef}
          src={'/' + curPokeId + '.gif'}
          onLoad={() => {
            setFilter();
          }}
        ></PokemonGif>
        <PokemonName>
          {' '}
          {curPokeId}. {pokemonname}{' '}
        </PokemonName>
      </PokeMonView>
      <ListWrap>
        <ButtonGroup>
          {/* <SelectBtn
            active={activeButton === 'Stats_list'}
            onClick={() => {
              setVisibleList('Stats_list');
              setActiveButton('Stats_list');
            }}
            style={{height:'30px', padding:'0 31.2px'}}
          >
            전체
          </SelectBtn> */}
          <SelectBtn
            active={activeButton === 'water_list'}
            onClick={() => {
              setVisibleList('water_list');
              setActiveButton('water_list');
            }}
          >
            <Icon src={waterIcon}></Icon>
          </SelectBtn>
          <SelectBtn
            active={activeButton === 'fire_list'}
            onClick={() => {
              setVisibleList('fire_list');
              setActiveButton('fire_list');
            }}
          >
            <Icon src={fireIcon}></Icon>
          </SelectBtn>
          <SelectBtn
            active={activeButton === 'grass_list'}
            onClick={() => {
              setVisibleList('grass_list');
              setActiveButton('grass_list');
            }}
          >
            <Icon src={grassIcon}></Icon>
          </SelectBtn>
          <SelectBtn
            active={activeButton === 'electronic_list'}
            onClick={() => {
              setVisibleList('electronic_list');
              setActiveButton('electronic_list');
            }}
          >
            <Icon src={electricIcon}></Icon>
          </SelectBtn>
          <SelectBtn
            active={activeButton === 'psychic_list'}
            onClick={() => {
              setVisibleList('psychic_list');
              setActiveButton('psychic_list');
            }}
          >
            <Icon src={psychicIcon}></Icon>
          </SelectBtn>
        </ButtonGroup>
        <ListView>
          {visibleList === 'all_list' &&
            displayedItems.map((item, index) => (
              <Item
                key={index}
                onClick={() => {
                  setCurPokeId(item.poke_id);
                  setSelectedPokemon(item.poke_Lv !== 0);
                  handleUpdate(item.poke_id);
                }}
              >
                {(() => {
                  return (
                    <BookText>
                      <div>
                        <p style={{ padding: '20px 0' }}>No. {item.poke_id}</p>
                        <Pokemon
                          src={
                            item.poke_Lv === 0
                              ? '/poke-ball.png'
                              : `/dw/${item.poke_id}.svg`
                          }
                        />
                      </div>
                      <div>
                        {item.poke_Lv > 0 ? (
                          <p>Level: {item.poke_Lv}</p>
                        ) : (
                          <p> ??? </p>
                        )}
                        {item.poke_Lv > 0 ? (
                          <p>Exp: {item.poke_Exp}</p>
                        ) : (
                          <p> </p>
                        )}
                      </div>
                    </BookText>
                  );
                })()}
              </Item>
            ))}
          {visibleList === 'water_list' &&
            gatchPokemons.map((item, index) => (
              <Item
                key={index}
                onClick={() => {
                  setCurPokeId(item.poke_id);
                  setSelectedPokemon(true);
                  handleUpdate(item.poke_id);
                }}
              >
                {(() => {
                  return (
                    <BookText>
                      <div>
                        <p style={{ padding: '10px' }}>No. {item.poke_id}</p>
                        <Pokemon
                          src={
                            item.poke_Lv === 0
                              ? '/poke-ball.png'
                              : `/dw/${item.poke_id}.svg`
                          }
                        />
                      </div>
                      <div>
                        <p>Level: {item.poke_Lv}</p>
                        <p>Exp: {item.poke_Exp}</p>
                      </div>
                    </BookText>
                  );
                })()}
              </Item>
            ))}
        </ListView>
        <PageBtnGroup>{renderPageButtons()}</PageBtnGroup>
      </ListWrap>
    </MainWrapper>
  );
};

const PokemonName = styled.div`
  position: absolute;
  background-color: #1e293b;
  font-size: 1.4rem;
  font-weight: bold;
  width: 50%;
  height: 8%;
  text-align: center;
  line-height: 1.8;
  border-radius: 10px;
  left: 25%;
  color: #cbd5e1;
  bottom: 5%;
`;

const Icon = styled.img`
  width: 35px;
  box-sizing: border-box;
  padding-top: 5px;
`;

const BookText = styled.div`
  color: #cbd5e1;
  font-size: 1rem;
  font-weight: bold;
`;

const PageButton = styled.button<{ active: boolean }>`
  width: 30px;
  margin-right: 10px;
  border-bottom: ${({ active }) =>
    active ? '2px solid #ff79c6' : 'transparent'};
  color: ${({ active }) => (active ? '#50fa7b' : '#cbd5e1')};
  background-color: transparent;

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
  padding: 0px 31.2px;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 1.1rem;
  line-height: 1.75;
  text-transform: uppercase;
  transition: background-color 0.3s;
  background-color: #1e293b;
  border-bottom: ${({ active }) =>
    active ? '2px solid #38BDF8' : '2px solid #1E293B'};
  background-color: ${({ active }) => (active ? '#1E293B' : '#38455a9b')};
  color: ${({ active }) => (active ? '#38BDF8' : '#8ea5af')};
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
  background-color: #97b1db2b;
  border: none;
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
  background-color: #1e293b;
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
