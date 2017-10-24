import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLogOut: false
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !((nextProps === this.props) && (nextState === this.state));
    }

    handleShowLogOutOverlay = () => {
        this.setState({
            showLogOut: true
        });
    }
    
    handleHideLogOutOverlay = () => {
        this.setState({
            showLogOut: false
        });
    }

    handleLogOut = () => {
        sessionStorage.clear();
        window.location.href = '/';
    }

    render() {
        // Show the user profile pic for every page except log in
        let informationBtn = (this.props.page === 'Log In') ? '' : <NavLink to={this.props.path + 'information'} key="a" className="icon-info" activeClassName="selected"></NavLink>,
            logOutOverlay = this.state.showLogOut ? <div key="b" className="overlay" onClick={this.handleHideLogOutOverlay}><button className="btn" type="button" onClick={this.handleLogOut}>Log Out</button></div> : '',
            user = this.props.punters.find(user => { return user.punterId === this.props.user }),
            profilePic = (this.props.page === 'Log In') ? '' : <img key="c" className="profile-pic" src={'pics/' + user.pic} alt="profile-pic" onClick={this.handleShowLogOutOverlay} />;

        // Show the Admin button only if the user is an admin and it's not the log in page
        let adminBtn = ((this.props.isAdmin === true) && (this.props.page !== 'Log In')) ? <NavLink to={this.props.path + 'admin'} key="d" className="icon-admin" activeClassName="selected"></NavLink> : '';

        // Show the reload button on every page but the login page
        let reloadBtn = (this.props.page !== 'Log In') ? <button key="e" className="reload-btn" onClick={this.props.onReloadData}><span className="icon-reload"></span></button> : '';

        return [
            informationBtn,
            logOutOverlay,
            profilePic,
            adminBtn,
            reloadBtn,
            <h2 key="f">Spring Racing Tipping <img src="horse.png" alt="Title logo" /><span className="beta">BETA</span></h2>,
            <h3 key="g">{this.props.page}</h3>,
            <p key="h">{this.props.text}</p>
        ];
    }
}