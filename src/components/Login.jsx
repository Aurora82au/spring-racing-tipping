import React, { Component } from 'react';
import Header from './Header';

export default class RaceMeet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: 1,
            password: '',
            wrongPassword: false
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
            console.log('correct password');
            this.props.handleLogin(this.state.user, punter.isAdmin);
        }
        else {
            this.setState({
                wrongPassword: true
            });
            console.log('wrong password');
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

        return (
            <div className="app">
                <Header page="Log In" isAdmin={this.props.isAdmin} text="Please select your name from the drop down, and then enter your password to log in." />
                <div className="selector">
                    <select onChange={this.handlePunterSelect}>
                        {options}
                    </select>
                    <span className="icon-select"></span>
                </div>
                <label htmlFor="password" className="password-label">Password</label>
                <input id="password" className="password" type="password" defaultValue="" onChange={this.handlePasswordChange} />
                <button className="btn" type="button" onClick={this.handleLoginClick}>Log In</button>
                <div className={errorClass}>The password for the name you selected is incorrect</div>
            </div>
        );
    }
}