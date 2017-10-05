import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export default class Header extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props);
    }

    render() {
        // Show the Admin button only if the user is an admin
        console.log('Header isAdmin: ' + this.props.isAdmin);
        let adminBtn = (this.props.isAdmin === true) ? <NavLink to="/admin" key="a" className="icon-admin" activeClassName="selected"></NavLink> : '';

        return [
            adminBtn,
            <h2 key="b">Spring Racing Tipping <img src="horse.png" alt="Title logo" /><span className="beta">BETA</span></h2>,
            <h3 key="c">{this.props.page}</h3>,
            <div key="d">{this.props.text}</div>
        ];
    }
}