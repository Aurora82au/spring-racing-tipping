import React, { Component } from 'react';
import Header from './Header';
import Menu from './Menu';

export default class App extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props);
    }

    render() {
        return (
            <div className="app">
                <Header page="Statistics" path={this.props.path} punters={this.props.punters} user={this.props.user} onReloadData={this.props.onReloadData} isAdmin={this.props.isAdmin} text="Here you can find various statistics, such as the placings for each race meet, number of trifectas, quinellas, 1sts, 2nds, 3rds, etc." />
                <div>This is the Statistics page.</div>
                <Menu path={this.props.path}></Menu>
            </div>
        );
    }
}