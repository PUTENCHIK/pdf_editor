import './ArrowDown.css'

function ArrowDown(props) {
    return (
        <div className={'arrow-box' + (!props.isShown ? ' hidden' : '')}>
            <div className='arrow'></div>
        </div>
    );
}

export default ArrowDown;