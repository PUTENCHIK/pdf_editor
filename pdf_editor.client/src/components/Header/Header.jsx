import './Header.css'

import HeaderLink from '../HeaderLink/HeaderLink';
import DropdownList from '../DropdownList/DropdownList';

function Header() {
    return (
        <header>
            <div className='header-content'>
                <nav>
                    <DropdownList title="Инструменты" />
                </nav>
                <HeaderLink href="signin" text="Войти" />
            </div>
        </header>
    );
}

export default Header;