import React from 'react';

const Button = ({ id, classes, type, attributes, onClick, disabled, text }) => (
    <button id={id}
            className={classes}
            type={type}
            {...attributes}
            onClick={onClick}
            onKeyDown={event => { if (event.code === "Enter" || event.code === "NumpadEnter") { this.props.onClick(event); } }}
            disabled={disabled}>
        {text}
    </button>
);

export default Button;