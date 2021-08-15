import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomMenu = ({ path }) =>  (
    <div className="bottom-menu">
        <NavLink to={path + 'statistics'} activeClassName="selected"><div className="icon icon-pie-chart"></div>Statistics</NavLink>
        <NavLink to={path + 'tips'} activeClassName="selected"><div className="icon icon-pencil"></div>Tips</NavLink>
        <NavLink to={path + 'results'} activeClassName="selected"><div className="icon icon-clipboard"></div>Results</NavLink>
        <NavLink to={path + 'leaderboard'} activeClassName="selected"><div className="icon icon-leader-board"></div>Leaderboard</NavLink>
    </div>
);

export default BottomMenu;