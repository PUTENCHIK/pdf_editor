import './EditorPage.css';
import React, { useState, useRef, useEffect } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
import * as pdfjs from 'pdfjs-dist/build/pdf';
import {
    startEditingRequest, deletePageRequest, rotatePagesRequest,
    swapPagesRequest, cropPageRequest, insertImageRequest,
    rotatePageRequest, insertTextRequest
} from '../../helpers/functionRequests';
import {downloadFile, roundNumber} from '../../helpers/functions';

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
import InsertTextPanel from './components/InsertTextPanel/InsertTextPanel';
import FormsContainer from '../../components/FormsContainer/FormsContainer';
import SwapPagesPanel from './components/SwapPagesPanel/SwapPagesPanel';

GlobalWorkerOptions.workerSrc = './node_modules/pdfjs-dist/build/pdf.worker.mjs';

const EditorPage = () => {
    const minimapWidthPercent = 0.5;

    const [pageState, setPageState] = useState("start");

    const inputFileButton = useRef(null);
    const documentDisplay = useRef(null);
    const minimapDisplay = useRef(null);
    const minimapSegment = useRef(null);
    const documentSegment = useRef(null);

    const messagesContainerRef = useRef(null);
    const formsContainerRef = useRef(null);

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
    const [insertTextDocumentData, setInsertTextDocumentData] = useState(null);
    const [insertTextPanelData, setInsertTextPanelData] = useState(null);

    const [isSwapingPages, setIsSwapingPages] = useState(false);
    const [swapPagesData, setSwapPagesData] = useState(null);

    const [isConfirmingClosing, setIsConfirmingClosing] = useState(false);

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

    async function insertImage() {
        const images = inputFileButton.current.getImageData();
        if (!images || !images.length) {
            messagesContainerRef.current.addError("Вставка изображения", "Не получено одно из полей формы");
            return;
        }
        let result = await insertImageRequest(images, pdf);
        removeImageContainers();
        setImageData([]);
        if (result) {
            await setDocumentFromBlob(result);
        } else {
            messagesContainerRef.current.addError("Ошибка", "Не удалось вставить изображение");
        }
    }

    async function insertTextIntoPage() {
        let data = {...insertTextPanelData, ...insertTextDocumentData};
        if (!data.text.trim().length) {
            messagesContainerRef.current.addError("Вставка текста", "Сперва введите текст");
            return;
        }
        data.x = roundNumber(data.x);
        data.y = roundNumber(data.y);

        let result = await insertTextRequest(data.backgroundColor != null, insertTextPage, data);
        if (result) {
            await setDocumentFromBlob(result);
        } else {
            messagesContainerRef.current.addError("Вставка текста", `Не удалось вставить текст на страницу ${insertTextPage}`);
        }
        disableAllFunctions();
    }

    async function swapPages() {
        let pf = swapPagesData.pageFrom, pt = swapPagesData.pageTo;
        let result = await swapPagesRequest(Number(pf), Number(pt));
        if (result) {
            await setDocumentFromBlob(result);
        } else {
            messagesContainerRef.current.addError("Перемещение страниц", `Не удалось поменять местами ${pf} и ${pt} страницы`);
        }
        disableAllFunctions();
    }

    function handleDownloadFile() {
        downloadFile(fileObject, "editted.pdf", true);
    }

    function disableAllFunctions() {
        setCropingPage(null);
        setInsertImagePage(false);
        setImageData([]);
        removeImageContainers();
        setInsertTextPage(null);
        setInsertTextDocumentData(null)
        setInsertTextPanelData(null);
        setIsConfirmingClosing(false);
        setIsSwapingPages(false);
        setSwapPagesData(null);
    }

    function closeFile() {
        setFileObject(null);
        setPdf(null);
        setPageState('start');
        disableAllFunctions();
        setIsConfirmingClosing(false);
    }

    function startCropPage() {
        disableAllFunctions();
        setCropingPage(cropingPage ? null : currentPage);
    }

    function startInsertImage() {
        disableAllFunctions();
        setInsertImagePage(!insertImagePage);
    }

    function startInsertText() {
        disableAllFunctions();
        setInsertTextPage(insertTextPage ? null : currentPage);
    }

    function startSwapPages() {
        disableAllFunctions();
        setIsSwapingPages(!isSwapingPages);
    }

    function removeImageContainers() {
        const elements = document.querySelectorAll('.image-container');
        elements.forEach(element => {
            const parentElement = element.parentNode;
            if (parentElement) {
                parentElement.remove();
            }
        });
    }

    return (
        <>
            <div className="page-content">
                <Header />
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
                                                    isSwapingPages={isSwapingPages}
                                                    onCropPage={startCropPage}
                                                    onInsertImage={startInsertImage}
                                                    onInsertText={startInsertText}
                                                    onSwapPages={startSwapPages}
                                                />
                                                <RotateDocumentPanel rotateDocument={rotateDocument} />
                                            </div>
                                            <div className="center-block">
                                                <ZoomPanel updateZoom={updateZoom} />
                                            </div>
                                            <div className="side-block">
                                                <CurrentPagePanel current={currentPage} pages={pdf.numPages} />
                                                <ExtraPanel
                                                    onDownload={handleDownloadFile}
                                                    onClose={() => setIsConfirmingClosing(true)}
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
                                            insertTextData={insertTextPanelData}
                                            updateInsertTextData={setInsertTextDocumentData}
                                            updateCurrentPage={setCurrentPage}
                                        />
                                    </>
                                )}
                            </div>
                            { (cropingPage || insertImagePage || insertTextPage || isSwapingPages) && (
                                <div className="interaction-segment">
                                    { (cropingPage && cropPageData) && 
                                        <CropPageInfo
                                            page={cropingPage}
                                            data={cropPageData}
                                            onClick={cropPage}
                                        />
                                    }
                                    { insertImagePage && 
                                        <InsertImageFormContent
                                            pageCount={pdf ? pdf.numPages : 1}
                                            inputFileButton={inputFileButton}
                                            imageData={imageData}
                                            setImageData={setImageData}
                                            onClick={insertImage}
                                        />
                                    }
                                    { insertTextPage &&
                                        <InsertTextPanel
                                            page={insertTextPage}
                                            documentData={insertTextDocumentData}
                                            updateData={setInsertTextPanelData}
                                            onClick={insertTextIntoPage}
                                        />
                                    }
                                    { isSwapingPages &&
                                        <SwapPagesPanel
                                            pages={pdf.numPages}
                                            updateData={setSwapPagesData}
                                            onClick={swapPages}
                                        />
                                    }
                                </div>
                            )}
                        </>
                    )}
                </main>
                <MessageBlocksContainer ref={messagesContainerRef} />
                { isConfirmingClosing &&
                    <FormsContainer
                        isConfirmingClosing={isConfirmingClosing}
                        onCloseContainer={disableAllFunctions}
                        onConfirmClosingFile={closeFile}
                        ref={formsContainerRef}
                    />
                }
            </div>
        </>
    );
};

export default EditorPage;
