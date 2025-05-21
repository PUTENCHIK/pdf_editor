import React, {
    useRef,
    useState,
    forwardRef,
    useImperativeHandle,
    useEffect,
} from 'react';
import { createRoot } from 'react-dom/client';
import ImageContainer from './ImageContainer';

const AddImageFile = forwardRef((props, ref) => {
    const work = document.querySelector(".document-display");
    const [pageWidth, setPageWidth] = useState(window.innerWidth);
    const [pageHeight, setPageHeight] = useState(window.innerHeight);
    const inputFile = useRef(null);
    const [uploading, setUploading] = useState(false); // State to disable input while uploading

    useEffect(() => {
        if (!work) {
            console.error(".document-display element not found!");
            return;
        }
        props.imageData.forEach((image, index) => {
            const rootId = `image-container-${index}`;
            const container = document.getElementById(rootId) || document.createElement('div');

            if (!container.parentNode) {
                container.id = rootId;
                work.appendChild(container);
            }

            const root = createRoot(container);
            root.render(
                <ImageContainer
                    key={index}
                    image={image}
                    pageWidth={pageWidth}
                    pageHeight={pageHeight}
                />
            );
        });
    }, [props.imageData, pageWidth, pageHeight]);

    useImperativeHandle(ref, () => ({
        getFile() {
            return inputFile.current.files[0];
        },
        getImageData() {
            return props.imageData;
        }
    }));

    function buttonOnClick() {
        if (!uploading) {
            inputFile.current.click();
        }
    }

    function inputFileOnChange() {
        const files = inputFile.current.files;
        const elements = document.querySelectorAll(".image-container");

        if (elements.length > 0) {
            alert("Нельзя добавлять новые изображения, сначала сохраните старые");
            inputFile.current.value = null; // Очистить выбранные файлы
            return;
        }

        if (files && files.length > 0 && !uploading) {
            setUploading(true); // Disable input after selection
            const newImages = [];
            let filesProcessed = 0; // Counter to track processed files
            const rect = work.getBoundingClientRect();

            for (let i = 0; i < files.length; i++) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        let pageW = work.offsetWidth;
                        let pageH = work.offsetHeight;

                        const container = document.querySelector('.document-segment');
                        let initialWidth = 200;
                        let initialHeight = 150;
                        let initialX = (pageW - initialWidth) / 2;
                        let initialY = (window.innerHeight-300 - initialHeight) / 2 + (container?.scrollTop || 0);
                        newImages.push({
                            src: event.target.result,
                            name: files[i].name,
                            x: initialX,
                            y: initialY,
                            width: initialWidth,
                            height: initialHeight,
                            file: files[i] // Сохраняем сам файл
                        });
                        filesProcessed++;

                        if (filesProcessed === files.length) {
                            props.setImageData((prev) => [...prev, ...newImages]); // Обновляем состояние, добавляя новые изображения
                            setTimeout(() => {
                                setUploading(false); // Re-enable input after processing
                                inputFile.current.value = null; // Clear the file input
                            }, 0);
                        }
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(files[i]);
            }
        }
    }

    return (
        <div className='add-image-file-box'>
            <input
                type="file"
                name={props.inputName}
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                ref={inputFile}
                onChange={inputFileOnChange}
                disabled={uploading} // Disable the input based on the uploading state
            />
            <button type="button" onClick={buttonOnClick} disabled={uploading}>
                Добавить изображения
            </button>
            {uploading && <p>Загрузка...</p>} {/* Display loading indicator when uploading */}
        </div>
    );
});

export default AddImageFile;
