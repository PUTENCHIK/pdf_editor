import { useRef, useState, useEffect } from 'react';
import './ZoomPanel.css'
import zoom_increase from '../../../../images/common/zoom_increase.svg'
import zoom_decrease from '../../../../images/common/zoom_decrease.svg'

import {roundNumber} from '../../../../helpers/functions';
import InstrumentButton from '../../../../components/InstrumentButton/InstrumentButton';

const ZoomPanel = (props) => {
    const startZoom = 1, minZoom = 0.2, maxZoom = 5;
    const [zoom, setZoom] = useState(startZoom);
    const [inputValue, setInputValue] = useState(startZoom*100);
    const zoomDisplayText = useRef(null);

    function clipZoomValue(value) {
        value = value > minZoom ? value : minZoom;
        value = value < maxZoom ? value : maxZoom;
        return value;
    }

    function handleZoomInputChanged(event) {
        setInputValue(event.target.value);
    }

    function handleZoomInputBlured(event) {
        const value = event.target.value;
        if (/^\d+$/.test(value)) {
            let zoomValue = Number(event.target.value) / 100;
            zoomValue = clipZoomValue(zoomValue)
            setZoom(zoomValue);
            setInputValue(zoomValue * 100);
        } else {
            setInputValue(zoom * 100);
        }
    }

    useEffect(() => {
        setInputValue(Math.round(zoom*100));
        props.updateZoom(zoom);
    }, [zoom]);

    function handleZoomIn() {
        updateZoom(zoom + 0.1);
    }

    function handleZoomOut() {
        updateZoom(zoom - 0.1);
    }

    function updateZoom(newValue) {
        newValue = roundNumber(clipZoomValue(newValue), 1);
        setZoom(newValue);
    }

    return (
        <>
            <div className='zoom-panel'>
                <InstrumentButton
                    image={zoom_increase}
                    alt="+"
                    tooltip="Приблизить на 10%"
                    onClick={handleZoomIn}
                />
                <div className='zoom-display'>
                    <input
                        className='span'
                        type="text"
                        value={inputValue}
                        onChange={handleZoomInputChanged}
                        onBlur={handleZoomInputBlured}
                    />
                    %
                </div>
                <InstrumentButton
                    image={zoom_decrease}
                    alt="-"
                    tooltip="Отдалить на 10%"
                    onClick={handleZoomOut}
                />
            </div>
        </>
    );
};

export default ZoomPanel;