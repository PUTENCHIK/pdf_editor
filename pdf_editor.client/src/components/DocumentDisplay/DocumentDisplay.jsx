import './DocumentDisplay.css'
import { forwardRef, useState, useImperativeHandle, useEffect } from 'react';

import DocumentPage from '../DocumentPage/DocumentPage';

const DocumentDisplay = forwardRef((props, ref) => {

    let [zoom, setZoom] = useState(1);
    let [children, setChildren] = useState([]);

    useEffect(() => {
        if (!props.document) {
            return;
        }
        createPages();
    }, []);

    useEffect(() => {
        if (!props.document) {
            return;
        }
        createPages();
    }, [zoom]);

    async function createPages() {
        let pages = [];

        for (let index = 1; index <= props.document.numPages; index++) {            
            let flag = false;
            let count = 1;
            try {
                while (!flag && count < 10) {
                    flag = true;
                    let page = await props.document.getPage(index);

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
                setZoom(zoom * 1.2 < 2 ? zoom * 1.2 : zoom);
            },
            zoomOut() {
                setZoom(zoom / 1.2 > 0.2 ? zoom / 1.2 : zoom);
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