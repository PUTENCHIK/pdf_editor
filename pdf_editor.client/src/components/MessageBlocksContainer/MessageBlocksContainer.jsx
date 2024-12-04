import './MessageBlocksContainer.css'

import { useState, forwardRef, useImperativeHandle } from 'react';

import MessageBlock from '../MessageBlock/MessageBlock';

const MessageBlocksContainer = forwardRef((props, ref) => {

    // const BLOCKS_LIMIT = 4;
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
                
                // if (children.length >= BLOCKS_LIMIT) {
                //     setChildren([...children.slice(-BLOCKS_LIMIT)]);
                //     console.log(children);
                    
                // }
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