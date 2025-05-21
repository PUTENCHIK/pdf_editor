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

import InsertImageFormContent from './components/InsertImageFormContent/InsertImageFormContent';

import MessageBlocksContainer from '../../components/MessageBlocksContainer/MessageBlocksContainer';
import ssm from '../../utils/SessionStorageManager';
import ZoomPanel from './components/ZoomPanel/ZoomPanel';
import RotateDocumentPanel from './components/RotateDocumentPanel/RotateDocumentPanel';
import CurrentPagePanel from './components/CurrentPagePanel/CurrentPagePanel';
import InstrumentsPanel from './components/InstrumentsPanel/InstrumentsPanel';
import ExtraPanel from './components/ExtraPanel/ExtraPanel';
import CropPageInfo from './components/CropPageInfo/CropPageInfo';
import roundNumber from '../../helpers/functions';

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
    
    const [cropingPage, setCropingPage] = useState(null);
    const [cropPageData, setCropPageData] = useState(null);
    
    const [insertImagePage, setInsertImagePage] = useState(false);
    const [imageData, setImageData] = useState([]);

    const [insertTextPage, setInsertTextPage] = useState(null);
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

    async function rotateDocument(isClockwise) {
        let result = await rotatePagesRequest(isClockwise);
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

    async function rotatePage(pageNumber, isClockwise) {
        let result = await rotatePageRequest(pageNumber, isClockwise);
        if (result) {
            await setDocumentFromBlob(result);
        } else {
            messagesContainerRef.current.addError("Поворот страницы", `Не удалось сделать поворот страницы ${pageNumber}`);
        }
    }

    async function cropPage() {
        let result = await cropPageRequest(
            cropingPage,
            roundNumber(cropPageData.x),
            roundNumber(cropPageData.y),
            roundNumber(cropPageData.width),
            roundNumber(cropPageData.height),
        );
        if (result) {
            await setDocumentFromBlob(result);
        } else {
            messagesContainerRef.current.addError("Обрезание страницы", `Не удалось обрезать страницу ${cropingPage}`);
        }
        setCropingPage(null);
        setCropPageData(null);
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
        setCropingPage(null);
        setInsertImagePage(false);
        setInsertTextPage(null);
    }

    function startCropPage() {
        setCropingPage(cropingPage ? null : currentPage);
    }

    function startInsertImage() {
        setInsertImagePage(!insertImagePage);
        if (insertImagePage) {
            setImageData([]);
        }
    }

    function startInsertText() {
        setInsertTextPage(insertTextPage ? null : currentPage);
    }

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
                                                    cropingPage={cropingPage}
                                                    insertImagePage={insertImagePage}
                                                    insertTextPage={insertTextPage}
                                                    onCropPage={startCropPage}
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
                                            currentPage={currentPage}
                                            cropingPage={cropingPage}
                                            updateCropPageData={setCropPageData}
                                            insertImagePage={insertImagePage}
                                            insertTextPage={insertTextPage}
                                            updateCurrentPage={setCurrentPage}
                                        />
                                    </>
                                )}
                            </div>
                            { (cropingPage || insertImagePage || insertTextPage) && (
                                <div className="interaction-segment">
                                    { (cropingPage && cropPageData) && 
                                        <CropPageInfo
                                            data={cropPageData}
                                            onClick={cropPage}
                                        />
                                    }
                                    { (insertImagePage) && 
                                        <InsertImageFormContent
                                            pageCount={pdf ? pdf.numPages : 1}
                                            inputFileButton={inputFileButton}
                                            formOnSubmit={formSubmit}
                                            imageData={imageData}
                                            setImageData={setImageData}
                                        />
                                    }
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
