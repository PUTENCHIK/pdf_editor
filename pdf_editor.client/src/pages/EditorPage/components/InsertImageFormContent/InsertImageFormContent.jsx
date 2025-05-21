import React, { useRef } from 'react';
import './InsertImageFormContent.css'
import AddImageFile from '../../../../components/AddImageFile/AddImageFile';
import InputWithLabel from '../../../../components/InputWithLabel/InputWithLabel';
import Button from '../../../../components/Button/Button';

function InsertImageFormContent(props) {

    return (
        <div className="insert-image-form">
            <h3>Вставить изображения</h3>
            <form name='insert-image' method='POST' onSubmit={props.formOnSubmit}>
                <AddImageFile
                    accept_types="images"
                    inputName="image_file"
                    ref={props.inputFileButton}
                    imageData={props.imageData}
                    setImageData={props.setImageData}
                />
                <div className="button-container">
                    <Button
                        type="submit"
                        class="danger"
                        className="primary"
                        text="Вставить"
                    />
                </div>
            </form>
        </div>
    );
}

export default InsertImageFormContent;
