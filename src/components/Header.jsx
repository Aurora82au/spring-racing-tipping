import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export default class Header extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props);
    }

    render() {
        return [
            <NavLink to="/admin" key="a" className="icon-admin" activeClassName="selected"></NavLink>,
            <h2 key="b">Spring Racing Tipping <img src="horse.png" alt="Title logo" /><span className="beta">BETA</span></h2>,
            <h3 key="c">{this.props.page}</h3>,
            <div key="d">{this.props.text}</div>
        ];
    }
}