import React, { useRef, forwardRef, useEffect, useImperativeHandle, useState } from "react";
import './MinimapDisplay.css'
import MinimapPage from "../MinimapPage/MinimapPage";

const MinimapDisplay = forwardRef((props, ref) => {
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
                let documentPage = <MinimapPage
                    key={pageNum}
                    page={page}
                    pageNumber={pageNum}
                    pageWidth={props.pageWidth}
                    onDeletePage={props.onDeletePage}
                    onRotatePage={props.onRotatePage}
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
        <div className="minimap-display">
            {numPages &&
                <>
                    {children}
                </>
            }
        </div>
    );
});

export default MinimapDisplay;