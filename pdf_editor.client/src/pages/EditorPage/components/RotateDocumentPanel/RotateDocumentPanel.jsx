import { useState } from 'react';
import './RotateDocumentPanel.css'
import arrow_clockwise from '../../../../images/common/arrow_clockwise.svg'
import arrow_counterclockwise from '../../../../images/common/arrow_counterclockwise.svg'
import InstrumentButton from '../InstrumentButton/InstrumentButton';

const RotateDocumentPanel = (props) => {
    const startAngle = 0;
    const [angle, setAngle] = useState(startAngle);

    function rotateClockwise() {
        updateAngle(angle + 90);
    }

    function rotateCounterclockwise() {
        updateAngle(angle - 90);
    }

    function updateAngle(newAngle) {
        setAngle(newAngle);
        props.rotateDocument(newAngle);
    }

    return (
        <div className="rotate-document-panel">
            <InstrumentButton
                image={arrow_counterclockwise}
                alt="-90"
                tooltip="Повернуть против часовой стрелки"
                onClick={rotateCounterclockwise}
            />
            <InstrumentButton
                image={arrow_clockwise}
                alt="+90"
                tooltip="Повернуть по часовой стрелке"
                onClick={rotateClockwise}
            />
        </div>
    );
};

export default RotateDocumentPanel;