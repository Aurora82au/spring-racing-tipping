import React, { Component } from 'react';

export default class ErrorHandling extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false
        };
    }

    componentDidCatch(error, info) {
        this.setState(state => ({ ...state, hasError: true }));
    }

    render() {
        if (this.state.hasError) {
            return <div>Sorry, something went wrong.</div>;
        } else {
            return this.props.children;
        }
    }
}
