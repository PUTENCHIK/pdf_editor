import './ZoomButton.css'

import zoom_increase from '../../../../images/common/zoom_increase.svg'
import zoom_decrease from '../../../../images/common/zoom_decrease.svg'

function ZoomButton(props) {
    return (
        <div className="zoom-button" onClick={props.onClick}>
            <img
                src={props.type == "increase" ? zoom_increase : zoom_decrease}
                alt={props.type}
            />
        </div>
    );
}

export default ZoomButton;