import './Header.css'
import { useState } from 'react';
import { Link } from 'react-router-dom';

import HeaderLink from '../HeaderLink/HeaderLink';
import DropdownList from '../DropdownList/DropdownList';

import tools from '../../helpers/toolsList';

function Header(props) {
    let [currentList, setCurrentList] = useState(0);

    function updateCurrentList(number) {
        setCurrentList(number);
    }

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
                    isShown={currentList == 1}
                />
            </div>
            {/* <div className='header-content'>
                {
                    props.linkRootExists || props.linkRootExists == null && 
                    <Link to={"/"}>
                        <div className="logo-container">
                            <div className='logo'></div>
                        </div>
                    </Link>
                }
                <DropdownList
                    title="Инструменты"
                    tools={tools}
                    isShown={currentList == 1}
                />
            </div> */}
        </header>
    );
}

export default Header;