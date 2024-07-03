import { Link } from 'react-router-dom';
import './Header.css';
const Header = () => {
  return (
    <div className="header">
      <Link className="titleLogo" to={'/'}>
        POKE CODE
      </Link>
    </div>
  );
};

export default Header;
