import { useState } from 'react';
import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';

const ModalContent1 = () => {
  const navigate = useNavigate();

  const gotoSolve = () => {
    navigate(`/room`);
  };

  return (
    <div style={{ width: '400px' }}>
      <SolveBtn onClick={() => gotoSolve()}>
        <b>리뷰방 입장</b>
      </SolveBtn>
    </div>
  );
};

const SolveBtn = styled.button`
  position: relative;
  width: 55%;
  margin: 10px 20%;
  padding: 0.3rem 1rem;
  font-size: 1.2em;
  border-radius: 30px;
  border: none;
  background-color: #d6d4d4;
  box-sizing: border-box;
  cursor: pointer;
`;

export default ModalContent1;
