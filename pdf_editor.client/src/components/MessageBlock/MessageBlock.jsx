import './MessageBlock.css'
import { useRef } from 'react';

import CrossButton from '../CrossButton/CrossButton';

function MessageBlock(props) {
    
    const messageBlock = useRef(null);
    
    const LIFETIME = 5000;
    setTimeout(() => {
        if (messageBlock.current != null)
            messageBlock.current.remove();
    }, LIFETIME);

    function closeMessage() {
        if (messageBlock.current != null)
            messageBlock.current.remove();
    }

    return (
        <div 
                className={"message-block" + (props.type == "error" ? " error" : "")}
                ref={messageBlock}
        >
            <div className="__content">
                <div className="top-container">
                    <CrossButton
                        size="minor"
                        color="white"
                        onClick={closeMessage}                    
                    />
                </div>
                <div className="texts">
                    <span className='message-title'>{props.title}</span>
                    <span className="message-text">{props.text}</span>
                </div>
            </div>
        </div>
    );
}

export default MessageBlock;