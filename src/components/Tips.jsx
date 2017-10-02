import React, { Component } from 'react';
import Header from './Header';
import RaceMeetSelector from './RaceMeetSelector';
import TippingRaceList from './TippingRaceList';
import Menu from './Menu';

export default class Tips extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedMeet: this.props.raceMeets[0].meetId
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !((nextProps === this.props) && (nextState === this.state));
    }
    
    handleMeetSelect = event => {
        this.setState({
            selectedMeet: event.target.value
        });
    }

    render() {
        let meet = this.props.raceMeets.find((meet) => { return meet.meetId === this.state.selectedMeet }),
            tips = this.props.tips.find((tips) => { return tips.meetId === this.state.selectedMeet });

        return (
            <div className="app">
                <Header page="Tips" text="You want a tip?.....be good to your mother.  Otherwise, simply select 3 horses for each race.  Don't worry about saving at the end, your tips are saved every time you make a change." />
                <RaceMeetSelector meets={this.props.raceMeets} selectedMeetId={this.state.selectedMeet.meetId} onChange={this.handleMeetSelect} />
                <TippingRaceList meet={meet} tips={tips} />
                <Menu></Menu>
            </div>
        );
    }
}