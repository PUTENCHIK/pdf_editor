import React, { forwardRef, useImperativeHandle, useState } from "react";
import './MinimapDisplay.css'
import MinimapPage from "../MinimapPage/MinimapPage";

const MinimapDisplay = forwardRef((props, ref) => {
    const [numPages, setNumPages] = useState(null);
    const [pageObjects, setPageObjects] = useState([]);

    async function loadPdf() {
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
        <div className="minimap-display">
            {numPages &&
                <>
                    {pageObjects.map((pageObject) => (
                        <MinimapPage
                            key={pageObject.pageNum}
                            page={pageObject.page}
                            pageNumber={pageObject.pageNum}
                            pageWidth={props.pageWidth}
                            isCurrent={props.currentPage == pageObject.pageNum}
                            onDeletePage={props.onDeletePage}
                            onRotatePage={props.onRotatePage}
                        />
                    ))}
                </>
            }
            
        </div>
    );
});

export default MinimapDisplay;