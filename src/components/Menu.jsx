import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export default class Menu extends Component {
    /* Determines whether React should re-render the component, in this case it never should */
    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    render() {
        return (
            <div className="menu">
                <NavLink to={this.props.path + 'statistics'} activeClassName="selected"><div className="icon icon-pie-chart"></div>Statistics</NavLink>
                <NavLink to={this.props.path + 'tips'} activeClassName="selected"><div className="icon icon-pencil"></div>Tips</NavLink>
                <NavLink to={this.props.path + 'results'} activeClassName="selected"><div className="icon icon-clipboard"></div>Results</NavLink>
                <NavLink to={this.props.path + 'leaderboard'} activeClassName="selected"><div className="icon icon-leader-board"></div>Leaderboard</NavLink>
            </div>
        );
    }
}