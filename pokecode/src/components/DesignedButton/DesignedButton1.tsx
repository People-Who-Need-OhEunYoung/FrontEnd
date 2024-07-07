import styled from 'styled-components';
const DesignedButton1 = styled.button<{ color: string }>`
  position: relative;
  color: white;
  width: 60%;
  margin: 5px 20%;
  padding: 0.5em 2em;
  font-size: 1.2em;
  border-radius: 30px;
  background-color: ${(props: any) =>
    props.color ? props.color : 'cadetblue'};
  border: none;
  cursor: pointer;
`;
export default DesignedButton1;
