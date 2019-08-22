import React, { Component, Fragment } from 'react';
import { generateId } from '../helpers/utilities';

export default class LabelAndInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            focused: false
        };
    }

    /* Determines whether React should re-render the component, in this case if the new props are different from the old props,
       or if the new state is different from the current state. */
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props && nextState === this.state);
    }

    /* When the component recieves new props, set the local user and password from the passed props. */
    componentWillReceiveProps() {
        if (this.props.user) {
            this.setState({
                value: this.props.value
            });
        }
    }

    /* When the user types in the field, set the value in the state to what the user is typing. */
    handleChange = event => {
        this.setState({
            value: event.target.value
        });
        this.props.handleChange(event.target.value);
    }

    /* When the user focuses the field, set focused in the state to true.  Used to shift the label out of the field. */
    handleFocus = event => {
        this.setState({
            focused: true
        });
    };

    /* When focus is lost on the field, set focused in the state to false.  Used to shift the label into the field. */
    handleBlur = event => {
        this.setState({
            focused: false
        });
    };

    render() {
        const id = generateId(6);

        // Append to any passed classes the focused class on the label to have it move out of the input, but not go back in if there is a value.
        let labelClass = this.props.labelClasses || '';
        labelClass += (this.state.focused || this.state.value !== '') ? 'label focused' : 'label';

        return (
            <Fragment>
                <label htmlFor={id} className={labelClass}>
                    {this.props.labelText}
                </label>
                <input id={id}
                    className={this.props.inputClasses}
                    type={this.props.type}
                    value={this.state.value}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    onChange={this.handleChange}
                    disabled={this.props.disabled}
                />
            </Fragment>
        );
    }
}