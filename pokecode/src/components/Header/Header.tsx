import { Link } from 'react-router-dom';
import './Header.css';
import Nav from '../Nav/Nav';
const Header = () => {
  return (
    <div className="header">
      <Link className="titleLogo" to={'/'} style={{ zIndex: 100 }}>
        POKE CODE
      </Link>
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'white',
          textAlign: 'center',
          width: '350px',
        }}
      >
        <Nav></Nav>
      </div>
    </div>
  );
};

export default Header;
