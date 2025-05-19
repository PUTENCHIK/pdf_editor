import React, { useRef, forwardRef, useEffect, useImperativeHandle, useState } from "react";
import './MinimapDisplay.css'
import MinimapPage from "../MinimapPage/MinimapPage";

const MinimapDisplay = forwardRef((props, ref) => {
    const [zoom, setZoom] = useState(0.5);
    const [children, setChildren] = useState([]);
    const [document, setDocument] = useState(props.document);

    // useEffect(() => {
    //     if (document) {
    //         console.log("Minimap initial effect");
    //         createPages();
    //     }
    // }, []);

    useEffect(() => {
        console.log("Minimap zoom effect");
        if (document) {
            createPages();
            console.log("New zoom:", zoom);
        }
    }, [zoom]);

    useEffect(() => {
        console.log("Minimap document effect");
        if (document) {
            createPages();
            // setZoom(zoom * 1.1);
            // setZoom(zoom / 1.1);
        }
    }, [document]);

    async function createPages() {
        console.log("Creating pages in Minimap: ", document.numPages);
        console.log("Minimap Document:", document);
        
        let pages = [];

        for (let index = 1; index <= document.numPages; index++) {
            let flag = false;
            let count = 1;
            try {
                while (!flag && count < 10) {
                    flag = true;
                    let page = await document.getPage(index);
                    let newPage = <MinimapPage
                        key={`page-${index}`}
                        page={page}
                        pageNumber={index}
                        zoom={zoom}
                        onDeletePage={props.onDeletePage}
                        onRotatePage={props.onRotatePage}
                    />
                    
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
            updateDocument(newDocument) {           
                setDocument(newDocument);
            }
        }
    });

    return (
        <div className="minimap-display">
            {children}
        </div>
    );
});

export default MinimapDisplay;