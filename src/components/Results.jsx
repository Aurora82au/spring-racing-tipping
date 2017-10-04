import React, { Component } from 'react';
import Header from './Header';
import RaceMeet from './RaceMeet';
import RaceMeetSelector from './RaceMeetSelector';
import Menu from './Menu';

export default class Results extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props);
    }

    render() {
        let meet = this.props.raceMeets.find(meet => { return meet.meetId === this.props.selectedMeet }),
            meetTips = this.props.tips.find(meet => { return meet.meetId === this.props.selectedMeet });

        return (
            <div className="app">
                <Header page="Results" isAdmin={this.props.isAdmin} text="This is where you can see the results of the hours of peoples research, strategy and rumination....before they just picked a number because they liked the jockey's pink star-spangled uniform." />
                <RaceMeetSelector meets={this.props.raceMeets} selectedMeetId={this.props.selectedMeet} onChange={this.props.onMeetChange} />
                <RaceMeet meet={meet} selectedRace={this.props.selectedRace} punters={this.props.punters} meetTips={meetTips} onClick={this.props.onRaceChange} />
                <Menu></Menu>
            </div>
        );
    }
}