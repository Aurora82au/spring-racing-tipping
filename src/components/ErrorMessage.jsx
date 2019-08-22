import React, { PureComponent } from 'react';

export default class ErrorMessage extends PureComponent {
    render() {
        return (
            <div className={this.props.classes}>{this.props.text}</div>
        );
    }
}