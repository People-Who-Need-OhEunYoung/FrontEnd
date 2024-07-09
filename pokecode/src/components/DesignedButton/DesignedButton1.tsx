import styled from 'styled-components';
const DesignedButton1 = styled.button<{ color: string }>`
  position: relative;
  color: white;
  width: 55%;
  margin: 10px 20%;
  padding: 0.3rem 1rem;
  font-size: 1.2em;
  border-radius: 30px;
  background-color: ${(props: any) =>
    props.color ? props.color : 'rgba(79, 70, 229, 1)'};
  border: none;
  box-sizing: border-box;
  cursor: pointer;
`;
export default DesignedButton1;
