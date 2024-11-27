import './Header.css'
import { useState } from 'react';

import HeaderLink from '../HeaderLink/HeaderLink';
import DropdownList from '../DropdownList/DropdownList';

import tools from '../../helpers/toolsList';

function Header() {
    let [currentList, setCurrentList] = useState(0);

    function updateCurrentList(number) {
        setCurrentList(number);
    }

    return (
        <header>
            <div className='header-content'>
                <nav>
                    <div onClick={() => {updateCurrentList(1);}}>
                        <DropdownList
                            title="Работа со страницами"
                            tools={tools.with_pages}
                            isShown={currentList == 1}
                        />
                    </div>
                    <div onClick={() => {updateCurrentList(2);}}>
                        <DropdownList
                            title="Работа с документами"
                            tools={tools.with_documents}
                            isShown={currentList == 2}
                        />
                    </div>
                </nav>
                <HeaderLink href="about" text="О проекте" />
            </div>
        </header>
    );
}

export default Header;