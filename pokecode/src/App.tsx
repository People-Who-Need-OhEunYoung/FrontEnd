import styled from 'styled-components';
import { Header } from './components/Header';

function App() {
  return (
    <>
      <Header></Header>
      <AppWrapper>test</AppWrapper>
    </>
  );
}
const AppWrapper = styled.div`
  color: red;
`;
export default App;
