import React, { Component } from 'react';
import Header from './Header';
import Menu from './Menu';

export default class Information extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props);
    }
    
    render() {
        return (
            <div className="app">
                {/* <Header /> */}
                <div>This is the Information page.</div>
                <Menu></Menu>
            </div>
        );
    }
}