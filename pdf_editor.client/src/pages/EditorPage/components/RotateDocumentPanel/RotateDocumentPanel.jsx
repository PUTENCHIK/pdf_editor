import { useState } from 'react';
import './RotateDocumentPanel.css'
import arrow_clockwise from '../../../../images/common/arrow_clockwise.svg'
import arrow_counterclockwise from '../../../../images/common/arrow_counterclockwise.svg'
import InstrumentButton from '../../../../components/InstrumentButton/InstrumentButton';

const RotateDocumentPanel = (props) => {
    function rotateClockwise() {
        props.rotateDocument(true);
    }

    function rotateCounterclockwise() {
        props.rotateDocument(false);
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