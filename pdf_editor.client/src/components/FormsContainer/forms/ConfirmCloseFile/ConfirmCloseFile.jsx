import './ConfirmCloseFile.css'
import Button from '../../../Button/Button';
import { forwardRef } from 'react';

const ConfirmCloseFile = forwardRef((props, ref) => {
    return (
        <div className='form confirm-close-file' ref={ref}>
            <div className="content">
                <p>Перед закрытием скачайте документ, чтобы сохранить изменения.</p>
                <div className="buttons-box">
                    <Button
                        text="Отмена"
                        onClick={props.onCloseForm}
                    />
                    <Button
                        class="danger"
                        text="Закрыть"
                        onClick={props.onConfirm}
                    />
                </div>
            </div>
        </div>
    )
});

export default ConfirmCloseFile;