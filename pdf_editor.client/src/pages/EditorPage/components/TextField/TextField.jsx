import { useEffect, useRef, useState } from 'react';
import './TextField.css'
import roundNumber from '../../../../helpers/functions';

const TextField = (props) => {
    const defaultPosition = 0.05;

    const containerRef = useRef(null);
    const textBoxRef = useRef(null);

    const [offsetX, setOffsetX] = useState(null);
    const [offsetY, setOffsetY] = useState(null);
    const [x, setX] = useState(defaultPosition);
    const [y, setY] = useState(defaultPosition);
    const [isMoving, setIsMoving] = useState(false);

    const [font, setFont] = useState(null);
    const [isBold, setIsBold] = useState(null);
    const [isItalic, setIsItalic] = useState(null);
    const [isUnderline, setIsUnderline] = useState(null);
    const [textSize, setTextSize] = useState(null);
    const [textColor, setTextColor] = useState(null);
    const [text, setText] = useState("");

    useEffect(() => {
        props.updateData({
            x: x,
            y: y,
            text: text
        });
    }, [x, y, text]);

    useEffect(() => {
        if (props.data) {
            setFont(props.data.font);
            setIsBold(props.data.isBold);
            setIsItalic(props.data.isItalic);
            setIsUnderline(props.data.isUnderline);
            setTextSize(props.data.textSize);
            setTextColor(props.data.textColor);
        }
    }, [props.data, props.pageZoom]);

    useEffect(() => {
        const clearSelection = () => {
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            } else if (document.selection) {
                document.selection.empty();
            }
        }

        const handleMouseMove = (event) => {
            if (!isMoving) return;

            clearSelection();
            const containerRect = containerRef.current.getBoundingClientRect();
            const textBoxRect = textBoxRef.current.getBoundingClientRect();

            let newX = (event.clientX - containerRect.left - offsetX ?? 0) / props.pageWidth;
            newX = newX < 0 ? 0 : newX;
            const maxX = 1 - textBoxRect.width / props.pageWidth;
            newX = newX >= maxX ? maxX : newX;

            let newY = (containerRect.bottom - event.clientY - offsetY ?? 0) / props.pageHeight;
            newY = newY < 0 ? 0 : newY;
            const maxY = 1 - textBoxRect.height / props.pageHeight;
            newY = newY >= maxY ? maxY : newY;
            setX(newX);
            setY(newY);
        }

        const handleMouseUp = () => {
            setIsMoving(false);
        }

        if (isMoving) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
    }, [isMoving]);

    function handleOnBlur(event) {
        setText(event.currentTarget.textContent);
    }

    function handleMouseDown(event) {
        const textBoxRect = textBoxRef.current.getBoundingClientRect();
        setOffsetX(event.clientX - textBoxRect.left);
        setOffsetY(textBoxRect.bottom - event.clientY);
        
        setIsMoving(true);
    }

    return (
        <div
            ref={containerRef}
            className="text-field-box"
            style={{width: roundNumber(props.pageWidth),
                    height: roundNumber(props.pageHeight)}}
        >
            <div
                ref={textBoxRef}
                className="text-field"
                onMouseDown={handleMouseDown}
                style={{left: `${x * props.pageWidth}px`,
                        bottom: `${y * props.pageHeight}px`}}
            >
                <span
                    className="text"
                    onBlur={handleOnBlur}
                    contentEditable
                    style={{fontFamily: font,
                            fontWeight: (isBold ? "600" : "400"),
                            fontStyle: (isItalic ? "italic" : "normal"),
                            textDecoration: (isUnderline ? "underline" : "none"),
                            fontSize: `${textSize * props.pageZoom}px`,
                            color: textColor}}
                >
                    {text}
                </span>
            </div>
        </div>
    );
}

export default TextField;