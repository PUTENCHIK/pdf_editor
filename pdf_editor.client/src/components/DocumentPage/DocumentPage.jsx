import './DocumentPage.css'
import { useRef, useEffect } from 'react';

function DocumentPage(props) {

    const canvas = useRef(null);

    async function renderPage() {
        const viewport = props.page.getViewport({ scale: props.zoom });
        
        const ctx = canvas.current.getContext('2d');
        ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
        ctx.beginPath();
        
        canvas.current.width = viewport.width;
        canvas.current.height = viewport.height;
        await props.page.render({
            canvasContext: ctx,
            viewport: viewport
        }).promise;
    }

    useEffect(() => {
        renderPage();
    }, [props.zoom]);

    return (
        <>
            <div id={`page-container-${props.pageNumber}`} style={{ border: '1px solid black', textAlign: 'center' }}>
                <canvas id={`canvas-${props.pageNumber}`} ref={canvas}></canvas>
            </div>
        </>
    );
}

export default DocumentPage;