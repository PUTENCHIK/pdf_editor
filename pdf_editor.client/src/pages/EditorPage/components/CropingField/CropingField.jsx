import { useRef, useState, useEffect } from 'react';
import './CropingField.css'

const CropingField = (props) => {
    const defaultPadding = 0.1;
    const minDeltaPx = 5;
    const resizerSize = 5;  //px

    const topArea = useRef(null);
    const bottomArea = useRef(null);
    const rightArea = useRef(null);
    const leftArea = useRef(null);

    const [top, setTop] = useState(defaultPadding);
    const [bottom, setBottom] = useState(defaultPadding);
    const [left, setLeft] = useState(defaultPadding);
    const [right, setRight] = useState(defaultPadding);

    const [isTopResizing, setIsTopResizing] = useState(false);
    const [isBottomResizing, setIsBottomResizing] = useState(false);
    const [isLeftResizing, setIsLeftResizing] = useState(false);
    const [isRightResizing, setIsRightResizing] = useState(false);

    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [isRestMoving, setIsRestMoving] = useState(false);

    useEffect(() => {
        props.updateData({
            x: left,
            y: bottom,
            width: (1-right-left),
            height: (1-bottom-top)
        });
    }, [top, bottom, left, right]);

    useEffect(() => {
        const handleMouseMove = (event) => {
            if (isTopResizing) {
                const containerRect = topArea.current.getBoundingClientRect();
                let height = (event.clientY - containerRect.top) / props.pageHeight;
    
                height = height < 0 ? 0 : height;
                const maxHeight = (1-bottom-(minDeltaPx/props.pageHeight));
                height = height >= maxHeight ? maxHeight : height;
    
                setTop(height);
            } else if (isBottomResizing) {
                const containerRect = bottomArea.current.getBoundingClientRect();
                let height = (containerRect.bottom - event.clientY) / props.pageHeight;
    
                height = height < 0 ? 0 : height;
                const maxHeight = (1-top-(minDeltaPx/props.pageHeight));
                height = height >= maxHeight ? maxHeight : height;
    
                setBottom(height);
            } else if (isLeftResizing) {
                const containerRect = leftArea.current.getBoundingClientRect();
                let width = (event.clientX - containerRect.left) / props.pageWidth;
                
                width = width < 0 ? 0 : width;
                const maxWidth = (1-right-(minDeltaPx/props.pageWidth));
                width = width >= maxWidth ? maxWidth : width;
                
                setLeft(width);
            } else if (isRightResizing) {
                const containerRect = rightArea.current.getBoundingClientRect();
                let width = (containerRect.right - event.clientX) / props.pageWidth;
                
                width = width < 0 ? 0 : width;
                const maxWidth = (1-left-(minDeltaPx/props.pageWidth));
                width = width >= maxWidth ? maxWidth : width;
                
                setRight(width);
            }
        };

        const handleMouseUp = () => {
            setIsTopResizing(false);
            setIsBottomResizing(false);
            setIsLeftResizing(false);
            setIsRightResizing(false);
        };

        if (isTopResizing || isBottomResizing || isLeftResizing || isRightResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isTopResizing, isBottomResizing, isLeftResizing, isRightResizing]);

    useEffect(() => {
        let lastTop, lastBottom, lastLeft, lastRight;
        const handleMouseMove = (event) => {
            if (!isRestMoving) return;

            let newTop = top + (event.clientY - startY) / props.pageHeight;
            let newBottom = bottom - (event.clientY - startY) / props.pageHeight;
            let newLeft = left + (event.clientX - startX) / props.pageWidth;
            let newRight = right - (event.clientX - startX) / props.pageWidth;

            newTop = newTop < 0 ? 0 : newTop;
            newBottom = newBottom < 0 ? 0 : newBottom;
            newLeft = newLeft < 0 ? 0 : newLeft;
            newRight = newRight < 0 ? 0 : newRight;
            
            let arr = [newTop, newBottom, newLeft, newRight];
            let zeros = arr.filter((item) => {
                return item == 0;
            }).length;
            
            if (zeros == 0) {
                lastTop = newTop;
                lastBottom = newBottom;
                lastRight = newRight;
                lastLeft = newLeft;

            } else {
                if (!newBottom) newTop = lastTop;
                else lastTop = newTop;

                if (!newTop) newBottom = lastBottom;
                else lastBottom = newBottom;

                if (!newLeft) newRight = lastRight;
                else lastRight = newRight;

                if (!newRight) newLeft = lastLeft;
                else lastLeft = newLeft;
            }

            setTop(newTop);
            setBottom(newBottom);
            setLeft(newLeft);
            setRight(newRight);
        };

        const handleMouseUp = () => {
            setIsRestMoving(false);
        };

        if (isRestMoving) {
            lastTop = top;
            lastBottom = bottom;
            lastLeft = left;
            lastRight = right;
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isRestMoving]);

    function handleTopMD(event) {
        event.preventDefault();
        setIsTopResizing(true);
    }

    function handleBottomMD(event) {
        event.preventDefault();
        setIsBottomResizing(true);
    }

    function handleLeftMD(event) {
        event.preventDefault();
        setIsLeftResizing(true);
    }

    function handleRightMD(event) {
        event.preventDefault();
        setIsRightResizing(true);
    }

    function handleRestMD(event) {
        event.preventDefault();
        setStartX(event.clientX);
        setStartY(event.clientY);
        setIsRestMoving(true);
    }

    return (
        <div className='croping-field'>
            <div className="top-box">
                <div className="corner" style={{width: `${left * props.pageWidth}px`}}></div>
                <div className="croping-area top"
                    ref={topArea}
                    style={{minHeight: `${top * props.pageHeight}px`, minWidth: `${(1-right-left)*props.pageWidth}px`}}>
                        <div className={"resizer" + (isTopResizing && !isRestMoving ? " current" : "")}
                            style={{minHeight: `${resizerSize}px`, width: `${(1-right-left)*props.pageWidth}px`}}
                            onMouseDown={handleTopMD}></div>
                </div>
                <div className="corner" style={{width: `${right * props.pageWidth}px`}}></div>
            </div>
            <div className="center-box">
                <div className="croping-area left"
                    ref={leftArea}
                    style={{minHeight: `${(1-top-bottom)*props.pageHeight}px`, minWidth: `${left * props.pageWidth}px`}}>
                        <div className={"resizer" + (isLeftResizing && !isRestMoving ? " current" : "")}
                            style={{minWidth: `${resizerSize}px`, height: `${(1-top-bottom)*props.pageHeight}px`}}
                            onMouseDown={handleLeftMD}></div>
                </div>
                <div className="rest" onMouseDown={handleRestMD}></div>
                <div className="croping-area right"
                    ref={rightArea}
                    style={{minHeight: `${(1-top-bottom)*props.pageHeight}px`, minWidth: `${right * props.pageWidth}px`}}>
                        <div className={"resizer" + (isRightResizing && !isRestMoving ? " current" : "")}
                            style={{minWidth: `${resizerSize}px`, height: `${(1-top-bottom)*props.pageHeight}px`}}
                            onMouseDown={handleRightMD}></div>
                </div>
            </div>
            <div className="bottom-box">
                <div className="corner" style={{width: `${left * props.pageWidth}px`}}></div>
                <div className="croping-area bottom"
                    ref={bottomArea}
                    style={{minHeight: `${bottom * props.pageHeight}px`, minWidth: `${(1-right-left)*props.pageWidth}px`}}>
                        <div className={"resizer" + (isBottomResizing && !isRestMoving ? " current" : "")}
                            style={{minHeight: `${resizerSize}px`, width: `${(1-right-left)*props.pageWidth}px`}}
                            onMouseDown={handleBottomMD}></div>
                </div>
                <div className="corner" style={{width: `${right * props.pageWidth}px`}}></div>
            </div>
        </div>
    );
}

export default CropingField;