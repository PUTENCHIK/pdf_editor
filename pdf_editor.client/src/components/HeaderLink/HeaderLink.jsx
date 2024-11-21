import './HeaderLink.css'

import {Link} from 'react-router-dom';

function HeaderLink(props) {
    return (
        <Link to={props.href}>
            <span>{props.text}</span>
        </Link>
    );
}

export default HeaderLink;