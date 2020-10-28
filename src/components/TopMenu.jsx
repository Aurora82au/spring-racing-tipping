import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { logOut } from '../helpers/utilities';
import { getPunterCompetitions } from '../helpers/utilities';
import Button from './Button';
import CompetitionSelector from './CompetitionSelector';
import pkg from '../../package.json';

export default class TopMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    /* Determines whether React should re-render the component, in this case if the new props are different from the old props,
       or if the new state is different from the current state */
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props && nextState === this.state);
    }

    handlePicClick = () => {
        // Enable or disable the page scroll
        const htmlTag = document.documentElement;
        if (this.state.open) {
            htmlTag.classList.remove('no-scroll');
        }
        else {
            htmlTag.classList.add('no-scroll');
        }

        this.setState({
            open: !this.state.open
        });
    }

    handleCompetitionSelect = event => {
        this.props.handleCompetitionSelect(event);
        // Close the menu when the user has selected a competition.
        this.handlePicClick();
    }

    render() {
        const menuClass = this.state.open ? 'top-menu open' : 'top-menu';
        const punterComps = getPunterCompetitions(this.props.competitions, this.props.user);

        return (
            <div className={menuClass}>
                {
                    this.props.user &&
                    <div className="menu-btn-container" onClick={this.handlePicClick}>
                        <div className="icon-menu-vertical"></div>
                        <span className="icon-arrow-up"></span>
                    </div>
                }
                <div className="column">
                    {
                        this.props.isAdmin &&
                        <NavLink to={this.props.path + 'admin'} onClick={this.handlePicClick}><span className="icon-admin"></span>Administration</NavLink>
                    }
                    <NavLink to={this.props.path + 'information'} onClick={this.handlePicClick}><span className="info-icon">i</span>Information</NavLink>
                    <div className="btn-container">
                        <Button 
                            classes="btn logout"
                            type="button"
                            onClick={logOut}
                            disabled={false}
                            text="Log Out"
                        />
                        <span>App Version: {pkg.version}</span>
                    </div>
                </div>
                {
                    punterComps.length > 1 &&
                    <div className="column competition-container">
                        <CompetitionSelector
                            competitions={this.props.competitions}
                            selectedCompetition={this.props.selectedCompetition}
                            handleCompetitionSelect={this.handleCompetitionSelect}
                        />
                    </div>
                }
            </div>
        );
    }
}