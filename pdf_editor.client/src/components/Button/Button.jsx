import './Button.css'

function Button(props) {
    return (
        <button type={props.type} className={props.class}>
            <span className="button-text">{props.text}</span>
        </button>
    );
}

export default Button;