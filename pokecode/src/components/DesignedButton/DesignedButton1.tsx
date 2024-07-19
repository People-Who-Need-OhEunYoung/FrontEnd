import styled from 'styled-components';
const DesignedButton1 = styled.button<{ back_color?: string; color?: string }>`
  position: relative;
  color: ${(props) => props.color || 'white'};
  width: 55%;
  margin: 10px 20%;
  padding: 0.3rem 1rem;
  font-size: 1.2em;
  border-radius: 10px;
  background-color: ${(props) => props.back_color || '#324056'};
  border: 2px solid #d3dde82f;
  box-sizing: border-box;
  cursor: pointer;
`;
export default DesignedButton1;
