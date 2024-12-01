import './CrossButton.css'

function CrossButton(props) {
    return (
        <div 
            className={"cross-button" + 
                (props.color == "white" ? " white" : " black") +
                (" " + props.size)} 
            onClick={props.onClick}
        >
        </div>
    );
}

export default CrossButton;