import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export default class Menu extends Component {
    render() {
        return (
            <div className="menu">
                <NavLink to="/tips" activeClassName="selected">Tips</NavLink>
                <NavLink to="/results" activeClassName="selected">Results</NavLink>
                <NavLink to="/leaderboard" activeClassName="selected">Leaderboard</NavLink>
            </div>
        );
    }
}