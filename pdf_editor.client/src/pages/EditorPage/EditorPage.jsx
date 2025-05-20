import './EditorPage.css'
import React, { useState, useRef, useEffect } from 'react'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/build/pdf'
import * as pdfjs from 'pdfjs-dist/build/pdf';
import { startEditingRequest, deletePageRequest, rotatePagesRequest,
    swapPagesRequest, cropPageRequest, insertImageRequest,
    rotatePageRequest
} from '../../helpers/functionRequests'

import Header from '../../components/Header/Header'
import RightMenu from './components/RightMenu/RightMenu'
import AddFile from '../../components/AddFile/AddFile'
import DocumentDisplay from '../../components/DocumentDisplay/DocumentDisplay'
import Button from '../../components/Button/Button';
import MinimapDisplay from './components/MinimapDisplay/MinimapDisplay';

import DeletePageFormContent from './components/DeletePageFormContent/DeletePageFormContent';
import SwapPagesFormContent from './components/SwapPagesFormContent/SwapPagesFormContent';
import RotatePagesFormContent from './components/RotatePagesFormContent/RotatePagesFormContent';
import CropPageFormContent from './components/CropPageFormContent/CropPageFormContent';
import InsertImageFormContent from './components/InsertImageFormContent/InsertImageFormContent';

import MessageBlocksContainer from '../../components/MessageBlocksContainer/MessageBlocksContainer';
import ssm from '../../utils/SessionStorageManager';
import ZoomPanel from './components/ZoomPanel/ZoomPanel';
import RotateDocumentPanel from './components/RotateDocumentPanel/RotateDocumentPanel';
import CurrentPagePanel from './components/CurrentPagePanel/CurrentPagePanel';
import InstrumentsPanel from './components/InstrumentsPanel/InstrumentsPanel';
import ExtraPanel from './components/ExtraPanel/ExtraPanel';

GlobalWorkerOptions.workerSrc = './node_modules/pdfjs-dist/build/pdf.worker.mjs';
const EditorPage = () => {
    const minimapWidthPercent = 0.5;

    // переменная, определяющая основной контент на странице
    // start - начальный выбор файла
    // display - отображение файла
    const [pageState, setPageState] = useState("start");
    const [activeTool, setActiveTool] = useState("delete_page");
    
    const inputFileButton = useRef(null);
    const documentDisplay = useRef(null);
    const minimapDisplay = useRef(null);
    const minimapSegment = useRef(null);
    const documentSegment = useRef(null);

    const [fileObject, setFileObject] = useState(null);
    const [pdf, setPdf] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [minimapWidth, setMinimapWidth] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isInteractionSegmentVisible, setIsInteractionSegmentVisible] = useState(false);

    const messagesContainerRef = useRef(null);

    useEffect(() => {
        if (documentDisplay.current && pdf && zoom) {
            console.log("PDF file updated");
            documentDisplay.current.updateDocument();
            minimapDisplay.current.updateDocument();
        }
    }, [pdf, zoom]);

    useEffect(() => {
        async function createAndSetPdf() {
            setPdf(await createPdfObject());
        }
        
        if (fileObject) {
            createAndSetPdf();
            let minimapContainer = minimapSegment.current.getBoundingClientRect();
            setMinimapWidth(minimapWidthPercent * minimapContainer.width);
        }
    }, [fileObject]);

    async function createPdfObject() {
        return await getDocument(URL.createObjectURL(fileObject)).promise;
    }
    
    async function handleFileUpload() {
        const file = inputFileButton.current.getFile();
        
        if (file) {
            try {
                let fileId = await startEditingRequest(file);
                ssm.setFileId(fileId);
                setFileObject(file);
                setPageState("display");
                messagesContainerRef.current.addMessage("Загрузка файла", "ID файла сохранён");
            } catch (error) {
                messagesContainerRef.current.addError("Загрузка файла", "Не удалось загрузить файл на сервер");
            }
        }
    }

    async function setDocumentFromBlob(blob) {
        const newFile = new File(
            [blob], `updated.pdf`,
            { type: "application/pdf" }
        );
        setFileObject(newFile);
    }

    function updateZoom(newZoom) {
        setZoom(newZoom);
    }

    async function rotateDocument(newAngle) {
        let result = await rotatePagesRequest(newAngle);
        if (result) {
            await setDocumentFromBlob(result);
        } else {
            messagesContainerRef.current.addError("Поворот документа", "Не удалось сделать поворот");
        }
    }

    async function deletePage(pageNumber) {
        let result = await deletePageRequest(pageNumber);
        if (result) {
            await setDocumentFromBlob(result);
        } else {
            messagesContainerRef.current.addError("Удаление страницы", `Не удалось удалить страницу ${pageNumber}`);
        }
    }

    async function rotatePage(pageNumber, newAngle) {
        let result = await rotatePageRequest(pageNumber, newAngle);
        if (result) {
            await setDocumentFromBlob(result);
        } else {
            messagesContainerRef.current.addError("Поворот страницы", `Не удалось сделать поворот страницы ${pageNumber}`);
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

    function closeFile() {
        setFileObject(null);
        setPdf(null);
        setPageState('start');
    }

    function startClipPage() {

    }

    function startInsertImage() {

    }

    function startInsertText() {

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
                    // result = await deletePageRequest(fileObject, pageNumber);
                    result = await deletePageRequest(pageNumber);
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
                        messagesContainerRef.current.addError("Замещение страниц", "Не получено одно из полей с номером страницы");
                    }
                    result = await swapPagesRequest(page1, page2);
                    if (result) {
                        messagesContainerRef.current.addMessage("Успех", `Страницы ${page1} и ${page2} замещены`);
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
                    result = await rotatePagesRequest(degrees);
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
                    console.log(pageNumber, width, height, x, y);
                    
                    result = await cropPageRequest(pageNumber, width, height, x, y);
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
                    result = await insertImageRequest(imageFile, pageNumber, width, height, x, y);
                    if (result) {
                        messagesContainerRef.current.addMessage("Успех", `Изображение вставлено`);
                    }
                    break;
                }
            }
            if (result) {
                const newFile = new File(
                    [result],
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
            {/* <RightMenu
                showTools={pageState == "display"}
                onClick={rightMenuOnClick}
                activeTool={activeTool}
                ref={rightMenu}
            /> */}
            <div className="page-content">
                <Header linkRootExists={false} />
                <main className={"section editor-page" + (pageState == "display" ? " full" : "")}>
                    {pageState == "start" &&
                        <div className='start-state'>
                            <div className="__content">
                                <h1>Работа с вашими файлами</h1>
                                <p>Выберите файл с расширением PDF из вашего хранилища</p>
                                <AddFile 
                                    onChange={handleFileUpload}
                                    ref={inputFileButton}
                                />
                            </div>
                        </div>
                    }
                    {pageState == "display" &&
                        <>
                            <div className="minimap-segment" ref={minimapSegment}>
                                <MinimapDisplay
                                    ref={minimapDisplay}
                                    document={pdf}
                                    pageWidth={minimapWidth}
                                    currentPage={currentPage}
                                    onDeletePage={deletePage}
                                    onRotatePage={rotatePage}
                                />
                            </div>
                            <div className="document-segment" ref={documentSegment}>
                                {pdf &&
                                    <>
                                        <div className="instruments-container">
                                            <div className="side-block">
                                                <InstrumentsPanel
                                                    currentPage={currentPage}
                                                    onClipPage={startClipPage}
                                                    onInsertImage={startInsertImage}
                                                    onInsertText={startInsertText}
                                                />
                                                <RotateDocumentPanel
                                                    rotateDocument={rotateDocument}
                                                />
                                            </div>
                                            <div className="center-block">
                                                <ZoomPanel
                                                    updateZoom={updateZoom}
                                                />
                                            </div>
                                            <div className="side-block">
                                                <CurrentPagePanel
                                                    current={currentPage}
                                                    pages={pdf.numPages}
                                                />
                                                <ExtraPanel
                                                    onDownload={downloadFile}
                                                    onClose={closeFile}
                                                />
                                            </div>
                                        </div>
                                        <DocumentDisplay
                                            ref={documentDisplay}
                                            document={pdf}
                                            zoom={zoom}
                                            containerRef={documentSegment}
                                            updateCurrentPage={setCurrentPage}
                                        />
                                    </>
                                }
                            </div>
                            { isInteractionSegmentVisible &&
                                <div className="interaction-segment">
                                    {/*<Button
                                        type="submit"
                                        class="danger"
                                        text="Скачать файл"
                                        onClick={downloadFile}
                                    />
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
                                                <SwapPagesFormContent
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
                                    </div> */}
                                </div>
                            }
                        </>
                    }
                </main>
                <MessageBlocksContainer ref={messagesContainerRef} />
            </div>
        </>
    );
};

export default EditorPage;