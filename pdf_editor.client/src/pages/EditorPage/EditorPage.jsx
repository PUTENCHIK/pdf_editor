import './EditorPage.css'
import React, { useState, useRef, useEffect } from 'react'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/build/pdf'
import * as pdfjs from 'pdfjs-dist/build/pdf';

import Header from '../../components/Header/Header'
import RightMenu from './components/RightMenu/RightMenu'
import AddFile from '../../components/AddFile/AddFile'
import DocumentDisplay from '../../components/DocumentDisplay/DocumentDisplay'
import ZoomButton from './components/ZoomButton/ZoomButton';
import Button from '../../components/Button/Button';

import DeletePageFormContent from './components/DeletePageFormContent/DeletePageFormContent';
import MessageBlocksContainer from '../../components/MessageBlocksContainer/MessageBlocksContainer';

GlobalWorkerOptions.workerSrc = './node_modules/pdfjs-dist/build/pdf.worker.mjs';
const EditorPage = () => {
    // переменная и хук, определяющие основной контент на странице
    // start - начальный выбор файла
    // display - отображение файла
    const [pageState, setPageState] = useState("start");
    const rightMenu = useRef(null);
    const [activeTool, setActiveTool] = useState("delete_page");
    
    const inputFileButton = useRef(null);
    const [fileObject, setFileObject] = useState(null);
    const documentDisplay = useRef(null);
    const [pdf, setPdf] = useState(null);

    const messagesContainerRef = useRef(null);

    // Обработка загрузки файла
    async function handleFileChange() {
        const file = inputFileButton.current.getFile();
        if (file) {
            setFileObject(file);
            const pdfDocument = await getDocument(URL.createObjectURL(file)).promise; // Загружаем PDF из Blob            
            setPdf(pdfDocument);
            setPageState("display");
        }
    };

    function zoomIn() {
        documentDisplay.current.zoomIn();
    }

    function zoomOut() {
        documentDisplay.current.zoomOut();
    }

    function rightMenuOnClick() {
        if (rightMenu.current) {
            setActiveTool(rightMenu.current.getActiveTool());
        }
    }

    async function formSubmit(event) {
        event.preventDefault();

        switch (activeTool) {
            case "delete_page": {
                console.log(fileObject);
                let pageNumber;
                try {
                    pageNumber = event.target.page_number.value;
                } catch (error) {
                    messagesContainerRef.current.addError("Удаление страницы", "Не получено поле с номером страницы");
                }
                const result = await deletePageRequest(fileObject, pageNumber);
                if (result) {
                    messagesContainerRef.current.addError("Успех", "Страница удалена!");
                }
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
            messagesContainerRef.current.addError("Ошибка", error.message);
            return null;
        }
    }

    return (
        <>
            <RightMenu
                showTools={pageState == "display"}
                onClick={rightMenuOnClick}
                activeTool={activeTool}
                ref={rightMenu}
            />
            <div className="page-content">
                <Header linkRootExists={false} />
                <main className={"section editor-page" + (pageState == "display" ? " full" : "")}>

                    {pageState == "start" &&
                        <div className='start-state'>
                            <div className="__content">
                                <h1>Работа с вашими файлами</h1>
                                <p>Выберите файл с расширением PDF из вашего хранилища</p>
                                <AddFile 
                                    onChange={handleFileChange}
                                    ref={inputFileButton}
                                />
                            </div>
                        </div>
                    }
                    {pageState == "display" &&
                        <>
                            <div className="document-segment">
                                    <div className="buttons-container">
                                        <ZoomButton
                                            type="increase"
                                            onClick={zoomIn}
                                        />
                                        <ZoomButton
                                            type="decrease"
                                            onClick={zoomOut}
                                        />
                                    </div>
                                <div className="document-container">
                                    {pdf &&
                                        <DocumentDisplay
                                            document={pdf}
                                            ref={documentDisplay}
                                        />
                                    }
                                </div>
                            </div>
                            <div className="interaction-segment">
                                <div className="interaction-field">
                                    <div className="__content">
                                        {activeTool == "delete_page" &&
                                            <>
                                                <DeletePageFormContent 
                                                    pageCount={pdf ? pdf.numPages : 1}
                                                    formOnSubmit={formSubmit}
                                                />
                                            </>
                                        }
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    class="danger"
                                    text="Скачать файл"
                                />
                            </div>
                        </>
                    }

                    <MessageBlocksContainer ref={messagesContainerRef} />
                </main>
            </div>
        </>
    );
};

export default EditorPage;