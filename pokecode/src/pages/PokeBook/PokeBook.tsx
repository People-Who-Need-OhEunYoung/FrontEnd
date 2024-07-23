import styled from 'styled-components';
import { MainWrapper } from '../../components/MainWrapper';
import background from '../../assets/images/ChatBG4.jpg';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  defaults,
} from 'chart.js';

import sourceData from '../../data/sourceData.json';
import { Bar, Radar } from 'react-chartjs-2';
import waterIcon from '../../assets/images/물.png';
import fireIcon from '../../assets/images/불.png';
import grassIcon from '../../assets/images/풀.png';
import electricIcon from '../../assets/images/전기.png';
import psychicIcon from '../../assets/images/에스퍼.png';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { pokemonName, showPokemonBook } from '../../utils/api/api';
import { setPokemonId } from '../../store/userInfo';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement
);

defaults.maintainAspectRatio = false;
defaults.responsive = true;

const PokeBook = () => {
  const chartRef = useRef<ChartJS<'bar'> | null>(null);
  const [type, setType] = useState<number>(1);
  const [sortedPoketmon, setSortedPoketmon] = useState<any[]>([]);
  const [allPoketmon, setAllPoketmon] = useState<any[]>([]);
  const [ownPoketmon, setOwnPoketmon] = useState<any[]>([]);
  const [hoveredType, setHoveredType] = useState<number | null>(null);

  const iconArr = [fireIcon, waterIcon, grassIcon, electricIcon, psychicIcon];
  const typeArr = ['구현', '그래프', '자료구조', '수학', 'DP'];
  const { user } = useSelector((state: RootState) => state.userinfo);
  const [curpokegif, setCurpokegif] = useState<string>(
    `/${user.cur_poke_id}.gif`
  );

  const [selectedPokemon, setSelectedPokemon] = useState<number>(
    user.cur_poke_id
  );
  const [pokemonname, setPokemonname] = useState<string>();
  const [curType, setCurType] = useState<number>(0);

  const dispatch = useDispatch();

  const fetchPokemonData = async () => {
    try {
      const res = await showPokemonBook();
      return res;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const pokemonnameSet = async (name: number) => {
    setPokemonname(await pokemonName(name));
  };

  //모든 포켓몬은 한번만 불러옴.
  useEffect(() => {
    fetchPokemonData().then((res) => {
      setAllPoketmon(res.allPoketmon);
      setOwnPoketmon(res.book);
      const currentPokemon = res.book.find(
        (pokemon: any) => pokemon.poke_id === user.cur_poke_id
      );
      if (currentPokemon) {
        const typeIndex = typeArr.indexOf(currentPokemon.poke_type);
        if (typeIndex !== -1) {
          setType(typeIndex + 1); // setType은 1-based index 사용
          setCurType(typeIndex + 1);
        }
      }
    });
    pokemonnameSet(user.cur_poke_id);
  }, []);

  //선택한 타입이 바뀔 때, 선택된 타입의 포켓몬 정렬
  useEffect(() => {
    const filteredPoketmon = allPoketmon.filter(
      (pokemon: any) => pokemon.poke_type === typeArr[type - 1]
    );
    // poke_eval에 따라 오름차순으로 정렬
    const sortedPoketmon = filteredPoketmon.sort(
      (a: { poke_eval: number }, b: { poke_eval: number }) =>
        a.poke_eval - b.poke_eval
    );
    console.log('sortedPoketmon', sortedPoketmon);
    setSortedPoketmon(sortedPoketmon);
  }, [type, allPoketmon]);

  useEffect(() => {
    const chart = chartRef.current;
    if (chart && chart.ctx) {
      const ctx = chart.ctx;
      const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
      gradient.addColorStop(0, '#6365f1a7');
      gradient.addColorStop(0.5, '#38BDF8');
      gradient.addColorStop(1, 'rgba(25, 28, 241, 0.5)');
      chart.data.datasets[0].backgroundColor = gradient;
      chart.update();
    }
  }, [type]);

  const HandleChangePokemon = () => {
    if (selectedPokemon) {
      dispatch(setPokemonId(selectedPokemon));
      console.log('selectedPokemon', selectedPokemon);
    }
  };

  const isOwned = (pokemonId: number) =>
    ownPoketmon.some((own) => own.poke_id === pokemonId);

  return (
    <MainWrapper>
      <MainContents>
        <ButtonGroup>
          {iconArr.map((icon, index) => (
            <TypeBtn
              key={index}
              back_img={icon}
              onMouseEnter={() => setHoveredType(index)}
              onMouseLeave={() => setHoveredType(null)}
              onClick={() => {
                setType(index + 1);
              }}
            >
              {hoveredType === index && (
                <HoverInfo>{typeArr[hoveredType]}</HoverInfo>
              )}
            </TypeBtn>
          ))}
        </ButtonGroup>
        <PokeMonViewWrap>
          <Titled> 도감 정보 </Titled>
          <PokeMonView>
            <PokeMonInfoWrap>
              <PokeMonType back_img={iconArr[curType - 1]}></PokeMonType>
              <PokeMonName>{pokemonname}</PokeMonName>
            </PokeMonInfoWrap>
            <PokemonWrap>
              <Pokemon src={curpokegif} />
            </PokemonWrap>
          </PokeMonView>
          <CurPokeMonSelect
            onClick={() => {
              HandleChangePokemon();
            }}
          >
            현재 포켓몬으로 설정
          </CurPokeMonSelect>
        </PokeMonViewWrap>
        <Contents>
          <ExpInfoWrap>
            <RestExp>진화까지 남은 경험치 - 000 </RestExp>
            <ExpBar>
              <Bar
                ref={chartRef}
                data={{
                  labels: [sourceData[type - 1].label], // 첫 번째 인덱스의 라벨
                  datasets: [
                    {
                      label: sourceData[type - 1].label, // 첫 번째 인덱스의 라벨
                      data: [sourceData[type - 1].value], // 첫 번째 인덱스의 값
                      borderColor: '#000000', // 선 색
                      borderRadius: 5,
                    },
                  ],
                }}
                options={{
                  indexAxis: 'y',
                  scales: {
                    x: {
                      min: 0,
                      max: 120,
                      ticks: {
                        color: '#ffffff', // x축 눈금 색상
                        display: true, // x축 눈금 숨기기
                      },
                      grid: {
                        display: true, // x축 그리드 숨기기
                      },
                    },
                    y: {
                      ticks: {
                        display: false, // y축 눈금 숨기기
                      },
                      grid: {
                        display: false, // y축 그리드 숨기기
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false, // 범례 숨기기
                    },
                  },
                }}
              />
            </ExpBar>
          </ExpInfoWrap>
          <EvalTree>
            {sortedPoketmon.slice(0, 3).map((pokemon) => (
              <PokemonCard
                key={pokemon.idx}
                back_img={pokemon.poke_profile_img}
                isOwned={isOwned(pokemon.idx)}
                onClick={
                  isOwned(pokemon.idx)
                    ? () => {
                        setCurpokegif(pokemon.poke_img);
                        setSelectedPokemon(pokemon.idx);
                        setPokemonname(pokemon.poke_name);
                        setCurType(type);
                      }
                    : undefined
                }
              />
            ))}
            <PokemonLegendTree>
              {sortedPoketmon.slice(3, 6).map((pokemon) => (
                <PokemonCard
                  key={pokemon.idx}
                  back_img={pokemon.poke_profile_img}
                  isOwned={isOwned(pokemon.idx)}
                  onClick={
                    isOwned(pokemon.idx)
                      ? () => {
                          setCurpokegif(pokemon.poke_img);
                          setSelectedPokemon(pokemon.idx);
                          setPokemonname(pokemon.poke_name);
                        }
                      : undefined
                  }
                />
              ))}
            </PokemonLegendTree>
          </EvalTree>
        </Contents>
        <GraphWrap>
          <RaderGraph>
            <Radar
              data={{
                labels: sourceData.map((data) => data.label),
                datasets: [
                  {
                    label: 'Count',
                    data: sourceData.map((data) => data.value),
                    fill: true,
                    backgroundColor: 'rgba(47, 50, 255, 0.2)', // 배경색
                    borderColor: '#38BDF8 ', // 선 색
                  },
                ],
              }}
              options={{
                scales: {
                  r: {
                    angleLines: {
                      color: '#b9b9b9', // 방사형 각도선 색상
                    },
                    grid: {
                      color: '#b9b9b9', // 방사형 그리드선 색상
                    },
                    pointLabels: {
                      color: '#f5f5f5', // 라벨 폰트 색상
                      font: {
                        size: 20, // 라벨 폰트 사이즈
                        weight: 'bold',
                      },
                    },
                    min: 0, // 최소값
                    ticks: {
                      color: '#ffffff', // 눈금 폰트 색상
                      backdropColor: 'transparent',
                      font: {
                        size: 14, // 눈금 폰트 사이즈
                      },
                      stepSize: 10, // 눈금 단위
                    },
                  },
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </RaderGraph>
          <AlertBadge>DP 문제에 더 분발해보세요!! </AlertBadge>
          <BarGraph>
            <Bar
              data={{
                labels: sourceData.map((data) => data.label),
                datasets: [
                  {
                    label: 'Count',
                    data: sourceData.map((data) => data.value),
                    borderColor: '#6366F1', // 선 색
                    backgroundColor: '#38bff8ce ', // 막대 배경색
                    borderRadius: 7,
                  },
                ],
              }}
              options={{
                indexAxis: 'y',
                scales: {
                  x: {
                    ticks: {
                      color: '#ffffff', // x축 눈금 색상
                      font: {
                        size: 20, // x축 눈금 폰트 사이즈
                      },
                    },
                  },
                  y: {
                    ticks: {
                      color: '#ffffff', // y축 눈금 색상
                      font: {
                        size: 20, // y축 눈금 폰트 사이즈
                      },
                    },
                  },
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    enabled: false,
                    external: function (context) {
                      // Tooltip Element
                      let tooltipEl =
                        document.getElementById('chartjs-tooltip');

                      // Create element on first render
                      if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-tooltip';
                        tooltipEl.style.opacity = '0';
                        tooltipEl.style.position = 'absolute';
                        tooltipEl.style.pointerEvents = 'none';
                        tooltipEl.style.transition = 'opacity 0.3s';
                        document.body.appendChild(tooltipEl);
                      }

                      // Hide if no tooltip
                      const tooltipModel = context.tooltip;
                      if (tooltipModel.opacity === 0) {
                        tooltipEl.style.opacity = '0';
                        return;
                      }

                      // Set Text
                      if (tooltipModel.body) {
                        const bodyLines = tooltipModel.body.map(
                          (bodyItem: any) => bodyItem.lines
                        );

                        let innerHtml = '<div>';

                        bodyLines.forEach((body: any, i: number) => {
                          const index = tooltipModel.dataPoints[i].dataIndex;
                          const icon = iconArr[index % iconArr.length];
                          innerHtml += `
                            <div style="display: flex; align-items: center; background-color: #00000071; padding: 10px 10px;">
                              <img src="${icon}" alt="icon" style="width: 24px; height: 24px; border-radius: 5px; margin-right: 8px;" />
                              <p style="color: white; margin: 0;">${body}</p>
                            </div>
                          `;
                        });

                        innerHtml += '</div>';

                        tooltipEl.innerHTML = innerHtml;
                      }

                      const position =
                        context.chart.canvas.getBoundingClientRect();

                      tooltipEl.style.opacity = '1';
                      tooltipEl.style.left =
                        position.left +
                        window.pageXOffset +
                        tooltipModel.caretX +
                        'px';
                      tooltipEl.style.top =
                        position.top +
                        window.pageYOffset +
                        tooltipModel.caretY +
                        'px';
                    },
                  },
                },
              }}
            />
          </BarGraph>
        </GraphWrap>
      </MainContents>
    </MainWrapper>
  );
};

const MainContents = styled.div`
  width: 100%;
  height: 90%;
  display: flex;
  align-items: center;
`;

//타입 선택 그룹
const ButtonGroup = styled.div`
  width: 8%;
  height: 70%;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  justify-content: center;
  justify-items: center;
`;

//어떤 타입 선택할건지?
const TypeBtn = styled.button<{ back_img: string }>`
  width: 60%;
  margin: 15px;
  border-radius: 10px;
  background: ${(props) => `url(${props.back_img}) no-repeat`};
  background-size: 100% 100%;
  text-align: center;
  border: 2px solid #111826;
  position: relative;
  &:hover {
    border: 2px solid white;
  }
  &:focus {
    border: 2px solid white;
    box-shadow: 0 0 10px 5px white;
  }
`;

const HoverInfo = styled.div`
  position: absolute;
  background-color: black;
  border: 2px solid white;
  color: white;
  border-radius: 5px;
  font-size: 1.5rem;
  font-weight: bold;
  transform: translateX(-50%);
  left: -150%;
  top: -10%;
  padding: 20px;
  z-index: 10;
`;

//현재 포켓몬이 보이는 창
const PokeMonViewWrap = styled.div`
  width: 20%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

//도감 정보
const Titled = styled.div`
  width: 80%;
  background-color: #32405640;
  height: 50px;
  color: #d3dde8;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20%;
  border-radius: 10px;
  font-size: 1.3rem;
  font-weight: bold;
`;

//포켓몬 정보
const PokeMonView = styled.div`
  width: 80%;
  height: 55%;
  background-color: #324056;
  border-radius: 15px;
  border: 2px solid transparent;
  position: relative;
  background: url(${background}) no-repeat;
  background-size: cover;
`;

//위에 타입 + 이름  wrap
const PokeMonInfoWrap = styled.div`
  width: 100%;
  height: 50px;
  background-color: #324056;
  display: flex;
  align-items: center;
  border-radius: 10px 10px 0 0;
`;

//포켓몬 타입 이미지
const PokeMonType = styled.div<{ back_img: string }>`
  width: 50px;
  height: 50px;
  background: ${(props) => `url(${props.back_img}) no-repeat`};
  background-size: 100% 100%;
  text-align: center;
  border-radius: 5px;
`;

//포켓몬 이름
const PokeMonName = styled.p`
  color: #ffffff;
  margin: auto;
`;

const PokemonWrap = styled.div`
  transform: translateX(-50%);
  position: absolute;
  bottom: 35%;
  left: 50%;
`;

//포켓몬 이미지
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
  transform: scale(2.5);
`;

//현재 포켓몬으로 설정 버튼
const CurPokeMonSelect = styled.button`
  width: 90%;
  height: 50px;
  margin: 6%;
  background-color: #6365f163;
  border: 2px solid #6366f1;
  border-radius: 10px;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;

  &:hover {
    border: 2px solid white;
  }
  &:focus {
    border: 2px solid white;
    background-color: #7f81f662;
  }
`;

//포켓몬 도감 트리 보이는 창
const Contents = styled.div`
  width: 45%;
  height: 90%;
  background-color: #324056;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  overflow: auto;
`;

//경험치 바 + 남은 경험치 텍스트 정보
const ExpInfoWrap = styled.div`
  width: 90%;
  height: 15%;
`;

const RestExp = styled.p``;

const ExpBar = styled.div`
  width: 100%;
  height: 60px;
`;

//경험치 트리창
const EvalTree = styled.div`
  width: 90%;
  height: 75%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
`;

const PokemonCard = styled.div<{ back_img: string; isOwned: boolean }>`
  margin: 10px;
  height: 120px;
  border-radius: 20px;
  background: ${(props) => `url(${props.back_img}) no-repeat center center`};
  background-color: #2e2e2e75;
  background-size: 60% 60%;
  filter: ${(props) => (props.isOwned ? 'none' : 'brightness(0.01)')};
`;

const PokemonLegendTree = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
`;

//그래프 정보
const GraphWrap = styled.div`
  width: 30%;
  height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

//레이더 그래프
const RaderGraph = styled.div`
  width: 90%;
  height: 45%;
`;

//알람 정보
const AlertBadge = styled.div`
  width: 80%;
  height: 30px;
  margin: 3%;
  border-radius: 10px;
  background-color: #38bff840;
  border: 3px solid #38bdf8;
  text-align: center;
  line-height: 30px;
  font-weight: bold;
`;

//막대 그래프
const BarGraph = styled.div`
  width: 80%;
  height: 45%;
`;

export default PokeBook;
