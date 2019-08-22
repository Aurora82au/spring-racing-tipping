import React, { PureComponent, Fragment } from 'react';
import { generateId } from '../helpers/utilities';

export default class LabelAndSelectBox extends PureComponent {
    render() {
        const id = generateId(6);

        return (
            <Fragment>
                <label htmlFor={id} className={this.props.labelClasses}>
                    {this.props.labelText}
                </label>
                <div className="selector">
                    <select
                        id={id}
                        value={this.props.value}
                        onChange={this.props.handleSelect}
                        disabled={this.props.disabled}
                    >
                        {this.props.options}
                    </select>
                    <span className="icon-select" />
                </div>
            </Fragment>
        );
    }
}