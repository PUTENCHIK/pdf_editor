import { useRef, useEffect, forwardRef } from 'react';
import './DocumentPage.css'

const DocumentPage = forwardRef((props, outRef) => {
    const canvas = useRef(null);

    useEffect(() => {
        if (props.container) {
            const handleIntersection = (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        props.onVisible(props.pageNum);
                    }
                });
            };

            const pageObserver = new IntersectionObserver(handleIntersection, {
                root: props.container,
                rootMargin: '0px',
                threshold: 0.5,
            });

            pageObserver.observe(canvas.current);
        }
        return undefined;
    }, [props.container]);

    async function renderPage() {
        const originViewport = props.page.getViewport({ scale: 1.0 });
        let zoom = props.zoom ?? (props.pageWidth ?? originViewport.width) / originViewport.width;

        const canvasContext = canvas.current.getContext('2d');
        const viewport = props.page.getViewport({ scale: zoom });
        canvas.current.width = viewport.width;
        canvas.current.height = viewport.height;
        await props.page.render({
            canvasContext,
            viewport,
        }).promise;
    }

    useEffect(() => {
        renderPage();
    }, [props.page, props.zoom]);

    return (
        <div ref={outRef}>
            <canvas className={props.isCurrent ? "current-page" : null} ref={canvas}></canvas>
        </div>
    );
});

export default DocumentPage;