import React, { Component } from 'react';
import RaceMeet from './components/RaceMeet';
import RaceMeetSelector from './components/RaceMeetSelector';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedMeet: '',
            selectedRace: 1,
            raceMeets: [],
            punters: [],
            tips: []
        }
        this.handleMeetSelect = this.handleMeetSelect.bind(this);
        this.handleRaceSelect = this.handleRaceSelect.bind(this);
    }

    async getData() {
        try {
            let raceMeetResponse = await fetch('raceMeets.json'),
                meets = await raceMeetResponse.json(),
                punterResponse = await fetch('punters.json'),
                punters = await punterResponse.json(),
                tipsResponse = await fetch('tips.json'),
                tips = await tipsResponse.json();
            this.setState({
                selectedMeet: meets[0].meetId,
                raceMeets: meets,
                punters: punters,
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
                    {/* <h2>Spring Racing Tipping <img src="horse.png" alt="Title logo" /><span className="beta">BETA</span></h2> */}
                    <RaceMeetSelector meets={this.state.raceMeets} selectedMeetId={this.state.selectedMeet.meetId} onChange={this.handleMeetSelect} />
                    <RaceMeet meet={meet} selectedRace={this.state.selectedRace} punters={this.state.punters} meetTips={meetTips} onClick={this.handleRaceSelect} />
                </div>
            );
        }
        else {
            return <div></div>;
        }
    }
}

export default App;



// Caulfield Guineas day 14/10/17
// Caulfield cup 21/10/17
// Cox plate 28/10/17
// Darby day 3/11/17
// Cup day 7/11/17
// Oaks day 9/11/17
// Stakes day 11/11/17