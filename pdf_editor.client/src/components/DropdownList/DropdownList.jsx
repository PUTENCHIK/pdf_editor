import './DropdownList.css'
import { useState } from 'react';

import ArrowDown from '../ArrowDown/ArrowDown';

import {Link} from 'react-router-dom';

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
                {props.tools.map((tools_list) => {
                    return (
                        <ul>
                            {tools_list.map((tool) => {
                                return (
                                    <li>
                                        <Link to={tool.link}>{tool.title}</Link>
                                    </li>
                                );
                            })}
                        </ul>
                    );
                })}
            </div>
        </div>
    );
}

export default DropdownList;