import Button from '../../../../components/Button/Button';
import roundNumber from '../../../../helpers/functions';
import './CropPageInfo.css'

const CropPageInfo = (props) => {
    return (
        <div className="crop-page-info">
            <h3>Обрезание страницы</h3>
            <div className='content'>
                <div className="column">
                    <span>Отступ слева</span>
                    <span>Отступ снизу</span>
                    <span>Ширина</span>
                    <span>Высота</span>
                </div>
                <div className="column">
                    <span>{roundNumber(props.data.x)}px</span>
                    <span>{roundNumber(props.data.y)}px</span>
                    <span>{roundNumber(props.data.width)}px</span>
                    <span>{roundNumber(props.data.height)}px</span>
                </div>
            </div>
            <div className="button-box">
                <Button
                    class="danger"
                    text="Обрезать страницу"
                    onClick={props.onClick}
                />
            </div>
        </div>
    );
}

export default CropPageInfo;