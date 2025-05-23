import './Header.css'
import { Link } from 'react-router-dom';

import logo_icon from '../../images/common/logo.png';
import DropdownList from '../DropdownList/DropdownList';
import tools from '../../helpers/toolsList';

function Header() {
    return (
        <header>
            <Link to={"/"}>
                <div className="logo-container">
                    <div className='logo'>
                        <img
                            className='logo'
                            src={logo_icon}
                            alt="logo"
                        />
                    </div>
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