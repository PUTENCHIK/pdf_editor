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
            <div className='header-content'>
                <nav>
                    {
                        props.linkRootExists || props.linkRootExists == null && 
                        <Link to={"/"}>
                            <div className="site-logo"></div>
                        </Link>
                    }
                    <DropdownList
                        title="Работа со страницами"
                        tools={tools.with_pages}
                        isShown={currentList == 1}
                    />
                    <DropdownList
                        title="Работа с документами"
                        tools={tools.with_documents}
                        isShown={currentList == 2}
                    />
                </nav>
                <HeaderLink href="about" text="О проекте" />
            </div>
        </header>
    );
}

export default Header;