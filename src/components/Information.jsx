import React, { Component } from 'react';
import Header from './Header';
import Menu from './Menu';

export default class Information extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props);
    }
    
    render() {
        return (
            <div className="app">
                <Header page="Information" punters={this.props.punters} user={this.props.user} isAdmin={this.props.isAdmin} text="This is where you can find a run down of how each of the pages of this app work, as well as the browser support and what some of the ideas for v2.0 are." />
                <div className="bold mt-20">Browser Support</div>
                <p>While this app will work fine on tablets and desktop, it was designed for mobile screen size, and to run in the latest version of the following browsers:</p>
                <ul className="browser-list">
                    <li><span className="browser chrome"></span>Chrome</li>
                    <li><span className="browser safari"></span>Safari</li>
                    <li><span className="browser firefox"></span>Firefox</li>
                    <li><span className="browser opera"></span>Opera</li>
                </ul>
                <div className="bold mt-20">Tips</div>
                <p>You are required to submit 3 tips for each race of every race meet.  The tips for each race meet must be submitted by 10:00am AEDT on the day of the race meet.</p>
                <p>The tips for that race meet will be disabled after 10:00am on the day of the meet.</p>
                <div className="bold mt-20">Results</div>
                <div className="bold mt-20">Leaderboard</div>
                <div className="bold mt-20">Admin</div>
                <div className="bold mt-20">Plans for v2.0</div>
                <ul className="future-plans">
                    <li>To improve the design for tablet and desktop screen sizes.</li>
                </ul>
                <Menu></Menu>
            </div>
        );
    }
}