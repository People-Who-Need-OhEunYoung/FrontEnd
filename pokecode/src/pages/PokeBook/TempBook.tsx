import styled from 'styled-components';
import { MainWrapper } from '../../components/MainWrapper';
// import background from '../../assets/images/background2.jpg';
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
import { Bar , Radar} from 'react-chartjs-2';
import waterIcon from '../../assets/images/물.png';
import fireIcon from '../../assets/images/불.png';
import grassIcon from '../../assets/images/풀.png';
import electricIcon from '../../assets/images/전기.png';
import psychicIcon from '../../assets/images/에스퍼.png';
import { useEffect, useRef, useState } from 'react';


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

const TempBook = () => {

  const chartRef = useRef<ChartJS<'bar'> | null>(null);
  const [type, setType] = useState<number>(1);
  const iconArr = [fireIcon, waterIcon, grassIcon, electricIcon, psychicIcon];

  useEffect(() => {
    const chart = chartRef.current;
    if (chart && chart.ctx) {
      const ctx = chart.ctx;
      const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
      gradient.addColorStop(0, '#6366F1');
      gradient.addColorStop(0.5, '#38BDF8');
      gradient.addColorStop(1, 'rgba(25, 28, 241, 0.5)');
      chart.data.datasets[0].backgroundColor = gradient;
      chart.update();
    }
  }, [type]);

  return (
    <MainWrapper>
      <MainContents>
        <ButtonGroup>
          <TypeBtn
            back_img={fireIcon}
            onClick={() => {
              setType(1);
            }}
          />
          <TypeBtn
            back_img={waterIcon}
            onClick={() => {
              setType(2);
            }}
          />
          <TypeBtn
            back_img={grassIcon}
            onClick={() => {
              setType(3);
            }}
          />
          <TypeBtn
            back_img={electricIcon}
            onClick={() => {
              setType(4);
            }}
          />
          <TypeBtn
            back_img={psychicIcon}
            onClick={() => {
              setType(5);
            }}
          />
        </ButtonGroup>
        <PokeMonViewWrap>
          <Titled> 도감 정보 </Titled>
          <PokeMonView>
            <PokeMonInfoWrap>
              <PokeMonType back_img={iconArr[type - 1]}></PokeMonType>
              <PokeMonName>포켓몬 이름</PokeMonName>
            </PokeMonInfoWrap>
          </PokeMonView>
          <CurPokeMonSelect>현재 포켓몬으로 설정</CurPokeMonSelect>
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
                      borderColor: '#6366F1', // 선 색
                      backgroundColor: 'rgb(99, 101, 241)', // 막대 배경색
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
            <PokemonCard />
            <PokemonCard />
            <PokemonCard />
            <PokemonLegendTree>
              <PokemonCard />
              <PokemonCard />
              <PokemonCard />
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
                        size: 16, // 라벨 폰트 사이즈
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
                        size: 14, // x축 눈금 폰트 사이즈
                      },
                    },
                  },
                  y: {
                    ticks: {
                      color: '#ffffff', // y축 눈금 색상
                      font: {
                        size: 14, // y축 눈금 폰트 사이즈
                      },
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
  background-size: cover;
  text-align: center;
  border: 2px solid #000000;
  &:hover {
    border: 2px solid white;
  }
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
  color: #D3DDE8;
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
  border-radius: 10px;
  border: 2px solid #000000;
`;

//위에 타입 + 이름  wrap
const PokeMonInfoWrap = styled.div`
  width: 100%;
  height: 50px;
  background-color: #111826;
  display: flex;
  align-items: center;
  border-radius: 10px 10px 0 0;
  border: 2px solid #000000;
`;

//포켓몬 타입 이미지
const PokeMonType = styled.div<{ back_img: string }>`
  width: 50px;
  height: 60px;
  background: ${(props) => `url(${props.back_img}) no-repeat`};
  background-size: cover;
  text-align: center;
`;

//포켓몬 이름
const PokeMonName = styled.p`
  color: #ffffff;
  margin: auto;
`;

//현재 포켓몬으로 설정 버튼
const CurPokeMonSelect = styled.button`
  width: 70%;
  height: 40px;
  margin: 6%;
  background-color: #6366f1;
  border-radius: 10px;
  color: white;
  font-size: 0.9rem;
  font-weight: bold;
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
`;

//경험치 바 + 남은 경험치 텍스트 정보
const ExpInfoWrap = styled.div`
  width: 90%;
  height: 15%;
`;

const RestExp = styled.p`
`;

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

const PokemonCard = styled.div`
  background-color: #2e2e2e;
  margin: 10px;
  height: 120px;
  border-radius: 20px;
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
  //transform: scale(1.6);
  /* border: 2px solid white; */
  width: 40px;
  margin-top: 20%;
`;

export default TempBook;
