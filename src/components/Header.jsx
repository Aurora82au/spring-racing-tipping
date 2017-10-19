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
        console.log('handleLogOut called');
        this.props.history.push(this.props.path + 'login');
    }

    render() {
        // Show the user profile pic for every page except log in
        let LogOutOverlay = this.state.showLogOut ? <div key="a" className="overlay" onClick={this.handleHideLogOutOverlay}><button className="btn" type="button" onClick={this.handleLogOut}>Log Out</button></div> : '',
            user = this.props.punters.find(user => { return user.punterId === this.props.user }),
            profilePic = (this.props.page === 'Log In') ? '' : <img key="b" className="profile-pic" src={'pics/' + user.pic} alt="profile-pic" onClick={this.handleShowLogOutOverlay} />,
            popup = (this.props.page === 'Log In') ? '' : <div key="c" className="profile-popup"><button className="btn">Logout</button></div>;

        // Show the Admin button only if the user is an admin and it's not the log in page
        let adminBtn = ((this.props.isAdmin === true) && (this.props.page !== 'Log In')) ? <NavLink to={this.props.path + 'admin'} key="d" className="icon-admin" activeClassName="selected"></NavLink> : '';

        return [
            LogOutOverlay,
            profilePic,
            popup,
            adminBtn,
            <h2 key="e">Spring Racing Tipping <img src="horse.png" alt="Title logo" /><span className="beta">BETA</span></h2>,
            <h3 key="f">{this.props.page}</h3>,
            <p key="g">{this.props.text}</p>
        ];
    }
}