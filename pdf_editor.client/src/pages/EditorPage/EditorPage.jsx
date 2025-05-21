import './EditorPage.css';
import React, { useState, useRef, useEffect } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
import * as pdfjs from 'pdfjs-dist/build/pdf';
import {
    startEditingRequest, deletePageRequest, rotatePagesRequest,
    swapPagesRequest, cropPageRequest, insertImageRequest,
    rotatePageRequest
} from '../../helpers/functionRequests';

import Header from '../../components/Header/Header';
import AddFile from '../../components/AddFile/AddFile';
import DocumentDisplay from '../../components/DocumentDisplay/DocumentDisplay';
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
    let [imageData, setImageData] = useState([]);
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        if (documentDisplay.current && pdf && zoom) {
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

    function closeFile() {
        setFileObject(null);
        setPdf(null);
        setPageState('start');
    }

    function startClipPage() { }

    function startInsertImage() {
        if (isInteractionSegmentVisible == false) {
            setIsInteractionSegmentVisible(true);
            setActiveTool("insert_image"); // Устанавливаем активный инструмент
        }
        else {
            setIsInteractionSegmentVisible(false);
        }
    }

    function startInsertText() { }

    async function formSubmit(event) {
        event.preventDefault();

        let result;
        try {
            switch (activeTool) {
                case "delete_page":
                    let pageNumber = event.target.page_number.value;
                    result = await deletePageRequest(pageNumber);
                    if (result) {
                        messagesContainerRef.current.addMessage("Успех", "Страница удалена");
                    }
                    break;
                case "swap_pages":
                    let page1 = event.target.page_1.value;
                    let page2 = event.target.page_2.value;
                    result = await swapPagesRequest(page1, page2);
                    if (result) {
                        messagesContainerRef.current.addMessage("Успех", `Страницы ${page1} и ${page2} замещены`);
                    }
                    break;
                case "rotate_pages":
                    let degrees = event.target.degrees.value;
                    result = await rotatePagesRequest(degrees);
                    if (result) {
                        messagesContainerRef.current.addMessage("Успех", `Документ повёрнут на ${degrees}°`);
                    }
                    break;
                case "crop_page":
                    let cropPageNumber = event.target.page_number.value;
                    let width = event.target.width.value;
                    let height = event.target.height.value;
                    let x = event.target.x.value;
                    let y = event.target.y.value;
                    result = await cropPageRequest(cropPageNumber, width, height, x, y);
                    if (result) {
                        messagesContainerRef.current.addMessage("Успех",
                            `Документ обрезан; точка: (${x}, ${y}), размеры: (${width}, ${height})`
                        );
                    }
                    break;
                case "insert_image":
                    const images = inputFileButton.current.getImageData();
                    if (!images || !images.length) {
                        messagesContainerRef.current.addError("Вставка изображения", "Не получено одно из полей формы");
                        return;
                    }
                    result = await insertImageRequest(images);
                    if (result) {
                        messagesContainerRef.current.addMessage("Успех", "Изображение вставлено");
                        setImageData([]);
                    }
                    break;
            }
            if (result) {
                //const newFile = new File([result], `returned.pdf`, { type: "application/pdf" });
                //setFileObject(newFile);
                //setPdf(await createPdfObject(newFile));
                await setDocumentFromBlob(result);
            } else {
                messagesContainerRef.current.addError("Ошибка", "Не удалось отобразить файл после редактирования");
            }
        } catch (error) {
            messagesContainerRef.current.addError("Ошибка", error.message);
        }
    }

    return (
        <>
            <div className="page-content">
                <Header linkRootExists={false} />
                <main className={"section editor-page" + (pageState === "display" ? " full" : "")}>
                    {pageState === "start" && (
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
                    )}
                    {pageState === "display" && (
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
                                {pdf && (
                                    <>
                                        <div className="instruments-container">
                                            <div className="side-block">
                                                <InstrumentsPanel
                                                    currentPage={currentPage}
                                                    onClipPage={startClipPage}
                                                    onInsertImage={startInsertImage}
                                                    onInsertText={startInsertText}
                                                />
                                                <RotateDocumentPanel rotateDocument={rotateDocument} />
                                            </div>
                                            <div className="center-block">
                                                <ZoomPanel updateZoom={updateZoom} />
                                            </div>
                                            <div className="side-block">
                                                <CurrentPagePanel current={currentPage} pages={pdf.numPages} />
                                                <ExtraPanel onClose={closeFile} />
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
                                )}
                            </div>
                            {isInteractionSegmentVisible && (
                                <div className="interaction-segment" style={{ padding: '20px', marginTop: '20px' }}>
                                    <div className="interaction-field">
                                        <div className="__content">
                                            {activeTool === "delete_page" && (
                                                <DeletePageFormContent
                                                    pageCount={pdf ? pdf.numPages : 1}
                                                    formOnSubmit={formSubmit}
                                                />
                                            )}
                                            {activeTool === "swap_pages" && (
                                                <SwapPagesFormContent
                                                    pageCount={pdf ? pdf.numPages : 1}
                                                    formOnSubmit={formSubmit}
                                                />
                                            )}
                                            {activeTool === "rotate_pages" && (
                                                <RotatePagesFormContent formOnSubmit={formSubmit} />
                                            )}
                                            {activeTool === "crop_page" && (
                                                <CropPageFormContent
                                                    pageCount={pdf ? pdf.numPages : 1}
                                                    formOnSubmit={formSubmit}
                                                />
                                            )}
                                            {activeTool === "insert_image" && (
                                                <InsertImageFormContent
                                                    pageCount={pdf ? pdf.numPages : 1}
                                                    inputFileButton={inputFileButton}
                                                    formOnSubmit={formSubmit}
                                                    imageData={imageData}
                                                    setImageData={setImageData}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </main>
                <MessageBlocksContainer ref={messagesContainerRef} />
            </div>
        </>
    );
};

export default EditorPage;
