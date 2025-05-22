import './DropdownList.css'
import {Link} from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';

import ArrowDown from '../ArrowDown/ArrowDown';

const DropdownList = (props) => {
    const dropdownList = useRef(null);
    let [isShown, setShown] = useState(props.isShown);

    function handleClickOutside(event) {
        if (dropdownList.current && !dropdownList.current.contains(event.target)) {
            setShown(false);
        }
    }
    
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, []);
    
    function toggleLinksList() {
        setShown(!isShown);
    }

    return (
        <div ref={dropdownList} className='dropdown-list'>
            <div className='title-container' onClick={toggleLinksList}>
                <span>{props.title}</span>
                <ArrowDown direction={isShown ? 'up' : 'down'} />
            </div>
            <div className={'links-list' + (!isShown ? ' hidden' : '')}>
                {props.tools.map((tools_list, index) => {
                    return (
                        <ul key={index}>
                            {tools_list.map((tool, key) => {
                                return (
                                    <li key={key}>
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
};

export default DropdownList;