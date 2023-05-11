import { Link } from '@remix-run/react';
import { SearchBar } from './SearchBar';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <Link to="/">
        <div className="header__title">
          <div className="header__title--large">The Society of the Cincinnati</div>
          <div className="header__title--small">in the State of New Jerfey</div>
        </div>
      </Link>
      <SearchBar />
    </header>
  )
}