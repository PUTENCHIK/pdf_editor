import './InstrumentButton.css'

const InstrumentButton = (props) => {
    return (
        <div
            className={"instrument-button" + (props.isActive ? " active" : "") + 
                (props.type == "danger" ? " danger" : "")}
            title={props.tooltip}
            onClick={props.onClick}
        >
            <img src={props.image} alt={props.alt} />
        </div>
    );
};

export default InstrumentButton;