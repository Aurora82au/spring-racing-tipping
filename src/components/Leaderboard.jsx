import React, { Component } from 'react';
import Header from './Header';
import Menu from './Menu';

export default class Leaderboard extends Component {
    render() {
        return (
            <div className="app">
                {/* <Header /> */}
                <div>This is the Leaderboard page.</div>
                <Menu></Menu>
            </div>
        );
    }
}