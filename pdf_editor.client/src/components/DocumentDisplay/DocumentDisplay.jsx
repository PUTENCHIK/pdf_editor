import { forwardRef, useState, useEffect, useImperativeHandle, useRef } from 'react';
import './DocumentDisplay.css'

import DocumentPage from '../DocumentPage/DocumentPage';

const DocumentDisplay = forwardRef((props, ref) => {
    const pageRefs = useRef([]);
    const [numPages, setNumPages] = useState(null);
    const [children, setChildren] = useState([]);

    async function loadPdf() {
        setChildren([]);
        try {
            const pdf = props.document;
            setNumPages(pdf.numPages);
            let pages = [];
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                let documentPage = <DocumentPage
                    key={pageNum}
                    pageNum={pageNum}
                    page={page}
                    zoom={props.zoom}
                    container={props.containerRef.current}
                    onVisible={props.updateCurrentPage}
                    ref={el => (pageRefs.current[pageNum - 1] = el)}
                />;

                pages.push(documentPage);
            }
            setChildren(pages);
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
                    {children}
                </>
            )}
            {!props.document && <p>Выберите PDF файл для отображения.</p>}
        </div>
    );
});

export default DocumentDisplay;