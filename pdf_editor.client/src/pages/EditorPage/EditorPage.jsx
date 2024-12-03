import './EditorPage.css'
import React, { useEffect, useState, useRef } from 'react'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/build/pdf'
import * as pdfjs from 'pdfjs-dist/build/pdf';

import Header from '../../components/Header/Header'
import RightMenu from './components/RightMenu/RightMenu'
import AddFile from '../../components/AddFile/AddFile'
import DocumentDisplay from '../../components/DocumentDisplay/DocumentDisplay'

GlobalWorkerOptions.workerSrc = './node_modules/pdfjs-dist/build/pdf.worker.mjs';
const EditorPage = () => {
    // переменная и хук, определяющие основной контент на странице
    // start - начальный выбор файла
    // display - отображение файла
    const [pageState, setPageState] = useState("start");
    const inputFileButton = useRef(null);

    const documentDisplay = useRef(null);
    const [pdf, setPdf] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

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
        const pdfDocument = await getDocument(URL.createObjectURL(file)).promise; // Загружаем PDF из Blob
        setPdf(pdfDocument);
    };

    function zoomIn() {
        documentDisplay.current.zoomIn();
    }

    function zoomOut() {
        documentDisplay.current.zoomOut();
    }

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
                                        <div className="group-right">
                                            <button onClick={zoomIn}>Zoom In</button>
                                            <button onClick={zoomOut}>Zoom Out</button>
                                        </div>
                                    </div>
                                    {pdf &&
                                        <DocumentDisplay
                                            document={pdf}
                                            ref={documentDisplay}
                                        />
                                    }
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