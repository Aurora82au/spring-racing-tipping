import React, { PureComponent } from 'react';

export default class Button extends PureComponent {
    render() {
        return (
            <button id={this.props.id}
                    className={this.props.classes}
                    type={this.props.type}
                    {...this.props.attributes}
                    onClick={this.props.onClick}
                    disabled={this.props.disabled}>
                {this.props.text}
            </button>
        );
    }
}