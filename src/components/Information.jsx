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
                <Header page="Information" isAdmin={this.props.isAdmin} text="This is where you find out some stuff." />
                <Menu></Menu>
            </div>
        );
    }
}