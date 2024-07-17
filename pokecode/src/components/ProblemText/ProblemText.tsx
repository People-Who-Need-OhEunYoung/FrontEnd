import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setElapsedTime,
  resetElapsedTime,
  setStartTime,
} from '../../store/timerSlice';
import getDetails from './getDetails';
import { ProblemDetails, ResizableTabsProps } from './index';
import { RootState } from '../../store/index';
import { setAcquireReview } from '../../store/problemSlice';
import Modal from '../../components/Modal/Modal';
import { useNavigate } from 'react-router-dom';

const ProblemText: React.FC<ResizableTabsProps> = ({
  id,
  isShowHeader = 'true',
  size = '100%',
}) => {
  const [problemDetails, setProblemDetails] = useState<ProblemDetails | null>(
    null
  );

  const dispatch = useDispatch();
  const { startTime, elapsedTime, limitTime } = useSelector(
    (state: RootState) => state.timer
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const fetchCrawlData = async () => {
    try {
      const res: ProblemDetails = await getDetails(id);
      return res; // 객체 형태의 데이터를 반환
    } catch (error) {
      console.error('Error fetching data:', error);
      return null; // 에러 발생 시 null 반환
    }
  };

  const parseDescription = (description: string) => {
    // '$text$'를 '<i>text</i>'로 변환
    const italicBoldText = description.replace(
      /\$(.*?)\$/g,
      '<i><b>$1</b></i>'
    );
    const pPadding = italicBoldText.replace(
      /<p(.*?)>/g,
      '<p$1 style="padding: 15px 0;" />'
    );
    const imgWithWidth = pPadding.replace(
      /<img(.*?)>/g,
      '<img$1 style=" width: 65%" />'
    );
    return imgWithWidth;
  };

  useEffect(() => {
    dispatch(setStartTime(Date.now()));
  }, []);

  useEffect(() => {
    const storedSolvedTime = localStorage.getItem(`solvedTime-${id}`);
    let start_time = Date.now(); //시작 시간 설정

    if (storedSolvedTime) {
      //저장된 시간이 있을 경우
      const solvedData = JSON.parse(storedSolvedTime);
      const updateElapsedTime =
        solvedData.elapsed_time + Math.floor((Date.now() - start_time) / 1000);
      dispatch(setElapsedTime(updateElapsedTime));
    } else {
      localStorage.setItem(
        `solvedTime-${id}`,
        JSON.stringify({
          _id: id,
          start_time: start_time,
          elapsed_time: 0,
          limit_time: limitTime,
        })
      );
    }

    const interval = setInterval(() => {
      if (startTime !== null) {
        const newElapsedTime =
          Math.floor((Date.now() - start_time) / 1000) + elapsedTime;
        dispatch(setElapsedTime(newElapsedTime));

        localStorage.setItem(
          `solvedTime-${id}`,
          JSON.stringify({
            _id: id,
            start_time,
            elapsed_time: newElapsedTime,
            limit_time: limitTime,
          })
        );
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, id]);

  useEffect(() => {
    fetchCrawlData().then((res) => {
      if (res) {
        setProblemDetails(res);
      }
    });
  }, []);

  // 경과 시간을 시:분:초 형식으로 변환
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div style={{ height: size }}>
      <Header isShowHeader={isShowHeader}>
        {problemDetails && (
          <HeaderTxt>
            <Title>
              {id}번 {problemDetails.title}
            </Title>
            <Timer
              istimerxceeded={(elapsedTime > limitTime).toString()}
              islimit={(limitTime > 0).toString()}
            >
              {formatTime(elapsedTime)}
            </Timer>
            <HeaderBtn
              style={{ height: '40%', margin: '15px' }}
              onClick={() => {
                dispatch(resetElapsedTime());
                localStorage.removeItem(`solvedTime-${id}`);
              }}
            >
              초기화
            </HeaderBtn>
            <div style={{ position: 'absolute', right: '3%' }}>
              <HeaderBtn
                onClick={() => {
                  dispatch(setAcquireReview(true));
                  // setIsModalOpen(true);
                  navigate(`/room?id=${id}&title=${problemDetails.title}`);
                }}
              >
                코드 리뷰 요청
              </HeaderBtn>
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
              <Hr />
              <p
                style={{ margin: '10px 0' }}
                dangerouslySetInnerHTML={{
                  __html: parseDescription(problemDetails.description),
                }}
              />
            </InoutWrap>
            <InoutWrap>
              <TextBox>입력</TextBox>
              <Hr />
              <p
                dangerouslySetInnerHTML={{
                  __html: parseDescription(problemDetails.input),
                }}
              />
            </InoutWrap>

            <InoutWrap>
              <TextBox>출력</TextBox>
              <Hr />
              <p
                dangerouslySetInnerHTML={{
                  __html: parseDescription(problemDetails.output),
                }}
              />
            </InoutWrap>

            <InoutWrap>
              {problemDetails.samples.map((sample, index) => (
                <div key={index}>
                  <TextBox> 예시 {index + 1} </TextBox>
                  <Hr style={{ width: '8%' }} />
                  <ExampleWrap>
                    <Example>
                      <p style={{ margin: '10px' }}>입력</p>
                      <Exampletxt>{sample.input}</Exampletxt>
                    </Example>
                    <Example>
                      <p style={{ margin: '10px' }}>출력</p>
                      <Exampletxt>{sample.output}</Exampletxt>
                    </Example>
                  </ExampleWrap>
                </div>
              ))}
            </InoutWrap>
          </ProblemWrap>
        )}
      </Wrap>
      <Modal
        title={''}
        prob_title={''}
        id={id}
        component={2}
        on={isModalOpen}
        event={setIsModalOpen}
      ></Modal>
    </div>
  );
};

const Wrap = styled.div`
  height: calc(100%);
  overflow: auto;
`;

const Header = styled.div<{ isShowHeader: string }>`
  position: relative;
  height: 60px;

  background-color: transparent;
  border-bottom: 2px solid #b6b5b546;
  color: white;
  font-weight: bold;
  display: ${(props) => (props.isShowHeader == 'true' ? 'block' : 'none')};
`;

const HeaderBtn = styled.button`
  padding: 5px 15px;
  border-radius: 30px;
  font-weight: bold;
  margin-left: 10px;
  &:hover {
    background-color: #4ea6ff;
  }
`;

const HeaderTxt = styled.div`
  display: flex;
  line-height: 60px;
  font-size: 1.2rem;
  color: white;
`;

const Title = styled.p`
  margin-left: 5%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Timer = styled.p<{ istimerxceeded: string; islimit: string }>`
  margin-left: 5%;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${(props) =>
    props.istimerxceeded == 'true' && props.islimit == 'true'
      ? 'red'
      : 'white'}; // 조건부 스타일
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
