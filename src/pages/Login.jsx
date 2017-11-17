import React, { Component } from 'react';
import Header from '../components/Header';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: 1,
            password: '',
            wrongPassword: false,
            focused: false
        }
    }

    /* Determines whether React should re-render the component, in this case if the new props are different from the old props,
       or if the new state is different from the current state */
    shouldComponentUpdate(nextProps, nextState) {
        return !((nextProps === this.props) && (nextState === this.state));
    }
    
    /* When the user selects a punter from the drop down, set that user in the state and hide the password error */
    handlePunterSelect = event => {
        this.setState({
            user: parseInt(event.target.value, 10),
            wrongPassword: false
        });
    }

    /* When the user focuses the password field, set focused in the state to true.  Used to shift the label out of the field */
    handlePasswordFocus = event => {
        this.setState({
            focused: true
        });
    }

    /* When focus is lost on the password field, set focused in the state to false.  Used to shift the label into the field */
    handlePasswordBlur = event => {
        this.setState({
            focused: false
        });
    }

    /* When the user enters a password, set it in the state and hide the wrong password message */
    handlePasswordChange = event => {
        this.setState({
            password: event.target.value,
            wrongPassword: false
        });
    }

    /* When the user clicks the 'Log In' button, if the password stored in the state matches the selected users password then call the
       handleLogin function passed from App.js and redirect the user to the Results page, else display the wrong password error */
    handleLoginClick = () => {
        let punter = this.props.punters.find(punter => { return punter.punterId === this.state.user });
        if (punter.password === this.state.password) {
            this.setState({
                wrongPassword: false
            });
            // Call handleLogin from App.js to set the logged in user and if they are an admin
            this.props.handleLogin(this.state.user, punter.isAdmin);
            // Redirect to the Results page
            this.props.history.push(this.props.path + 'results');
        }
        else {
            this.setState({
                wrongPassword: true
            });
        }
    }
    
    /* Function to render the component */
    render() {
        // Sort names in ascending order by first name, then create an <option> for each of them
        let sorted = this.props.punters.sort((a, b) => { return a.name.first.localeCompare(b.name.first) });

        // Move Top odds, Bottom Odds and 1, 2, 3 to the end of the array
        for (let i = 0, len = sorted.length; i < len; i++) {
            if (sorted[i].name.first === "Top" || sorted[i].name.first === "Bottom" || sorted[i].name.first === "1, 2, 3") {
                sorted.push(sorted.splice(i, 1)[0])
            }
        }

        // Create an array of option elements for each punter
        let options = sorted.map(punter => {
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
                <Header page="Log In" punters={this.props.punters} user={this.props.user} isAdmin={this.props.isAdmin} text="Please select your name from the drop down, and then enter your password to log in." />
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