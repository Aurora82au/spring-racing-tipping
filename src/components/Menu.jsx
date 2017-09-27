import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export default class Menu extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    render() {
        return (
            <div className="menu">
                <NavLink to="/information" activeClassName="selected"><div className="icon icon-info"></div>Information</NavLink>
                <NavLink to="/tips" activeClassName="selected"><div className="icon icon-pencil"></div>Tips</NavLink>
                <NavLink to="/results" activeClassName="selected"><div className="icon icon-clipboard"></div>Results</NavLink>
                <NavLink to="/leaderboard" activeClassName="selected"><div className="icon icon-leader-board"></div>Leaderboard</NavLink>
            </div>
        );
    }
}