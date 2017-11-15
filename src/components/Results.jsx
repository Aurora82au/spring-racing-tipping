import React, { Component } from 'react';
import Header from './Header';
import RaceMeet from './RaceMeet';
import RaceMeetSelector from './RaceMeetSelector';
import Menu from './Menu';

export default class Results extends Component {
    /* Determines whether React should re-render the component, in this case if the new props are different from the old props */
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props);
    }
    
    /* When the user clicks to go back from the Rick Roll screen, flip it back to the normal screen */
    handleLogoBack = event => {
        let container = document.querySelector('.flip-container');
        container.classList.remove('flipped');
        setTimeout(() => { container.classList.remove('preserve-3d'); }, 600);
    }

    /* Function to render the component */
    render() {
        let meet = this.props.raceMeets.find(meet => { return meet.meetId === this.props.selectedMeet }),
            meetTips = this.props.tips.find(meet => { return meet.meetId === this.props.selectedMeet });

        // The code for this page is within the 'front' <div>, the rest is the scaffolding to do the page flip for the Rick Roll
        return (
            <div className="app">
                <div className="flip-container">
                    <div className="flipper">
                        <div className="front">
                            <Header page="Results" path={this.props.path} punters={this.props.punters} user={this.props.user} onReloadData={this.props.onReloadData} isAdmin={this.props.isAdmin} text="This is where you can see the results of the hours of peoples research, strategy and rumination....before they just picked a number because they liked the jockey's pink star-spangled uniform." />
                            <RaceMeetSelector meets={this.props.raceMeets} selectedMeetId={this.props.selectedMeet} onChange={this.props.onMeetChange} />
                            <RaceMeet meet={meet} selectedRace={this.props.selectedRace} punters={this.props.punters} meetTips={meetTips} onClick={this.props.onRaceChange} />
                            <Menu path={this.props.path}></Menu>
                        </div>
                        <div className="back">
                            <img className="you-got" src='rickrolled.jpg' alt="You've been Rick Rolled" />
                            <img src='rick.gif' alt="Rick Roll" />
                            <div>Click the button below to return</div>
                            <button className="btn" type="button" onClick={this.handleLogoBack}>
                                <img src='rickrolled2.jpg' alt="Go back" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}