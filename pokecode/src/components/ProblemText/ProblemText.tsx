import styled from 'styled-components';
import { useEffect, useState } from 'react';
import getDetails from "./getDetails";
import { ProblemDetails } from "./index";

interface ResizableTabsProps {
  id: string;
}

const ProblemText : React.FC<ResizableTabsProps> = ({id}) => {
  const [problemDetails, setProblemDetails] = useState<ProblemDetails | null>(null);

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
    const imgWithWidth = italicBoldText.replace(/<p(.*?)>/g, '<p$1 style="padding: 15px 0;" />');
    console.log(imgWithWidth)
    return imgWithWidth;
    
  };
  
  useEffect(() => {
    fetchCrawlData().then((res)=> {
      if (res) {
        setProblemDetails(res);
      }
      console.log(res);
    });
  }, [])
  
 return (
    <div>
      {problemDetails && (
        <ProblemWrap>
          <InoutWrap>
            <TextBox> 문제</TextBox>
            <Hr/>
            <p  style = {{margin: '10px 0'}} dangerouslySetInnerHTML={{ __html: parseDescription(problemDetails.description) }} />
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
    </div>
  );
};



const ProblemWrap = styled.div`
  box-sizing: border-box;
  height: 70%;
  padding: 1% 6%;
  color: #ffffff;
  font-size: 1.1rem;
  overflow: auto;
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
`;

const Example = styled.pre`
  width: 40%; 
  margin: 0 5% 5% 0;


`;



export default ProblemText;
