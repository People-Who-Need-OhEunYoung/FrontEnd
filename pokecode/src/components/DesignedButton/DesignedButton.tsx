import styled from 'styled-components';

const DesignedButton = ({ event, text }: any) => {
  return (
    <Button onClick={event} type="button">
      {text}
    </Button>
  );
};

const Button = styled.button`
  display: inline-block;
  box-sizing: border-box;
  width: 9em;
  height: 2em;
  border: 1px solid #ffffff;
  background: rgba(0, 0, 0, 0);
  font-weight: 700;
  font-size: 1.5em;
  color: #ffffff;
  margin: 0.5em;
  @media (min-width: 1900px) {
    width: 12em;
    height: 2em;
    font-size: 1.5em;
  }
`;

export default DesignedButton;
