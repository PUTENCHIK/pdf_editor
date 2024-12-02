import React, { useEffect, useState, useRef } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
import * as pdfjs from 'pdfjs-dist/build/pdf';
import Header from '../../components/Header/Header';
GlobalWorkerOptions.workerSrc = './node_modules/pdfjs-dist/build/pdf.worker.mjs';

const EditorPage = () => {
    const [pdf, setPdf] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [zoom, setZoom] = useState(1);
    const [error, setError] = useState(null);
    const canvasRef = useRef(null);

    // Функция для загрузки PDF-файла
    const loadPdf = async (file) => {
        console.log('Загрузка PDF...');
        const pdfDocument = await getDocument(URL.createObjectURL(file)).promise; // Загружаем PDF из Blob
        console.log('PDF загружен:', pdfDocument);
        setPdf(pdfDocument);
        setError(null);
        console.log('Количество страниц:', pdfDocument.numPages);
    };

    // Обработка изменения файла
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        
        if (file) {
            loadPdf(file);
        }
    };

    useEffect(() => {
        const renderPage = async () => {
            if (!pdf || currentPage < 1 || currentPage > pdf.numPages) {
                return;
            }
            var flag = false
            while (flag == false){
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
                }
            }
        };

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
        const pageNumber = parseInt(event.target.value, 10);
        if (pdf && pageNumber > 0 && pageNumber <= pdf.numPages) {
            setCurrentPage(pageNumber);
        } else {
            event.target.value = currentPage;
        }
    };

    return (
        <div>
            <Header />
            <h1>Editor Page</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Отображение ошибок */}
            <input
                type="file"
                accept=".pdf" // Ограничиваем выбор только PDF-файлами
                onChange={handleFileChange}
            />
            <div>
                <button onClick={goToPreviousPage} disabled={currentPage <= 1}>Previous</button>
                <input
                    type="number"
                    value={currentPage}
                    onChange={handlePageChange}
                    min="1"
                    max={pdf ? pdf.numPages : 1} // Устанавливаем максимум на количество страниц, если PDF загружен
                />
                <button onClick={goToNextPage} disabled={!pdf || currentPage >= pdf.numPages}>Next</button>
            </div>
            <div style={{ textAlign: 'center', margin: '10px 0' }}>
                <button onClick={zoomIn}>Zoom In</button>
                <button onClick={zoomOut}>Zoom Out</button>
            </div>
            <div id="canvas_container" style={{ border: '1px solid black', margin: '20px auto', textAlign: 'center' }}>
                <canvas id="pdf_renderer" ref={canvasRef}></canvas>
            </div>
        </div>
    );
};

export default EditorPage;