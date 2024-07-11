import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setElapsedTime, resetElapsedTime } from '../../store/timerSlice';
import getDetails from "./getDetails";
import { ProblemDetails, ResizableTabsProps } from "./index";
import { RootState } from '../../store/index';



const ProblemText : React.FC<ResizableTabsProps> = ({id}) => {
  const [problemDetails, setProblemDetails] = useState<ProblemDetails | null>(null);
  // const [elapsedTime, setElapsedTime] = useState<number>(0);

  const dispatch = useDispatch();
  const elapsedTime = useSelector((state: RootState) => state.timer.elapsedTime);


  const fetchCrawlData = async () => {

    try {
      const res: ProblemDetails = await getDetails(id);
      return res; // 객체 형태의 데이터를 반환
    } catch (error) {
      console.error('Error fetching data:', error);
      return null; // 에러 발생 시 null 반환
    }
  };

  const parseDescription = (description : string) => {
    // '$text$'를 '<i>text</i>'로 변환
    const italicBoldText = description.replace(/\$(.*?)\$/g, '<i><b>$1</b></i>');
    const pPadding = italicBoldText.replace(/<p(.*?)>/g, '<p$1 style="padding: 15px 0;" />');
    const imgWithWidth = pPadding.replace(/<img(.*?)>/g, '<img$1 style=" width: 65%" />')
    return imgWithWidth;
  };
  
  useEffect(() => {
    fetchCrawlData().then((res)=> {
      if (res) {
        setProblemDetails(res);
      }
    });

    // 타이머 시작
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      dispatch(setElapsedTime(elapsed));

    }, 1000);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      clearInterval(timer);
      dispatch(resetElapsedTime());
    }

  }, [id])

  // 경과 시간을 시:분:초 형식으로 변환
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

 return (
    <div style = {{height: '100%'}}>
      <Header>
        {problemDetails && (
          <HeaderTxt> 
            <Timer>{id}번 {problemDetails.title}</Timer>
            <Timer>{formatTime(elapsedTime)}</Timer>
            <div>
              <HeaderBtn> 코드 리뷰 요청</HeaderBtn>
              <HeaderBtn> 힌트 보기 </HeaderBtn>
            </div>
          </HeaderTxt>
        )}
      </Header>
      <Wrap>
        {problemDetails && (
        <ProblemWrap>
          <InoutWrap>
            <TextBox> 문제</TextBox>
            <Hr/>
            <p style = {{margin: '10px 0'}} dangerouslySetInnerHTML={{ __html: parseDescription(problemDetails.description) }} />
          </InoutWrap>

          <InoutWrap>
            <TextBox>입력</TextBox>
            <Hr/>
            <p  dangerouslySetInnerHTML={{ __html: parseDescription(problemDetails.input) }} />
          </InoutWrap>
          
          <InoutWrap>
            <TextBox>출력</TextBox>
            <Hr/>
             <p  dangerouslySetInnerHTML={{ __html: parseDescription(problemDetails.output) }} />
          </InoutWrap>
          
          <InoutWrap>
              {problemDetails.samples.map((sample, index) => (
                <div key={index}>
                  <TextBox> 예시 {index + 1} </TextBox>
                  <Hr style={{width: '8%'}}/>
                  <ExampleWrap>
                    <Example>
                      <p style={{margin: '10px'}}>입력</p>
                      <Exampletxt>{sample.input}</Exampletxt>
                    </Example>
                    <Example>
                      <p style={{margin: '10px'}}>출력</p>
                      <Exampletxt>{sample.output}</Exampletxt>
                    </Example>
                  </ExampleWrap>
                </div>
              ))}
          </InoutWrap>
          
        </ProblemWrap>
      )}
      </Wrap>
      
    </div>
  );
};

const Wrap = styled.div`
  height: calc(100% - 60px);
  overflow: auto;
`;

const Header = styled.div`
  position: relative;
  height: 60px;
  
  background-color: transparent;
  border-bottom: 2px solid #b6b5b546;
  color: white;
  font-weight: bold;
  
`;

const HeaderBtn = styled.button`
  padding: 5px 15px;
  border-radius: 30px;
  font-weight: bold;
  margin-left: 10px;
`;

const HeaderTxt = styled.div`
  display: flex;
  line-height: 60px;
  font-size: 1.2rem;
  color: white;
  justify-content: space-around;
`;

const Timer = styled.p`
  margin-left: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap
`;

const ProblemWrap = styled.div`
  box-sizing: border-box;
  padding: 1% 6%;
  color: #ffffff;
  font-size: 1.1rem;
  
`;

const InoutWrap = styled.div`
  width: 100%;
  margin-top: 5%;

`;

const Hr = styled.hr`
  border-color: #55e79e;
  margin: 10px 0 10px 0;
  width: 6%;
`;

const TextBox = styled.span`
  font-weight: bold;
  padding: 1px 7px;
  border-radius: 7px;
`;

const ExampleWrap = styled.div`
  display: flex;
 
  /* & > * :nth-child(1)>p pre{
    margin: 0 0 0 0px;
  }
  & > *:nth-child(2)>p pre{
    margin: 0 20px 0 20px;
  } */
`;

const Exampletxt = styled.pre`
  background-color: #b9b9b92f;
  padding: 3%;
  box-sizing: border-box;
  overflow: auto;
`;

const Example = styled.pre`
  width: 40%; 
  margin: 0 5% 5% 0;


`;



export default ProblemText;
