import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLogOut: false
        }
    }

    /* Determines whether React should re-render the component, in this case if the new props are different from the old props,
       or if the new state is different from the current state */
    shouldComponentUpdate(nextProps, nextState) {
        return !((nextProps === this.props) && (nextState === this.state));
    }

    /* Updates the state to show the log out overlay when the user has clicked the profile picture */
    handleShowLogOutOverlay = () => {
        this.setState({
            showLogOut: true
        });
    }
    
    /* Updates the state to hide the log out overlay when the user has clicked on the overlay background */
    handleHideLogOutOverlay = () => {
        this.setState({
            showLogOut: false
        });
    }

    /* Clear the localStorage and redirect the user to the Login page when they click the 'Log Out' button */
    handleLogOut = () => {
        localStorage.clear();
        window.location.href = '/login';
    }

    /* Function to render the component */
    render() {
        // Show the user profile pic on every page but the Login page
        let informationBtn = (this.props.page === 'Log In') ? '' : <NavLink to={this.props.path + 'information'} key="a" className="info-icon" activeClassName="selected">i</NavLink>,
            logOutOverlay = this.state.showLogOut ? <div key="b" className="overlay" onClick={this.handleHideLogOutOverlay}><button className="btn" type="button" onClick={this.handleLogOut}>Log Out</button></div> : '',
            user = this.props.punters.find(user => { return user.punterId === this.props.user }),
            profilePic = (this.props.page === 'Log In') ? '' : <img key="c" className="profile-pic" src={'pics/' + user.pic} alt="profile-pic" onClick={this.handleShowLogOutOverlay} />;

        // Show the admin button only if the user is an admin and it's not the Login page
        let adminBtn = ((this.props.isAdmin === true) && (this.props.page !== 'Log In')) ? <NavLink to={this.props.path + 'admin'} key="d" className="icon-admin" activeClassName="selected"></NavLink> : '';

        // Show the reload button on every page but the Login page
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