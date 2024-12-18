import './EditorPage.css'
import React, { useState, useRef, useEffect } from 'react'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/build/pdf'
import * as pdfjs from 'pdfjs-dist/build/pdf';
import { deletePageRequest, rotatePagesRequest, swapPagesRequest,
    cropPageRequest, insertImageRequest
} from '../../helpers/functionRequests'

import Header from '../../components/Header/Header'
import RightMenu from './components/RightMenu/RightMenu'
import AddFile from '../../components/AddFile/AddFile'
import DocumentDisplay from '../../components/DocumentDisplay/DocumentDisplay'
import ZoomButton from './components/ZoomButton/ZoomButton';
import Button from '../../components/Button/Button';

import DeletePageFormContent from './components/DeletePageFormContent/DeletePageFormContent';
import SwapPagesFromContent from './components/SwapPagesFromContent/SwapPagesFromContent';
import RotatePagesFormContent from './components/RotatePagesFormContent/RotatePagesFormContent';
import CropPageFormContent from './components/CropPageFormContent/CropPageFormContent';
import InsertImageFormContent from './components/InsertImageFormContent/InsertImageFormContent';

import MessageBlocksContainer from '../../components/MessageBlocksContainer/MessageBlocksContainer';

GlobalWorkerOptions.workerSrc = './node_modules/pdfjs-dist/build/pdf.worker.mjs';
const EditorPage = () => {
    // переменная, определяющая основной контент на странице
    // start - начальный выбор файла
    // display - отображение файла
    const [pageState, setPageState] = useState("start");
    const rightMenu = useRef(null);
    const [activeTool, setActiveTool] = useState("delete_page");
    
    const inputFileButton = useRef(null);
    const documentDisplay = useRef(null);
    const [fileObject, setFileObject] = useState(null);
    const [pdf, setPdf] = useState(null);

    const messagesContainerRef = useRef(null);

    useEffect(() => {
        console.log("PDF updated");
        if (documentDisplay.current && pdf) {
            documentDisplay.current.updateDocument(pdf);
        }
    }, [pdf]);

    async function createPdfObject(file) {
        return await getDocument(URL.createObjectURL(file)).promise;
    }
    
    // Обработка загрузки файла
    async function handleFileChange() {
        const file = inputFileButton.current.getFile();
        if (file) {
            setFileObject(file);            
            setPdf(await createPdfObject(file));
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

    function downloadFile() {
        const fileURL = URL.createObjectURL(fileObject);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = 'returned.pdf';
        link.click();

        link.remove();
    }

    async function formSubmit(event) {
        event.preventDefault();

        let result;
        try {
            switch (activeTool) {
                case "delete_page": {                    
                    let pageNumber;
                    try {
                        pageNumber = event.target.page_number.value;
                    } catch (error) {
                        messagesContainerRef.current.addError("Удаление страницы", "Не получено поле с номером страницы");
                    }
                    result = await deletePageRequest(fileObject, pageNumber);
                    if (result) {
                        messagesContainerRef.current.addMessage("Успех", "Страница удалена");
                    }
                    break;
                }
                case "swap_pages": {
                    let page1, page2;
                    try {
                        page1 = event.target.page_1.value;
                        page2 = event.target.page_2.value;
                    } catch (error) {
                        messagesContainerRef.current.addError("Свап страниц", "Не получено одно из полей с номером страницы");
                    }
                    result = await swapPagesRequest(fileObject, page1, page2);
                    if (result) {
                        messagesContainerRef.current.addMessage("Успех", `Страницы ${page1} и ${page2} свапнуты`);
                    }
                    break;
                }
                case "rotate_pages": {
                    let degrees;
                    try {
                        degrees = event.target.degrees.value;
                    } catch (error) {
                        messagesContainerRef.current.addError("Поворот документа", "Не получено поле с градусами");
                    }
                    result = await rotatePagesRequest(fileObject, degrees);
                    if (result) {
                        messagesContainerRef.current.addMessage("Успех", `Документ повёрнут на ${degrees}°`);
                    }
                    break;
                }
                case "crop_page": {
                    let pageNumber, width, height, x, y;
                    try {
                        pageNumber = event.target.page_number.value;
                        width = event.target.width.value;
                        height = event.target.height.value;
                        x = event.target.x.value;
                        y = event.target.y.value;
                    } catch (error) {
                        messagesContainerRef.current.addError("Обрезание страницы", "Не получено одно из полей формы: " + error.message);
                    }
                    result = await cropPageRequest(fileObject, pageNumber, width, height, x, y);
                    if (result) {
                        messagesContainerRef.current.addMessage("Успех",
                            `Документ обрезан; точка: (${x}, ${y}), размеры: (${width}, ${height})`
                        );
                    }
                    break;
                }
                case "insert_image": {
                    let imageFile, pageNumber, width, height, x, y;
                    try {
                        imageFile = event.target.image_file.files[0];                        
                        pageNumber = event.target.page_number.value;
                        width = event.target.width.value;
                        height = event.target.height.value;
                        x = event.target.x.value;
                        y = event.target.y.value;
                    } catch (error) {
                        messagesContainerRef.current.addError("Вставка изображения", "Не получено одно из полей формы: " + error.message);
                    }
                    result = await insertImageRequest(fileObject, imageFile, pageNumber, width, height, x, y);
                    if (result) {
                        messagesContainerRef.current.addMessage("Успех", `Изображение вставлено`);
                    }
                    break;
                }
            }
            if (result) {
                const newFile = new File(
                    [await result.blob()],
                    `returned.pdf`,
                    {
                        type: "application/pdf"
                    }
                );
                setFileObject(newFile);
                setPdf(await createPdfObject(newFile));
                // event.target.reset();
            } else {
                messagesContainerRef.current.addError("Ошибка", "Не удалось отобразить файл после редактирования");
            }
            
        } catch (error) {
            messagesContainerRef.current.addError("Ошибка", error.message);
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
                                        {activeTool == "swap_pages" &&
                                            <SwapPagesFromContent
                                                pageCount={pdf ? pdf.numPages : 1}
                                                formOnSubmit={formSubmit}
                                            />                                            
                                        }
                                        {activeTool == "rotate_pages" &&
                                            <RotatePagesFormContent
                                                formOnSubmit={formSubmit}
                                            />                                            
                                        }
                                        {activeTool == "crop_page" &&
                                            <CropPageFormContent
                                                // pageWidth={1000}
                                                // pageHeight={1000}
                                                pageCount={pdf ? pdf.numPages : 1}
                                                formOnSubmit={formSubmit}
                                            />                                            
                                        }
                                        {activeTool == "insert_image" &&
                                            <InsertImageFormContent
                                                // pageWidth={1000}
                                                // pageHeight={1000}
                                                pageCount={pdf ? pdf.numPages : 1}
                                                formOnSubmit={formSubmit}
                                            />                                            
                                        }
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    class="danger"
                                    text="Скачать файл"
                                    onClick={downloadFile}
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