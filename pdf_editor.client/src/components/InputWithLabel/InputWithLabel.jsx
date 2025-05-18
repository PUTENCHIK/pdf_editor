import './InputWithLabel.css'
import { useRef, forwardRef, useImperativeHandle } from 'react'

import Input from '../Input/Input';

const InputWithLabel = forwardRef((props, ref) => {

    const inputRef = useRef(null);

    useImperativeHandle(ref, () => {
        return {
            getInputValue() {
                return inputRef.current.getValue();
            }
        }
    });

    return (
        <label className={'label' + (props.labelType != null ? " " + props.labelType : "")}>
            <span className='label-title'>{props.title}</span>
            <Input
                widthBehavior={props.labelType == "horizontal" ? "inline" : null}
                ref={inputRef}
                type={props.type}
                name={props.name}
                placeholder={props.placeholder}
                min={props.type == "number" ? props.min : null}
                max={props.type == "number" ? props.max : null}
            />
        </label>
    );
});

export default InputWithLabel;