import React, { Component } from 'react';
import Header from './Header';
import Menu from './Menu';

export default class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        return !((nextProps === this.props) && (nextState === this.state));
    }

    render() {
        return (
            <div className="app">
                <Header page="Administration" text="This is the Administration page used to set placings and race statuses." />
                <Menu></Menu>
            </div>
        );
    }
}