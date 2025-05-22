import ConfirmCloseFile from './forms/ConfirmCloseFile/ConfirmCloseFile';
import './FormsContainer.css'

const FormsContainer = (props) => {
    return (
        <div className="forms-container">
            {props.isConfirmingClosing &&
                <ConfirmCloseFile
                    onCloseForm={props.onCloseContainer}
                    onConfirm={props.onConfirmClosingFile}
                />
            }
        </div>
    );
}

export default FormsContainer;