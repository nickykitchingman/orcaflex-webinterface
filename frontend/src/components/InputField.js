import React from 'react';

export default function InputField(props) {
    return (
        <label>
            <input id={props.id} type={props.type} placeholder={props.text}/>
        </label>
    )
}