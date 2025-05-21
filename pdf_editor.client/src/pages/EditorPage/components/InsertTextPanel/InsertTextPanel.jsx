import { useEffect, useState } from 'react';
import './InsertTextPanel.css'
import { getFontsRequest } from '../../../../helpers/functionRequests';

const InsertTextPanel = (props) => {
    const defaultFont = "Inter";
    const defaultTextSize = 14;
    const defaultColor = "#000000";

    const [fonts, setFonts] = useState([]);

    const [font, setFont] = useState(defaultFont);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [textSize, setTextSize] = useState(defaultTextSize);
    const [textColor, setTextColor] = useState(defaultColor);

    useEffect(() => {
        props.updateData({
            font: font,
            isBold: isBold,
            isItalic: isItalic,
            isUnderline: isUnderline,
            textSize: textSize,
            textColor: textColor,
        });
    }, [font, isBold, isItalic, isUnderline, textSize, textColor]);

    useEffect(() => {
        if (fonts && fonts.length)
            setFont(fonts[0]);
    }, [fonts]);

    useEffect(() => {
        async function gf() {
            let result = await getFontsRequest();
            if (result)
                setFonts(result);
        }
        gf();
    }, []);

    function handleSelectChanged(event) {
        const newFont = event.target.value;
        if (fonts.includes(newFont))
            setFont(newFont);
    }

    function handleBoldClick() {
        setIsBold(!isBold);
    }

    function handleItalicClick() {
        setIsItalic(!isItalic);
    }

    function handleUnderlineClick() {
        setIsUnderline(!isUnderline);
    }

    function handleTextSizeChange(event) {
        setTextSize(event.target.value)
    }

    function handleTextColorChange(event) {
        setTextColor(event.target.value)
    }

    return (
        <div className="insert-text-panel">
            <h3>Вставка текста</h3>
            <div className="content">
                <div className="row">
                    <span>Шрифт</span>
                    <select
                        name="fonts"
                        defaultValue={defaultFont}
                        onChange={handleSelectChanged}
                    >
                        { (!fonts || !fonts.length) &&
                            <option value={defaultFont}>{defaultFont}</option>
                        }
                        { fonts.length &&
                            <>
                                {fonts.map((f, index) => (
                                    <option value={f} key={index}>{f}</option>
                                ))}
                            </>
                        }
                    </select>
                </div>
                <div className="row">
                    <span>Стили</span>
                    <div className="text-styles">
                        <div
                            className={'bold' + (isBold ? ' active' : '')}
                            onClick={handleBoldClick}
                        >Ж</div>
                        <div
                            className={'italic' + (isItalic ? ' active' : '')}
                            onClick={handleItalicClick}
                        >К</div>
                        <div
                            className={'underline' + (isUnderline ? ' active' : '')}
                            onClick={handleUnderlineClick}
                        >Ч</div>
                    </div>
                </div>
                <div className="row">
                    <span>Размер</span>
                    <div className='input-box'>
                        <input
                            className='span font-size'
                            type="number"
                            value={textSize}
                            onChange={handleTextSizeChange}
                        />
                        px
                    </div>
                </div>
                <div className="row">
                    <span>Цвет</span>
                    <input
                        className='color'
                        type="color"
                        value={textColor}
                        onChange={handleTextColorChange}
                    />
                </div>
            </div>
        </div>
    );
}

export default InsertTextPanel;