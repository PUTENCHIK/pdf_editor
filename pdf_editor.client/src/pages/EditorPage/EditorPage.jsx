import './EditorPage.css'
import React, { useEffect, useState, useRef } from 'react'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/build/pdf'
import * as pdfjs from 'pdfjs-dist/build/pdf';

import Header from '../../components/Header/Header'
import RightMenu from './components/RightMenu/RightMenu'
import AddFile from '../../components/AddFile/AddFile'

GlobalWorkerOptions.workerSrc = './node_modules/pdfjs-dist/build/pdf.worker.mjs';
const EditorPage = () => {
    // переменная и хук, определяющие основной контент на странице
    // start - начальный выбор файла
    // display - отображение файла
    const [pageState, setPageState] = useState("start");
    const inputFileButton = useRef(null);

    const [documentPages, setDocumentPages] = useState([]);
    const [pdf, setPdf] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [zoom, setZoom] = useState(0.6);
    const canvasRef = useRef(null);

    // Обработка загрузки файла
    function handleFileChange() {
        const file = inputFileButton.current.getFile();
        
        if (file) {
            setPageState("display");
            loadPdf(file);
        }
    };

    // Функция для загрузки PDF-файла
    async function loadPdf(file) {
        // console.log('Загрузка PDF...');
        const pdfDocument = await getDocument(URL.createObjectURL(file)).promise; // Загружаем PDF из Blob
        // console.log('PDF загружен:', pdfDocument);
        setPdf(pdfDocument);
        // setError(null);
        // console.log('Количество страниц:', pdfDocument.numPages);
    };

    async function renderPage (pageNumber) {
        if (!pdf || currentPage < 1 || currentPage > pdf.numPages) {
            return;
        }
        let flag = false;
        let count = 1;

        while (flag == false && count < 10){
            try {
                flag=true
                const page = await pdf.getPage(currentPage);
                const viewport = page.getViewport({ scale: zoom });
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                await page.render({ canvasContext: ctx, viewport: viewport }).promise;
            } catch (error) {
                flag=false
                console.error('Ошибка рендеринга:', error);
                setError("Ошибка при рендеринге страницы.");
                count += 1;
            }
        }
    };

    useEffect(() => {
        renderPage();
    }, [pdf, currentPage, zoom]);

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (pdf && currentPage < pdf.numPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const zoomIn = () => setZoom(zoom * 1.2);

    const zoomOut = () => setZoom(zoom / 1.2);

    const handlePageChange = (event) => {
        console.log("handlePageChange");
        
        const pageNumber = parseInt(event.target.value, 10);
        if (pdf && pageNumber > 0 && pageNumber <= pdf.numPages) {
            setCurrentPage(pageNumber);
        } else {
            event.target.value = currentPage;
        }
    };

    return (
        <>
            <RightMenu showTools={pageState == "display"} />
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
                                <div className="document-container">
                                    <div className="buttons-container">
                                        <div className="group-left">
                                            <button onClick={goToPreviousPage} disabled={currentPage <= 1}>Previous</button>
                                            <input
                                                type="number"
                                                value={currentPage}
                                                onChange={handlePageChange}
                                                min="1"
                                                max={pdf ? pdf.numPages : 1}
                                            />
                                            <button onClick={goToNextPage} disabled={!pdf || currentPage >= pdf.numPages}>Next</button>
                                        </div>
                                        <div className="group-right">
                                            <button onClick={zoomIn}>Zoom In</button>
                                            <button onClick={zoomOut}>Zoom Out</button>
                                        </div>
                                    </div>
                                    <div className="document-display">
                                        <div id="canvas_container" style={{ border: '1px solid black', textAlign: 'center' }}>
                                            <canvas id="pdf_renderer" ref={canvasRef}></canvas>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="interaction-segment">

                            </div> */}
                        </>
                    }                    
                </main>
            </div>
        </>
    );
};

export default EditorPage;