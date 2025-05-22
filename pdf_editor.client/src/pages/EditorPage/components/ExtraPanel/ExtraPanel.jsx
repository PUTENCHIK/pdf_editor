import './ExtraPanel.css'

import download_icon from '../../../../images/common/download.png';
import close_icon from '../../../../images/common/cross.svg';
import InstrumentButton from '../../../../components/InstrumentButton/InstrumentButton';

const ExtraPanel = (props) => {
    return (
        <div className="extra-panel">
            <InstrumentButton
                image={download_icon}
                alt="download"
                tooltip="Скачать документ"
                onClick={props.onDownload}
            />
            <InstrumentButton
                image={close_icon}
                alt="close"
                type="danger"
                tooltip="Закрыть документ"
                onClick={props.onClose}
            />
        </div>
    );
}

export default ExtraPanel;