import './ConfirmCloseFile.css'
import Button from '../../../Button/Button';
import { useEffect, useRef } from 'react';

const ConfirmCloseFile = (props) => {
    const formRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                props.onCloseForm();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, []);

    return (
        <div className='form confirm-close-file' ref={formRef}>
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
}

export default ConfirmCloseFile;