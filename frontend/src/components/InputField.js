import React from 'react';

export default function InputField(props) {
    return (
        <label>
            <input id={props.id} type="text" placeholder={props.text}/>
        </label>
    )
}