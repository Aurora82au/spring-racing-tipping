import React, { Component } from 'react';
import TopMenu from './TopMenu';

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLogOut: false
        };
    }

    /* Determines whether React should re-render the component, in this case if the new props are different from the old props,
       or if the new state is different from the current state. */
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props && nextState === this.state);
    }

    /* Updates the state to show the log out overlay when the user has clicked the profile picture. */
    handleShowLogOutOverlay = () => {
        this.setState({
            showLogOut: true
        });
    };

    /* Updates the state to hide the log out overlay when the user has clicked on the overlay background. */
    handleHideLogOutOverlay = () => {
        this.setState({
            showLogOut: false
        });
    };

    /* Function to render the component. */
    render() {
        return (
            <>
                {
                    // Show the top menu on every page but the Login page.
                    this.props.page !== 'Log In' &&
                    <TopMenu
                        path={this.props.path}
                        user={this.props.user}
                        competitions={this.props.competitions}
                        selectedCompetition={this.props.selectedCompetition}
                        handleCompetitionSelect={this.props.handleCompetitionSelect}
                        isAdmin={this.props.isAdmin}
                    />
                }
                {
                    // Show the reload button on every page but the Login page.
                    this.props.page !== 'Log In' &&
                    <button className="reload-btn" onClick={this.props.onReloadData}>
                        <span className="icon-reload" />
                    </button>
                }
                <h2>
                    Spring Racing Tipping <img src="horse.png" alt="Title logo" />
                    <span className="beta">BETA</span>
                </h2>
                {
                    // Show the competition name on every page but the Login page, and if the selectedCompetition is set.
                    this.props.page !== 'Log In' && this.props.selectedCompetition &&
                    <span className="comp-name">{this.props.selectedCompetition.name}</span>
                }
                <h3>{this.props.page}</h3>
                <p>{this.props.text}</p>
            </>
        );
    }
}
