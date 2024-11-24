import './Header.css'

import HeaderLink from '../HeaderLink/HeaderLink';
import DropdownList from '../DropdownList/DropdownList';

import tools from '../../helpers/toolsList';

function Header() {
    return (
        <header>
            <div className='header-content'>
                <nav>
                    <DropdownList
                        title="Инструменты"
                        rows={5}
                        columns={1}
                        tools={tools}
                    />
                </nav>
                <HeaderLink href="signin" text="Войти" />
            </div>
        </header>
    );
}

export default Header;