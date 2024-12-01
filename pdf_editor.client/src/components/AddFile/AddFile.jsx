import './AddFile.css'

import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import file_image from '../../images/common/file.png'
import CrossButton from '../CrossButton/CrossButton';

function AddFile() {
    const inputFile = useRef(null);
    const [state, changeState] = useState(1);

    function buttonOnClick() {
        if (state == 1) {
            inputFile.current.click();
        }
    }

    function inputFileOnChange() {
        if (inputFile.current.value != "") {
            changeState(2);
        }
    }

    function getSize(bytes) {
        let signs = ['Б', 'КБ', 'МБ'];
        let index = 0;
        while (bytes > 2048 && index < 2) {
            bytes /= 1024;
            index += 1;
        }
        return `${Math.round(bytes * 10) / 10}${signs[index]}`;
    }

    function resetFile() {
        changeState(1);
    }

    return (
        <div className={'add-file-block' + (state == 1 ? ' clickable' : '')} onClick={buttonOnClick}>
            <input type="file" ref={inputFile} className='hidden' name="file" onChange={inputFileOnChange} />

            <div className="__content">
                {state == 1 &&
                    <div className="span-container">
                        <span className='choose-file-span'>Выберите файл</span>
                    </div>
                }
                {state == 2 &&
                    <>
                        <div className="file-info-box">
                            <div className="icon-name">
                                <img className="icon" src={file_image} alt="file" />
                                <span className="file-name">{inputFile.current.files[0].name}</span>
                            </div>
                            <span className="file-size">{getSize(inputFile.current.files[0].size)}</span>
                        </div>
                        <CrossButton size="normal" color="black" onClick={resetFile} />
                    </>
                }
                {state == 3 &&
                    <span className='choose-file-span'>Файл выбран</span>
                }                
            </div>
        </div>
    );
}

export default AddFile;