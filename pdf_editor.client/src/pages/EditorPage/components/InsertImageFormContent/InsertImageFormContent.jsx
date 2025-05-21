import React, { useRef } from 'react';
import AddImageFile from '../../../../components/AddImageFile/AddImageFile';
import InputWithLabel from '../../../../components/InputWithLabel/InputWithLabel';
import Button from '../../../../components/Button/Button';

function InsertImageFormContent(props) {

    return (
        <>
            <h3>Вставить изображение</h3>
            <form name='insert-image' method='POST' onSubmit={props.formOnSubmit}>
                <AddImageFile accept_types="images" inputName="image_file" ref={props.inputFileButton} imageData={props.imageData} setImageData={props.setImageData} />
                <div className="button-container">
                    <Button type="submit" className="primary" text="Вставить" />
                </div>
            </form>
        </>
    );
}

export default InsertImageFormContent;
