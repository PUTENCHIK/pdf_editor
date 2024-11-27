import './ArrowDown.css'

function ArrowDown(props) {
    return (
        <div className={'arrow-box ' + props.direction}>
            <div className="__content">
                <div className='arrow'></div>
            </div>
        </div>
    );
}

export default ArrowDown;