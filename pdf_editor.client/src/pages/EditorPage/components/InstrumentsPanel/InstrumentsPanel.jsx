import './InstrumentsPanel.css'

import crop_icon from '../../../../images/common/clip_icon_active.svg';
import insert_image_icon from '../../../../images/common/insert_image_icon_active.svg';
import insert_text_icon from '../../../../images/common/insert_text_icon.svg';
import cross_icon from '../../../../images/common/cross.svg';
import InstrumentButton from '../../../../components/InstrumentButton/InstrumentButton';

const InstrumentsPanel = (props) => {
    return (
        <div className="instruments-panel">
            <InstrumentButton
                image={props.cropingPage ? cross_icon : crop_icon}
                alt="crop"
                tooltip={props.cropingPage ?
                    `Отменить обрезание страницы ${props.currentPage}` :
                    `Обрезать страницу ${props.currentPage}`
                }
                isActive={props.cropingPage}
                onClick={props.onCropPage}
            />
            <InstrumentButton
                image={props.insertImagePage ? cross_icon : insert_image_icon}
                alt="insert_image"
                tooltip={props.insertImagePage ?
                    "Отменить вставку изображения" :
                    `Вставить изображение на страницу ${props.currentPage}`
                }
                isActive={props.insertImagePage}
                onClick={props.onInsertImage}
            />
            <InstrumentButton
                image={props.insertTextPage ? cross_icon : insert_text_icon}
                alt="insert_text"
                tooltip={props.insertTextPage ?
                    `Отменить вставку текста на странице ${props.currentPage}` :
                    `Вставить текст на страницу ${props.currentPage}`
                }
                isActive={props.insertTextPage}
                onClick={props.onInsertText}
            />
        </div>
    );
}

export default InstrumentsPanel;