import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export default class Header extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props);
    }

    render() {
        // Show the user profile pic for every page except log in
        let user = this.props.punters.find(user => { return user.punterId === this.props.user }),
            profilePic = (this.props.page === 'Log In') ? '' : <img key="a" className="profile-pic" src={'pics/' + user.pic} alt="profile-pic" />;

        // Show the Admin button only if the user is an admin and it's not the log in page
        let adminBtn = ((this.props.isAdmin === true) && (this.props.page !== 'Log In')) ? <NavLink to="/admin" key="b" className="icon-admin" activeClassName="selected"></NavLink> : '';

        return [
            profilePic,
            adminBtn,
            <h2 key="c">Spring Racing Tipping <img src="horse.png" alt="Title logo" /><span className="beta">BETA</span></h2>,
            <h3 key="d">{this.props.page}</h3>,
            <div key="e">{this.props.text}</div>
        ];
    }
}