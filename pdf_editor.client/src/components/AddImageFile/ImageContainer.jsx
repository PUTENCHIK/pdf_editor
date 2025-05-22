import React, { useState, useRef, useEffect } from 'react';
import './AddImageFile.css';

const ImageContainer = ({ image, pageWidth, pageHeight }) => {
    const [position, setPosition] = useState({ x: image.x, y: image.y });
    const [size, setSize] = useState({ width: image.width, height: image.height });

    const isDragging = useRef(false);
    const isResizing = useRef(false);
    const resizeHandle = useRef(null);

    const dragStart = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0, width: 0, height: 0 });

    useEffect(() => {
        setPosition({ x: image.x, y: image.y });
        setSize({ width: image.width, height: image.height });
    }, [image]);

    const onMouseDownDrag = (e) => {
        e.preventDefault();
        isDragging.current = true;
        dragStart.current = {
            mouseX: e.pageX,
            mouseY: e.pageY,
            posX: position.x,
            posY: position.y,
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseDownResize = (e, handle) => {
        e.stopPropagation();
        e.preventDefault();
        isResizing.current = true;
        resizeHandle.current = handle;
        dragStart.current = {
            mouseX: e.pageX,
            mouseY: e.pageY,
            posX: position.x,
            posY: position.y,
            width: size.width,
            height: size.height,
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e) => {
        e.preventDefault();
        const dx = e.pageX - dragStart.current.mouseX;
        const dy = e.pageY - dragStart.current.mouseY;

        if (isDragging.current) {
            let newX = dragStart.current.posX + dx;
            let newY = dragStart.current.posY + dy;

            newX = Math.max(0, Math.min(newX, pageWidth - size.width));
            newY = Math.max(0, Math.min(newY, pageHeight - size.height));

            setPosition({ x: newX, y: newY });
        } else if (isResizing.current) {
            let newX = dragStart.current.posX;
            let newY = dragStart.current.posY;
            let newWidth = dragStart.current.width;
            let newHeight = dragStart.current.height;

            const minSize = 20;

            switch (resizeHandle.current) {
                case 'top-left':
                    newWidth = dragStart.current.width - dx;
                    newHeight = dragStart.current.height - dy;
                    newX = dragStart.current.posX + dx;
                    newY = dragStart.current.posY + dy;
                    break;
                case 'top-right':
                    newWidth = dragStart.current.width + dx;
                    newHeight = dragStart.current.height - dy;
                    newY = dragStart.current.posY + dy;
                    break;
                case 'bottom-left':
                    newWidth = dragStart.current.width - dx;
                    newHeight = dragStart.current.height + dy;
                    newX = dragStart.current.posX + dx;
                    break;
                case 'bottom-right':
                    newWidth = dragStart.current.width + dx;
                    newHeight = dragStart.current.height + dy;
                    break;
                default:
                    break;
            }

            if (newWidth < minSize) {
                newWidth = minSize;
                if (resizeHandle.current === 'top-left' || resizeHandle.current === 'bottom-left') {
                    newX = dragStart.current.posX + (dragStart.current.width - minSize);
                }
            }
            if (newHeight < minSize) {
                newHeight = minSize;
                if (resizeHandle.current === 'top-left' || resizeHandle.current === 'top-right') {
                    newY = dragStart.current.posY + (dragStart.current.height - minSize);
                }
            }

            if (newX < 0) {
                newWidth += newX;
                newX = 0;
            }
            if (newY < 0) {
                newHeight += newY;
                newY = 0;
            }
            if (newX + newWidth > pageWidth) {
                newWidth = pageWidth - newX;
            }
            if (newY + newHeight > pageHeight) {
                newHeight = pageHeight - newY;
            }

            setPosition({ x: newX, y: newY });
            setSize({ width: newWidth, height: newHeight });
        }
    };

    const onMouseUp = (e) => {
        e.preventDefault();
        isDragging.current = false;
        isResizing.current = false;
        resizeHandle.current = null;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    const resizeHandleStyle = (position) => {
        const baseStyle = {
            position: 'absolute',
            width: 12,
            height: 12,
            backgroundColor: 'white',
            border: '2px solid black',
            zIndex: 7,
        };
        switch (position) {
            case 'top-left':
                return { ...baseStyle, top: -6, left: -6, cursor: 'nwse-resize' };
            case 'top-right':
                return { ...baseStyle, top: -6, right: -6, cursor: 'nesw-resize' };
            case 'bottom-left':
                return { ...baseStyle, bottom: -6, left: -6, cursor: 'nesw-resize' };
            case 'bottom-right':
                return { ...baseStyle, bottom: -6, right: -6, cursor: 'nwse-resize' };
            default:
                return baseStyle;
        }
    };

    return (
        <div
            className="image-container"
            style={{
                position: 'absolute',
                left: position.x,
                top: position.y,
                width: size.width,
                height: size.height,
                userSelect: 'none',
                cursor: isDragging.current ? 'grabbing' : 'grab',
            }}
            onMouseDown={onMouseDownDrag}
        >
            <img
                src={image.src}
                alt={image.name}
                draggable={false}
                style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
            />
            <div
                className="resize-handle top-left"
                onMouseDown={(e) => onMouseDownResize(e, 'top-left')}
                style={resizeHandleStyle('top-left')}
            />
            <div
                className="resize-handle top-right"
                onMouseDown={(e) => onMouseDownResize(e, 'top-right')}
                style={resizeHandleStyle('top-right')}
            />
            <div
                className="resize-handle bottom-left"
                onMouseDown={(e) => onMouseDownResize(e, 'bottom-left')}
                style={resizeHandleStyle('bottom-left')}
            />
            <div
                className="resize-handle bottom-right"
                onMouseDown={(e) => onMouseDownResize(e, 'bottom-right')}
                style={resizeHandleStyle('bottom-right')}
            />
        </div>
    );
};

export default ImageContainer;
