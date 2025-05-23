import { useRef, useEffect } from 'react';
import './FormsContainer.css'
import ConfirmCloseFile from './forms/ConfirmCloseFile/ConfirmCloseFile';

const FormsContainer = (props) => {
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
        <div className="forms-container">
            { props.isConfirmingClosing &&
                <ConfirmCloseFile
                    ref={formRef}
                    onCloseForm={props.onCloseContainer}
                    onConfirm={props.onConfirmClosingFile}
                />
            }
        </div>
    );
}

export default FormsContainer;