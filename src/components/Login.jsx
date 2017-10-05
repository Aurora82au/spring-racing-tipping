import React, { Component } from 'react';
import Header from './Header';

export default class RaceMeet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: 1,
            password: '',
            wrongPassword: false,
            focused: false
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !((nextProps === this.props) && (nextState === this.state));
    }
    
    handlePunterSelect = event => {
        this.setState({
            user: parseInt(event.target.value, 10),
            wrongPassword: false
        });
    }

    handlePasswordFocus = event => {
        this.setState({
            focused: true
        });
    }

    handlePasswordBlur = event => {
        this.setState({
            focused: false
        });
    }

    handlePasswordChange = event => {
        this.setState({
            password: event.target.value,
            wrongPassword: false
        });
    }

    handleLoginClick = () => {
        let punter = this.props.punters.find(punter => { return punter.punterId === this.state.user });
        if (punter.password === this.state.password) {
            this.setState({
                wrongPassword: false
            });
            // Call handleLogin from App to set the logged in user and if they are an admin
            this.props.handleLogin(this.state.user, punter.isAdmin);
            // Redirect to the Information page
            this.props.history.push('/information');
        }
        else {
            this.setState({
                wrongPassword: true
            });
        }
    }
    
    render() {
        // Sort names in ascending order by first name, then create an <option> for each of them
        let sorted = this.props.punters.sort((a, b) => { return a.name.first > b.name.first }),
            options = sorted.map(punter => {
                return <option key={punter.punterId} value={punter.punterId}>{punter.name.first} {punter.name.last}</option>
            });
        
        // Add a default <option> at the beginning
        options.unshift(<option key="a" value="">-- Select Name --</option>);

        // Show the error message if the password is wrong
        let errorClass = this.state.wrongPassword ? 'error' : 'error hide';

        // Set focused class on the password label to have it move out of the input, but not go back in if there is a value
        let labelClass = (this.state.focused || this.state.password !== '') ? 'password-label focused' : 'password-label';

        return (
            <div className="app">
                <Header page="Log In" isAdmin={this.props.isAdmin} text="Please select your name from the drop down, and then enter your password to log in." />
                <div className="selector">
                    <select onChange={this.handlePunterSelect}>
                        {options}
                    </select>
                    <span className="icon-select"></span>
                </div>
                <label htmlFor="password" className={labelClass}>Password</label>
                <input id="password" className="password" type="password" defaultValue="" 
                       onFocus={this.handlePasswordFocus}
                       onBlur={this.handlePasswordBlur}
                       onChange={this.handlePasswordChange} />
                <button className="btn" type="button" onClick={this.handleLoginClick}>Log In</button>
                <div className={errorClass}>The password for the name you selected is incorrect</div>
            </div>
        );
    }
}