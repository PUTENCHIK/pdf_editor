import './InstrumentButton.css'

const InstrumentButton = (props) => {
    return (
        <div className="instrument-button" onClick={props.onClick} title={props.tooltip}>
            <img
                src={props.image}
                alt={props.alt}
            />
        </div>
    );
};

export default InstrumentButton;