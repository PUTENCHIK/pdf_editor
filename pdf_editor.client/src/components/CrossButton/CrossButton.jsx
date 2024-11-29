import './CrossButton.css'

function CrossButton(props) {
    return (
        <div className="cross-button" onClick={props.onClick}></div>
    );
}

export default CrossButton;