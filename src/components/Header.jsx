import React, { Component } from 'react';

export default class Header extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    render() {
        return (
            <h2>Spring Racing Tipping <img src="horse.png" alt="Title logo" /><span className="beta">BETA</span></h2>
        );
    }
}