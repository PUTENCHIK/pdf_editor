import './DocumentDisplay.css'
import { forwardRef, useState, useImperativeHandle, useEffect } from 'react';

import DocumentPage from '../DocumentPage/DocumentPage';

const DocumentDisplay = forwardRef((props, ref) => {

    const [zoom, setZoom] = useState(1);
    const [children, setChildren] = useState([]);
    const [document, setDocument] = useState(props.document);

    useEffect(() => {
        console.log("Initial effect");
        if (document) {
            createPages();
        }
    }, []);

    useEffect(() => {
        console.log("Zoom effect");
        if (document) {
            createPages();
        }
    }, [zoom]);

    useEffect(() => {
        console.log("Document effect");
        if (document) {
            createPages();
            // =================================================================
            setZoom(zoom + 0.1);
            setZoom(zoom - 0.1);
            // =================================================================
        }
    }, [document]);

    async function createPages() {
        console.log("Creatin pages: ", document.numPages);
        console.log("Document:", document);
        
        let pages = [];

        for (let index = 1; index <= document.numPages; index++) {            
            let flag = false;
            let count = 1;
            try {
                while (!flag && count < 10) {
                    flag = true;
                    let page = await document.getPage(index);

                    let newPage = <DocumentPage
                        key={`page-${index}`}
                        page={page}
                        pageNumber={index}
                        zoom={zoom}
                    />;                    
                    pages.push(newPage);
                }
            } catch (error) {
                count += 1;
            }

            if (count == 10) {
                throw new Error("Не удалось открыть файл. Превышено количество попыток открытия");
            }
        }
        setChildren(pages);
    }

    useImperativeHandle(ref, () => {
        return {
            zoomIn() {
                setZoom(zoom + 0.1 < 5 ? zoom + 0.1 : zoom);
            },
            zoomOut() {
                setZoom(zoom - 0.1 > 0.25 ? zoom - 0.1 : zoom);
            },
            updateZoom(newZoom) {
                setZoom(newZoom);
            },
            updateDocument(newDocument) {           
                setDocument(newDocument);
            }
        }
    });

    return (
        <>
            <div className="document-display">
                {children}
            </div>
        </>
    );
});

export default DocumentDisplay;