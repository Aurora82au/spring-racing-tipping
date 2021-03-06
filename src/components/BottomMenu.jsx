import React, { PureComponent } from 'react';
import { NavLink } from 'react-router-dom';

export default class BottomMenu extends PureComponent {
    render() {
        return (
            <div className="bottom-menu">
                <NavLink to={this.props.path + 'statistics'} activeClassName="selected"><div className="icon icon-pie-chart"></div>Statistics</NavLink>
                <NavLink to={this.props.path + 'tips'} activeClassName="selected"><div className="icon icon-pencil"></div>Tips</NavLink>
                <NavLink to={this.props.path + 'results'} activeClassName="selected"><div className="icon icon-clipboard"></div>Results</NavLink>
                <NavLink to={this.props.path + 'leaderboard'} activeClassName="selected"><div className="icon icon-leader-board"></div>Leaderboard</NavLink>
            </div>
        );
    }
}