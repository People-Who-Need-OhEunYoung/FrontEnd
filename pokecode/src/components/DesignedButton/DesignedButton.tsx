import styled from 'styled-components';

const DesignedButton = ({ event, text }: any) => {
  return <Button onClick={event}>{text}</Button>;
};

const Button = styled.button`
  display: inline-block;
  box-sizing: border-box;
  width: 500px;
  height: 80px;
  border: 1px solid #ffffff;
  background: rgba(0, 0, 0, 0);
  margin: 0 1rem 0 1rem;
  font-weight: 700;
  font-size: 2rem;
  line-height: 36px;
  color: #ffffff;
  @media (max-width: 1900px) {
    width: 300px;
    height: 60px;
    font-size: 1rem;
  }
`;

export default DesignedButton;
