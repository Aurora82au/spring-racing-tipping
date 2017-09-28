import React, { Component } from 'react';
// import Header from './Header';
import Menu from './Menu';

export default class Tips extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props);
    }

    render() {
        return (
            <div className="app">
                {/* <Header /> */}
                <div>This is the Tips page.</div>
                <Menu></Menu>
            </div>
        );
    }
}