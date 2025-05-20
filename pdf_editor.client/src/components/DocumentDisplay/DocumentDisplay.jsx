import { forwardRef, useState, useEffect, useImperativeHandle, useRef } from 'react';
import './DocumentDisplay.css'

import DocumentPage from '../DocumentPage/DocumentPage';

const DocumentDisplay = forwardRef((props, ref) => {
    const [numPages, setNumPages] = useState(null);
    const [pageObjects, setPageObjects] = useState([]);

    async function loadPdf() {
        // setChildren([]);
        try {
            const pdf = props.document;
            setNumPages(pdf.numPages);
            let pages = [];
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                pages.push({
                    page: await pdf.getPage(pageNum),
                    pageNum: pageNum
                });
            }
            setPageObjects(pages);
        } catch (err) {
            console.error("Ошибка при загрузке PDF:", err);
        }
    }

    useImperativeHandle(ref, () => {
        return {
            updateDocument() {
                loadPdf();
            }
        }
    });

    return (
        <div className="document-display">
            {numPages && (
                <>
                    {pageObjects.map((pageObject) => (
                        <DocumentPage
                            key={pageObject.pageNum}
                            pageNum={pageObject.pageNum}
                            page={pageObject.page}
                            zoom={props.zoom}
                            container={props.containerRef.current}
                            onVisible={props.updateCurrentPage}
                            // ref={el => (pageRefs.current[pageNum - 1] = el)}
                        />
                    ))}
                </>
            )}
            {!props.document && <p>Выберите PDF файл для отображения.</p>}
        </div>
    );
});

export default DocumentDisplay;