import { CodeAIButton } from '../CodeAIButton';
import { CodeLanguageButton } from '../CodeLanguageButton';
import { CodeRunButton } from '../CodeRunButton';
import CodeSubmitButton from '../CodeSubmitButton/CodeSubmitButton';
import { CodeTestCaseButton } from '../CodeTestCaseButton';

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
        }}
      >
        <CodeTestCaseButton />
        <CodeAIButton />
        <CodeLanguageButton />
        <CodeRunButton />
        <CodeSubmitButton />
      </div>
    </footer>
  );
};

export default Footer;
