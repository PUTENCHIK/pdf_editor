import './Input.css'
import { useRef, forwardRef, useImperativeHandle } from 'react'

const Input = forwardRef((props, ref) => {

    const inputRef = useRef(null);

    useImperativeHandle(ref, () => {
        return {
            getValue() {
                return inputRef.current.value;
            }
        }
    });

    return (
        <input
            type={props.type}
            name={props.name}
            placeholder={props.placeholder}
            min={props.type == "number" ? props.min : null}
            max={props.type == "number" ? props.max : null}
            required
        />
    );
});

export default Input;