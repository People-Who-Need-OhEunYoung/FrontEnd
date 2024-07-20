import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { DesignedButton1 } from '../DesignedButton';
import { setLanguage } from '../../store/codeCallerReducer';

const CodeLanguageButton = () => {
  const { language } = useSelector((state: RootState) => state.codecaller);
  const dispatch = useDispatch();

  return (
    <DesignedButton1
      style={{
        margin: '0',
        width: '190px',
        fontSize: '1em',
        marginRight: '10px',
      }}
    >
      <label htmlFor="language">언어 : </label>
      <select
        id="language"
        style={{

          background: '#324056',
          border: 'none',
          color: 'white',

          fontSize: '1rem',
        }}
        onChange={(e: any) => {
          dispatch(setLanguage(e.target.value));
        }}
        value={language}
      >
        <option value="javascript">JavaScript</option>
        <option value="text/x-java">Java</option>
        <option value="python">Python</option>
        <option value="text/x-csrc">C</option>
        <option value="text/x-c++src">C++</option>
        <option value="text/x-csharp">C#</option>
      </select>
    </DesignedButton1>
  );
};
export default CodeLanguageButton;
