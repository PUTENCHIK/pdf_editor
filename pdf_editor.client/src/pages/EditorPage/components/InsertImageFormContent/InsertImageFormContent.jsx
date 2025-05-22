import React, { useRef } from 'react';
import './InsertImageFormContent.css'
import AddImageFile from '../../../../components/AddImageFile/AddImageFile';
import InputWithLabel from '../../../../components/InputWithLabel/InputWithLabel';
import Button from '../../../../components/Button/Button';

function InsertImageFormContent(props) {
    return (
        <div className="insert-image-form">
            <h3>Вставить изображения</h3>
            <AddImageFile
                accept_types="images"
                inputName="image_file"
                ref={props.inputFileButton}
                imageData={props.imageData}
                setImageData={props.setImageData}
            />
            <div className="button-container">
                <Button
                    type="button"
                    className="primary"
                    text="Вставить"
                    onClick={props.onClick}
                    class="danger"
                />
            </div>
        </div>
    );
}


export default InsertImageFormContent;
