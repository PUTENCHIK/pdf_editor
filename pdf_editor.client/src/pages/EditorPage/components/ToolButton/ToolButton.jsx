import './ToolButton.css'
import { Link } from 'react-router-dom';

function ToolButton(props) {
    return (
        <div className={"tool-button" + (props.isActive ? " active" : "")}>
            <Link>
                <img className='icon' src={props.icon} alt={props.name} />
            </Link>
        </div>
    );
}

export default ToolButton;