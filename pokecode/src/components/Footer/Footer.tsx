import { useState } from 'react';
import { CodeAIButton } from '../CodeAIButton';
import { CodeLanguageButton } from '../CodeLanguageButton';
import { CodeRunButton } from '../CodeRunButton';
import CodeSubmitButton from '../CodeSubmitButton/CodeSubmitButton';
import { CodeTestCaseButton } from '../CodeTestCaseButton';
import { EvolutionModal } from '../EvolutionModal';
import { GetCoin } from '../GetCoin';

const Footer = () => {
  return (
    <footer
      style={{
        height: '80px',
        position: 'relative',
      }}
    ></footer>
  );
};

export const Footer1 = () => {
  const [evol, setEvol] = useState(null);
  const [coin, setCoin] = useState(null);
  return (
    <footer
      style={{
        height: '80px',
        position: 'relative',
        background: '#111826',
        boxShadow: '0 1px 5px black',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          lineHeight: '80px',
          textAlign: 'right',
          overflow: 'hidden',
        }}
      >
        <CodeTestCaseButton />
        <CodeAIButton />
        <CodeLanguageButton />
        <CodeRunButton />
        <CodeSubmitButton evolEvent={setEvol} coinEvent={setCoin} />
        {evol && <EvolutionModal nextPokemonNumber={evol} />}
        {coin && <GetCoin coin={coin} />}
      </div>
    </footer>
  );
};

export default Footer;
