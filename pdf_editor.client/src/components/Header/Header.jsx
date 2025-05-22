import './Header.css'
import { Link } from 'react-router-dom';

import DropdownList from '../DropdownList/DropdownList';
import tools from '../../helpers/toolsList';

function Header(props) {
    return (
        <header>
            <Link to={"/"}>
                <div className="logo-container">
                    <div className='logo'></div>
                </div>
            </Link>
            <div className="content">
                <DropdownList
                    title="Инструменты"
                    tools={tools}
                    isShown={false}
                />
            </div>
        </header>
    );
}

export default Header;