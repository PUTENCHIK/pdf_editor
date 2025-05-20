import './InstrumentsPanel.css'

import clip_icon from '../../../../images/common/clip_icon_active.svg';
import insert_image_icon from '../../../../images/common/insert_image_icon_active.svg';
import insert_text_icon from '../../../../images/common/insert_text_icon.svg';
import InstrumentButton from '../InstrumentButton/InstrumentButton';

const InstrumentsPanel = (props) => {
    return (
        <div className="instruments-panel">
            <InstrumentButton
                image={clip_icon}
                alt="clip"
                tooltip={`Обрезать страницу ${props.currentPage}`}
                onClick={props.onClipPage}
            />
            <InstrumentButton
                image={insert_image_icon}
                alt="insert_image"
                tooltip={`Вставить изображение на страницу ${props.currentPage}`}
                onClick={props.onInsertImage}
            />
            <InstrumentButton
                image={insert_text_icon}
                alt="insert_text"
                tooltip={`Вставить текст на страницу ${props.currentPage}`}
                onClick={props.onInsertText}
            />
        </div>
    );
}

export default InstrumentsPanel;