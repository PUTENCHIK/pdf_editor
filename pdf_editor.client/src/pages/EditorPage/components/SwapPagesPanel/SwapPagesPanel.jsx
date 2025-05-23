import { useEffect, useState } from 'react';
import './SwapPagesPanel.css'

import swap_icon from '../../../../images/common/swap_icon_active.svg';
import Button from '../../../../components/Button/Button';

const SwapPagesPanel = (props) => {
    const inputStyle = {
        width: (String(props.pages).length * 20) + "px"
    };
    const [page1, setPage1] = useState(1);
    const [page2, setPage2] = useState(2);

    useEffect(() => {
        if (page1 && page2) {
            props.updateData({
                pageFrom: page1,
                pageTo: page2,
            });
        }
    }, [page1, page2]);

    function validatePageNumber(page) {
        let value = Number(page);
        return (value && value <= props.pages && value > 0) || !page.length;
    }

    function handleChanged1(event) {
        if (validatePageNumber(event.target.value)) {
            setPage1(event.target.value);
        }
    }

    function handleChanged2(event) {
        if (validatePageNumber(event.target.value)) {
            setPage2(event.target.value);
        }
    }

    return (
        <div className="swap-pages-panel">
            <h3>Поменять страницы местами</h3>
            <div className='content'>
                <div className="input-pages-container">
                    <div className="input-box">
                        <input
                            className='span'
                            type="text"
                            value={page1}
                            style={inputStyle}
                            onChange={handleChanged1}
                        />
                        <span>/</span>
                        <span>{props.pages}</span>
                    </div>
                    <img src={swap_icon} alt="<-->" />
                    <div className="input-box">
                        <input
                            className='span'
                            type="text"
                            value={page2}
                            style={inputStyle}
                            onChange={handleChanged2}
                        />
                        <span>/</span>
                        <span>{props.pages}</span>
                    </div>
                </div>
                <div className='button-box'>
                    { (!page1 || !page2) ?
                        (
                            <p className='error'>Все поля должны быть заполнены</p>
                        ) : (
                            (page1 == page2) ? (
                                <p className="error">Необходимо указать разные страницы</p>
                            ) : (
                                <Button
                                    text="Поменять местами"
                                    class="danger"
                                    onClick={props.onClick}
                                />
                            )
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default SwapPagesPanel;