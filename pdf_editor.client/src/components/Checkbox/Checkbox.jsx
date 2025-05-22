import roundNumber from '../../helpers/functions';
import './Checkbox.css';

const Checkbox = (props) => {
    return (
        <div
            className={"checkbox" + (props.isChecked ? " checked" : "")}
            onClick={props.onClick}
            style={{width: `${props.size}px`, height: `${props.size}px`,
                    borderRadius: `${roundNumber(props.size / 4)}px`}}
        >
            { props.isChecked &&
                <div
                    className="mark"
                    style={{width: `${props.size * 0.4}px`, height: `${props.size * 0.7}px`, top: `-${props.size / 10}px`,
                            borderBottom: `${props.size / 10}px solid white`, borderRight: `${props.size / 10}px solid white`}}
                >

                </div>
            }
        </div>
    );
}

export default Checkbox;