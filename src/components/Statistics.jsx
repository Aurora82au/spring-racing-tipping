import React, { Component } from 'react';

class App extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props);
    }

    render() {
        return <div></div>;
    }
}