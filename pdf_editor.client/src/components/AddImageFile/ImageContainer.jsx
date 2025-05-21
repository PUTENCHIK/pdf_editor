    import React, { useState, useRef, useEffect } from 'react';
    import './AddImageFile.css'; // Ensure this path is correct

    const ImageContainer = ({ image, pageWidth, pageHeight }) => {
        const [position, setPosition] = useState({ x: image.x, y: image.y });
        const [size, setSize] = useState({ width: image.width, height: image.height });
        const [isDragging, setIsDragging] = useState(false);
        const [isResizing, setIsResizing] = useState(false);
        const [resizeHandle, setResizeHandle] = useState(null);
        const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
        const containerRef = useRef(null);

        useEffect(() => {
            setPosition({ x: image.x, y: image.y });
            setSize({ width: image.width, height: image.height });
        }, [image.x, image.y, image.width, image.height]);

        const handleMouseDown = (e) => {
            e.preventDefault(); // Prevent default drag behavior
            setIsDragging(!isDragging);
            setDragStart({ x: e.clientX, y: e.clientY });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);
        };

        const handleMouseMove = (e) => {
            if (isDragging && !isResizing) {
                const deltaX = e.clientX - dragStart.x;
                const deltaY = e.clientY - dragStart.y;

                setPosition((prevPosition) => {
                    let newX = prevPosition.x + deltaX;
                    let newY = prevPosition.y + deltaY;

                    // Keep image within page bounds
                    newX = Math.max(0, Math.min(newX, pageWidth - size.width));

                    return { x: newX, y: newY };
                });

                setDragStart({ x: e.clientX, y: e.clientY });
            } else if (isResizing && resizeHandle) {
                const deltaX = e.clientX - dragStart.x;
                const deltaY = e.clientY - dragStart.y;

                setSize((prevSize) => {
                    let newWidth = prevSize.width;
                    let newHeight = prevSize.height;
                    let newX = position.x;
                    let newY = position.y;

                    switch (resizeHandle) {
                        case 'top-left':
                            newWidth -= deltaX;
                            newHeight -= deltaY;
                            newX += deltaX;
                            newY += deltaY;
                            break;
                        case 'top-right':
                            newWidth += deltaX;
                            newHeight -= deltaY;
                            newY += deltaY;
                            break;
                        case 'bottom-left':
                            newWidth -= deltaX;
                            newHeight += deltaY;
                            newX += deltaX;
                            break;
                        case 'bottom-right':
                            newWidth += deltaX;
                            newHeight += deltaY;
                            break;
                        default:
                            break;
                    }

                    // Minimum size constraint
                    const minSize = 20;
                    newWidth = Math.max(newWidth, minSize);
                    newHeight = Math.max(newHeight, minSize);

                    // Keep image within page bounds while resizing (simplified)
                    newX = Math.min(newX, pageWidth - newWidth);
                    newY = Math.min(newY, pageHeight - newHeight);

                    return { width: newWidth, height: newHeight };
                });

                setPosition((prevPosition) => {
                    let newX = prevPosition.x;
                    let newY = prevPosition.y;

                    switch (resizeHandle) {
                        case 'top-left':
                            newX += deltaX;
                            newY += deltaY;
                            break;
                        case 'top-right':
                            newY += deltaY;
                            break;
                        case 'bottom-left':
                            newX += deltaX;
                            break;
                        default:
                            break;
                    }

                    return { x: newX, y: newY };
                });
                setDragStart({ x: e.clientX, y: e.clientY });
            }
        };

        const handleResizeHandleMouseDown = (e, handle) => {
            e.stopPropagation(); // Prevent dragging when resizing
            setIsResizing(true);
            setResizeHandle(handle);
            setDragStart({ x: e.clientX, y: e.clientY })
        };

        useEffect(() => {
            const handleMouseUp = () => {
                setIsResizing(false);
                setResizeHandle(null);
            };

            document.addEventListener('mouseup', handleMouseUp);

            return () => {
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }, []);

        return (
            <div
                ref={containerRef}
                className="image-container"
                style={{
                    position: 'absolute',
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    width: `${size.width}px`,
                    height: `${size.height}px`,
                    cursor: isDragging ? 'grabbing' : 'grab',
                }}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                <img src={image.src} alt={image.name} style={{ width: '100%', height: '100%', userSelect: 'none' }} />
                {/* Resize Handles */}
                <div
                    className="resize-handle top-left"
                    onMouseDown={(e) => handleResizeHandleMouseDown(e, 'top-left')}
                />
                <div
                    className="resize-handle top-right"
                    onMouseDown={(e) => handleResizeHandleMouseDown(e, 'top-right')}
                />
                <div
                    className="resize-handle bottom-left"
                    onMouseDown={(e) => handleResizeHandleMouseDown(e, 'bottom-left')}
                />
                <div
                    className="resize-handle bottom-right"
                    onMouseDown={(e) => handleResizeHandleMouseDown(e, 'bottom-right')}
                />
            </div>
        );
    };

    export default ImageContainer;