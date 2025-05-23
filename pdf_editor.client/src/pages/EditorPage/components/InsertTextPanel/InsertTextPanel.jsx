import { useEffect, useState } from 'react';
import './InsertTextPanel.css'
import { getFontsRequest } from '../../../../helpers/functionRequests';
import {roundNumber} from '../../../../helpers/functions';
import Button from '../../../../components/Button/Button';
import Checkbox from '../../../../components/Checkbox/Checkbox';

const InsertTextPanel = (props) => {
    const defaultFont = "Inter";
    const defaultTextSize = 14;
    const defaultColor = "#000000";
    const defaultBackgroundColor = "#ffffff";

    const [fonts, setFonts] = useState([]);

    const [font, setFont] = useState(defaultFont);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [textSize, setTextSize] = useState(defaultTextSize);
    const [textColor, setTextColor] = useState(defaultColor);
    const [withBackground, setWithBackground] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState(defaultBackgroundColor);

    useEffect(() => {
        props.updateData({
            font: font,
            isBold: isBold,
            isItalic: isItalic,
            isUnderline: isUnderline,
            textSize: textSize,
            textColor: textColor,
            backgroundColor: withBackground ? backgroundColor : null,
        });
    }, [font, isBold, isItalic, isUnderline, textSize,
        textColor, withBackground, backgroundColor]);

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

    function handleWithBackground() {
        setWithBackground(!withBackground);
    }

    function handleBackgroundColorChange(event) {
        setBackgroundColor(event.target.value);
    }

    return (
        <div className="insert-text-panel">
            <h3>Вставка текста на страницу {props.page}</h3>
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
                <div className="row">
                    <span>Заливать фон</span>
                    <Checkbox
                        size={24}
                        isChecked={withBackground}
                        onClick={handleWithBackground}
                    />
                </div>
                { withBackground &&
                    <div className="row">
                        <span>Цвет фона</span>
                        <input
                            className='color'
                            type="color"
                            value={backgroundColor}
                            onChange={handleBackgroundColorChange}
                        />
                    </div>
                }
                <div className="row">
                    <span>Отступ слева</span>
                    <span className='bold'>{roundNumber((props.documentData ?? {}).x)}px</span>
                </div>
                <div className="row">
                    <span>Отступ снизу</span>
                    <span className='bold'>{roundNumber((props.documentData ?? {}).y)}px</span>
                </div>
                <div className="button-box">
                    { ((props.documentData ?? {}).text && (props.documentData ?? {}).text.trim().length > 0) ?
                        (
                            <Button
                                class="danger"
                                text="Вставить текст"
                                onClick={props.onClick}
                            />
                        ) : (
                            <p className='minor'>Для вставки введите текст</p>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default InsertTextPanel;