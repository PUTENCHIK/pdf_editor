import './DeletePagePage.css'

import { useRef, createElement, createRef } from 'react';

import Header from '../../components/Header/Header';
import AddFile from '../../components/AddFile/AddFile';
import MessageBlocksContainer from '../../components/MessageBlocksContainer/MessageBlocksContainer';
import MessageBlock from '../../components/MessageBlock/MessageBlock';

function DeletePagePage() {
    // const [response, setResponse] = useState();

    // useEffect(() => {
    //     deleteRequest();
    // }, []);

    const message_blocks_container = useRef(null);

    function addError(title, text) {
        message_blocks_container.current.addError(title, text);
    }

    return (
        <>
            <Header />
            <main className='section delete-page'>
                <div className="__content">
                    <h1>Удаление страницы из документа</h1>
                    <p onClick={() => { addError("Тестовая ошибка", "Какое-то описание") }}>
                        Описание Описание Описание Описание Описание
                        Описание Описание Описание Описание Описание Описание
                        Описание Описание Описание Описание Описание
                    </p>

                    <form method='POST' action="api/PDF/DeletePage" onSubmit={handlerSubmit}>
                        <input type="file" name="filepdf" className='filepdf' id="" />
                        <input type="file" name="filepdf" className='filepdf2' id="" />
                        <input type='number' name='pageNumber' className='pageNumber' placeholder="Номер страницы"/>
                        <input type='number' name='pageNumber' className='x' placeholder="x"/>
                        <input type='number' name='pageNumber' className='y' placeholder="y"/>
                        <input type='number' name='pageNumber' className='width' placeholder="Ширина"/>
                        <input type='number' name='pageNumber' className='height' placeholder="Высота"/>
                        <button type="submit">Отправить</button>
                    </form>

                    <div className="add-file-container">
                        <form>
                            <AddFile />
                            {/* <Upload></Upload> */}
                        </form>
                    </div>
                </div>
            </main>

            <MessageBlocksContainer ref={message_blocks_container} />
        </>
    );

    async function handlerSubmit(event) {
        event.preventDefault();

        const fileInput = event.target.querySelector('.filepdf');
        const fileInput2 = event.target.querySelector('.filepdf2');
        const pageNumber = event.target.querySelector('.pageNumber');
        const x = event.target.querySelector('.x');
        const y = event.target.querySelector('.y');
        const width = event.target.querySelector('.width');
        const height = event.target.querySelector('.height');


        const file = fileInput.files[0];
        const file2 = fileInput2.files[0];

        if (file) {
            const result = await combinePdfFilesRequest(file, file2);
            if (result){
                const blob = await result.blob();

                const fileURL = URL.createObjectURL(blob);
            
                const downloadLink = document.createElement('a');
                downloadLink.href = fileURL;
                downloadLink.download = 'returned.pdf';
                downloadLink.style.display = 'block';
                downloadLink.style.fontSize = '30px';
                downloadLink.textContent = 'Установить файл';
                
                document.body.appendChild(downloadLink);
            } else {
                console.log("Ошибка загрузки файла");
            }
        }
    }

    async function deletePageRequest(file, pageNumber) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('pageNumber', pageNumber);

        try {
            const response = await fetch('https://localhost:7199/api/PDF/DeletePage', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData?.message || `HTTP error! status: ${response.status}`;
                throw new Error(errorMessage);
            }

            const data = await response;
            console.log('Success:', data);
            return data;
        } catch (error) {
            console.error('Error uploading:', error);
            return null;
        }
    }


    async function swapPagesRequest(file, pageFrom, pageTo) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('pageFrom', pageFrom);
        formData.append('pageTo', pageTo);

        try {
            const response = await fetch('https://localhost:7199/api/PDF/SwapPages', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData?.message || `HTTP error! status: ${response.status}`;
                throw new Error(errorMessage);
            }

            const data = await response;
            console.log('Success:', data);
            return data;
        } catch (error) {
            console.error('Error uploading:', error);
            return null;
        }
    }


    async function insertImageRequest(file, imageFile, pageNumber, width, height, x, y) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('imageFile', imageFile);
        formData.append('pageNumber', pageNumber);
        formData.append('width', width);
        formData.append('height', height);
        formData.append('x', x);
        formData.append('y', y);
        

        try {
            const response = await fetch('https://localhost:7199/api/PDF/InsertImage', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData?.message || `HTTP error! status: ${response.status}`;
                throw new Error(errorMessage);
            }

            const data = await response;
            console.log('Success:', data);
            return data;
        } catch (error) {
            console.error('Error uploading:', error);
            return null;
        }
    }


    async function rotatePagesRequest(file, degrees) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('degrees', degrees);
        

        try {
            const response = await fetch('https://localhost:7199/api/PDF/RotatePages', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData?.message || `HTTP error! status: ${response.status}`;
                throw new Error(errorMessage);
            }

            const data = await response;
            console.log('Success:', data);
            return data;
        } catch (error) {
            console.error('Error uploading:', error);
            return null;
        }
    }


    async function addTextRequest(file, text, pageNumber, x, y, fontSize, font, isBold, fontColor) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('text', text);
        formData.append('pageNumber', pageNumber);
        formData.append('x', x);
        formData.append('y', y);
        formData.append('fontSize', fontSize);
        formData.append('font', font);
        formData.append('isBold', isBold);
        formData.append('fontColor', fontColor);
        

        try {
            const response = await fetch('https://localhost:7199/api/PDF/AddText', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData?.message || `HTTP error! status: ${response.status}`;
                throw new Error(errorMessage);
            }

            const data = await response;
            console.log('Success:', data);
            return data;
        } catch (error) {
            console.error('Error uploading:', error);
            return null;
        }
    }


    async function cropPageRequest(file, pageNumber, width, height, x, y) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('pageNumber', pageNumber);
        formData.append('width', width);
        formData.append('height', height);
        formData.append('x', x);
        formData.append('y', y);
        

        try {
            const response = await fetch('https://localhost:7199/api/PDF/CropPage', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData?.message || `HTTP error! status: ${response.status}`;
                throw new Error(errorMessage);
            }

            const data = await response;
            console.log('Success:', data);
            return data;
        } catch (error) {
            console.error('Error uploading:', error);
            return null;
        }
    }


    async function combinePdfFilesRequest(file, file2) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('file2', file2);

        try {
            const response = await fetch('https://localhost:7199/api/PDF/CombinePdfFiles', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData?.message || `HTTP error! status: ${response.status}`;
                throw new Error(errorMessage);
            }

            const data = await response;
            console.log('Success:', data);
            return data;
        } catch (error) {
            console.error('Error uploading:', error);
            return null;
        }
    }
}

export default DeletePagePage;