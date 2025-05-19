import './ToolButton.css'

function ToolButton(props) {
    return (
        <div className="tool-button" title={props.title} onClick={props.onClick}>
            <img className='icon' src={props.icon} alt={props.name} />
        </div>
    );
}

export default ToolButton;