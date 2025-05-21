import { useRef, useEffect, forwardRef, useState } from 'react';
import './DocumentPage.css'
import CropingField from '../../pages/EditorPage/components/CropingField/CropingField';
import TextField from '../../pages/EditorPage/components/TextField/TextField';

const DocumentPage = forwardRef((props, outRef) => {
    const visibleThreshold = 0.8;
    const canvas = useRef(null);
    const [originPageWidth, setOriginPageWidth] = useState(0);
    const [originPageHeight, setOriginPageHeight] = useState(0);
    const [pageWidth, setPageWidth] = useState(0);
    const [pageHeight, setPageHeight] = useState(0);
    const [pageZoom, setPageZoom] = useState(1);

    async function renderPage() {
        const originViewport = props.page.getViewport({ scale: 1.0 });
        setOriginPageWidth(originViewport.width);
        setOriginPageHeight(originViewport.height);
        let zoom = props.zoom ?? (props.pageWidth ?? originViewport.width) / originViewport.width;
        setPageZoom(zoom);

        const canvasContext = canvas.current.getContext('2d');
        const viewport = props.page.getViewport({ scale: zoom });
        canvas.current.width = viewport.width;
        setPageWidth(viewport.width);
        canvas.current.height = viewport.height;
        setPageHeight(viewport.height);
        await props.page.render({
            canvasContext,
            viewport,
        }).promise;
    }

    function handleDataUpdated(newData) {
        props.updateCropPageData({
            x: newData.x * originPageWidth,
            y: newData.y * originPageHeight,
            width: newData.width * originPageWidth,
            height: newData.height * originPageHeight,
        });
    }

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
                threshold: visibleThreshold,
            });

            pageObserver.observe(canvas.current);
        }
        return undefined;
    }, [props.container]);

    useEffect(() => {
        renderPage();
    }, [props.page, props.zoom]);

    return (
        <div className='page-wrapper' ref={outRef}>
            { props.isCroping &&
                <CropingField
                    pageWidth={pageWidth}
                    pageHeight={pageHeight}
                    updateData={handleDataUpdated}
                />
            }
            { props.isInsertText &&
                <TextField
                    pageWidth={pageWidth}
                    pageHeight={pageHeight}
                    pageZoom={pageZoom}
                    data={props.insertTextData}
                />
            }
            <canvas id={`canvas-${props.pageNum}`} className={props.isCurrent ? "current-page" : null} ref={canvas}></canvas>
        </div>
    );
});

export default DocumentPage;