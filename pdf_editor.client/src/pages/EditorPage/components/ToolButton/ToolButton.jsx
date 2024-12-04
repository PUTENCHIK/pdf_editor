import './ToolButton.css'
import { Link } from 'react-router-dom';

function ToolButton(props) {
    return (
        <div className={"tool-button" + (props.isActive ? " active" : "")} title={props.title}>
            <img className='icon' src={props.icon} alt={props.name} />
        </div>
    );
}

export default ToolButton;