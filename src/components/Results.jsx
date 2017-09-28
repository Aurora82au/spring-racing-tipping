import React, { Component } from 'react';
// import Header from './Header';
import RaceMeet from './RaceMeet';
import RaceMeetSelector from './RaceMeetSelector';
import Menu from './Menu';

export default class Results extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedMeet: this.props.raceMeets[0].meetId,
            selectedRace: 1
        }
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        return !((nextProps === this.props) && (nextState === this.state));
    }

    handleMeetSelect = event => {
        this.setState({
            selectedMeet: event.target.value,
            selectedRace: 1
        });
    }

    handleRaceSelect = event => {
        this.setState({
            selectedRace: parseInt(event.target.id, 10)
        });
    }

    render() {
        let meet = this.props.raceMeets.find(meet => { return meet.meetId === this.state.selectedMeet }),
            meetTips = this.props.tips.find(meet => { return meet.meetId === this.state.selectedMeet });

        return (
            <div className="app">
                {/* <Header /> */}
                <RaceMeetSelector meets={this.props.raceMeets} selectedMeetId={this.state.selectedMeet.meetId} onChange={this.handleMeetSelect} />
                <RaceMeet meet={meet} selectedRace={this.state.selectedRace} punters={this.props.punters} meetTips={meetTips} onClick={this.handleRaceSelect} />
                <Menu></Menu>
            </div>
        );
    }
}