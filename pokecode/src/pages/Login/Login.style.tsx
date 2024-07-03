import styled from "styled-components";

export const Wrapper = styled.div`
  color: white;
  text-align: center;
  height: calc(100vh - 180px);
  transition: 1s;
  opacity: 0;
`;

export const ButtonDiv = styled.div`
  margin-top: 5%;
`;
export const H1 = styled.h1`
  color: white;
  font-size: 8rem;
  padding: 4% 0 4% 0;
  @media (max-width: 1600px) {
    padding: 3% 0 3% 0;
    font-size: 6rem;
  }
  @media (max-width: 550px) {
    padding: 1% 0 1% 0;
    font-size: 3rem;
  }
`;

export const P = styled.p`
  color: white;
  font-size: 3rem;
  font-weight: bold;
  @media (max-width: 1600px) {
    font-size: 2rem;
  }
  @media (max-width: 550px) {
    font-size: 1rem;
  }
`;