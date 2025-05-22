import './MessageBlocksContainer.css'

import { useState, forwardRef, useImperativeHandle } from 'react';

import MessageBlock from '../MessageBlock/MessageBlock';

const MessageBlocksContainer = forwardRef((props, ref) => {

    let [children, setChildren] = useState([]);
    let [uniqueIndex, setIndex] = useState(1);

    useImperativeHandle(ref, () => {
        return {
            addError(title, text) {
                let block = <MessageBlock
                    key={uniqueIndex}
                    type="error"
                    title={title}
                    text={text}
                />
                setIndex(uniqueIndex + 1);
                setChildren([...children, block]);
            },
            addMessage(title, text) {
                let block = <MessageBlock
                    key={uniqueIndex}
                    type="message"
                    title={title}
                    text={text}
                />
                setIndex(uniqueIndex + 1);
                setChildren([...children, block]);
            }
        }
    });

    return (
        <div className="message-blocks-container">
            {children}
        </div>
    );
});

export default MessageBlocksContainer;