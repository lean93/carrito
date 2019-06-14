import React from 'react'
import {Input} from 'antd';

const NumericInput = (props) => {

    const onChange = (e) => {
        const {value} = e.target;
        const reg = /^[0-9]*$/;
        //const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        if ((!isNaN(value) && reg.test(value))) {
            if (props.value !== value) {
                if (value === '') {
                    props.onChange(null);
                } else {
                    props.onChange(Number(value));
                }
            }
        }
    };
    // '.' at the end or only '-' in the input box.
    const onBlur = () => {
        onChange({
            target: {
                value: props.value
            }
        });
    };

    return <Input {...props}
                  onChange={onChange}
                  onBlur={onBlur}
                  maxLength={25}
    />

};

export default NumericInput;