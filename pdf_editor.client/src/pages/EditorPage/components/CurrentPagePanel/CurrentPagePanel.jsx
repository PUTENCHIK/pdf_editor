import './CurrentPagePanel.css'

const CurrentPagePanel = (props) => {
    const inputStyle = {
        width: (String(props.pages).length * 20) + "px"
    };

    return (
        <div className="current-page-panel">
            <span>
                <input
                    className='span'
                    type="text"
                    value={props.current}
                    style={inputStyle}
                    disabled
                />
            </span>
            <span>/</span>
            <span>{props.pages}</span>
        </div>
    );
}

export default CurrentPagePanel;