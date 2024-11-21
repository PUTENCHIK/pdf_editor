import './DropdownList.css'
import { useState } from 'react';

import ArrowDown from '../ArrowDown/ArrowDown';

function DropdownList(props) {
    
    let [isShown, setShown] = useState(false);

    function toggleLinksList() {
        setShown(!isShown);
    }

    return (
        <div className='dropdown-list'>
            <div className='title-container' onClick={toggleLinksList}>
                <span>{props.title}</span>
                <ArrowDown isShown={!isShown} />
            </div>
            <div className={'links-list' + (!isShown ? ' hidden' : '')}>
                <ul>
                    <li>Вариант 1</li>
                    <li>Вариант 2</li>
                    <li>Вариант 3</li>
                </ul>
            </div>
        </div>
    );
}

export default DropdownList;