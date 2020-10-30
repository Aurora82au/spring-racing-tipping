import React, { Component } from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import LabelAndInput from '../components/LabelAndInput';
import LabelAndSelectBox from '../components/LabelAndSelectBox';
import CompetitionSelector from '../components/CompetitionSelector';
import ErrorMessage from '../components/ErrorMessage';
import { logOut } from '../helpers/utilities';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            password: '',
            wrongPassword: false,
            punterComps: []
        };
    }

    /* Determines whether React should re-render the component, in this case if the new props are different from the old props,
       or if the new state is different from the current . */
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props && nextState === this.state);
    }

    /* When the user selects a punter from the drop down, set that user in the state and hide the password error. */
    handlePunterSelect = event => {
        this.setState({
            user: parseInt(event.target.value, 10),
            wrongPassword: false
        });
    };

    /* When the user enters a password, set it in the state and hide the wrong password message. */
    handlePasswordChange = value => {
        this.setState({
            password: value,
            wrongPassword: false
        });
    };

    /* When the user clicks the 'Log In' button, if the password stored in the state matches the selected users password then call the
       handleLogin function passed from App.js and redirect the user to the Results page, else display the wrong password error. */
    handleLoginClick = () => {
        const punter = this.props.allPunters.find(punter => {
            return punter._id === this.state.user;
        });

        if (punter) {
            if (punter.password === this.state.password) {
                this.setState({
                    wrongPassword: false
                });
                // Call handleLogin from App.js to set the logged in user
                this.props.handleLogin(this.state.user);
            } else {
                this.setState({
                    wrongPassword: true
                });
            }
        }
    };

    handleCompetitionSelect = event => {
        this.props.handleCompetitionSelect(event);
        // Redirect to the Results page
        this.props.history.push(`/results`);
    }

    /* Function to render the component. */
    render() {
        // Sort names in ascending order by first name, then create an <option> for each of them.
        let sorted = this.props.allPunters.sort((a, b) => {
            return a.name.first.localeCompare(b.name.first);
        });

        // Move Top odds, Bottom Odds and 1, 2, 3 to the end of the array.
        for (let i = 0, len = sorted.length; i < len; i++) {
            if (sorted[i].name.first === 'Top' || sorted[i].name.first === 'Bottom' || sorted[i].name.first === '1, 2, 3') {
                sorted.push(sorted.splice(i, 1)[0]);
            }
        }

        // Create an array of option elements for each punter.
        let punterOptions = sorted.map(punter => {
            return (
                <option key={punter._id} value={punter._id}>
                    {punter.name.first} {punter.name.last}
                </option>
            );
        });

        // Add a default <option> at the beginning of punters.
        punterOptions.unshift(
            <option key="a" value="">
                -- Select Name --
            </option>
        );

        // Show the error message if the password is wrong.
        const errorClass = this.state.wrongPassword ? 'error' : 'error hide';
        

        return (
            <div className="app">
                <Header
                    page="Log In"
                    competitions={this.props.competitions}
                    user={this.props.user}
                    isAdmin={this.props.isAdmin}
                    text="Please select your name from the drop down, and then enter your password to log in."
                />
                <LabelAndSelectBox
                    labelClasses="sr-only"
                    labelText="Select a punter"
                    value={this.props.user ? this.props.user._id : this.state.user ? this.state.user : ''}
                    handleSelect={this.handlePunterSelect}
                    disabled={this.props.user}
                    options={punterOptions}
                />
                {
                    !this.props.user &&
                    <LabelAndInput
                        labelText="Password"
                        inputClasses="password"
                        type="password"
                        value={this.props.user ? this.props.user.password : ''}
                        handleChange={this.handlePasswordChange}
                        onKeyDown={event => { if (event.code === "Enter" || event.code === "NumpadEnter") { this.handleLoginClick(event); } }}
                        disabled={this.props.user}
                    />
                }
                <Button
                    classes="btn"
                    type="button"
                    onClick={this.props.user ? logOut : this.handleLoginClick}
                    disabled={false}
                    text={this.props.user ? 'Log Out' : 'Log In'}
                />
                <ErrorMessage classes={errorClass} text="The password for the name you selected is incorrect" />
                {
                    this.props.user &&
                    this.props.competitions.length &&
                    <CompetitionSelector
                        competitions={this.props.competitions}
                        handleCompetitionSelect={this.handleCompetitionSelect}
                    />
                }
            </div>
        );
    }
}
