import React, { Component } from 'react';
import Header from './Header';
import RaceMeet from './RaceMeet';
import RaceMeetSelector from './RaceMeetSelector';
import Menu from './Menu';

export default class Results extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedMeet: '',
            selectedRace: 1,
            raceMeets: [],
            tips: []
        }
        this.handleMeetSelect = this.handleMeetSelect.bind(this);
        this.handleRaceSelect = this.handleRaceSelect.bind(this);
    }

    async getData() {
        try {
            let raceMeetResponse = await fetch('raceMeets.json'),
                meets = await raceMeetResponse.json(),
                tipsResponse = await fetch('tips.json'),
                tips = await tipsResponse.json();
            this.setState({
                selectedMeet: meets[0].meetId,
                raceMeets: meets,
                tips: tips
            });
        }
        catch (e) {
            console.log('An error occurred: ' + e);
        }
    }

    componentDidMount() {
        this.getData();
    }

    handleMeetSelect(event) {
        this.setState({
            selectedMeet: event.target.value,
            selectedRace: 1
        });
    }

    handleRaceSelect(event) {
        this.setState({
            selectedRace: parseInt(event.target.id, 10)
        });
    }

    render() {
        if (this.state.raceMeets.length) {
            let meet = this.state.raceMeets.find(meet => { return meet.meetId === this.state.selectedMeet }),
                meetTips = this.state.tips.find(meet => { return meet.meetId === this.state.selectedMeet });

            return (
                <div className="app">
                    {/* <Header /> */}
                    <RaceMeetSelector meets={this.state.raceMeets} selectedMeetId={this.state.selectedMeet.meetId} onChange={this.handleMeetSelect} />
                    <RaceMeet meet={meet} selectedRace={this.state.selectedRace} punters={this.props.punters} meetTips={meetTips} onClick={this.handleRaceSelect} />
                    <Menu></Menu>
                </div>
            );
        }
        else {
            return <div></div>;
        }
    }
}