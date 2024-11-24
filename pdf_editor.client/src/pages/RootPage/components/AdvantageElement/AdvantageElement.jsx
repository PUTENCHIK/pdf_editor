import './AdvantageElement.css'

function AdvantageElement(props) {
    return (
        <div className='advantage-element'>
            <div className="icon-box">
                <img src={props.image} className='icon' alt={props.alt}/>
            </div>
            <h3>{props.title}</h3>
            <span className='label'>{props.text}</span>
        </div>
    );
}

export default AdvantageElement;