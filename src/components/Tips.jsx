import React, { Component } from 'react';
import Header from './Header';
import RaceMeetSelector from './RaceMeetSelector';
import TippingRaceList from './TippingRaceList';
import Menu from './Menu';

export default class Tips extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props);
    }

    render() {
        let meet = this.props.raceMeets.find(meet => { return meet.meetId === this.props.selectedMeet }),
            tips = this.props.tips.find(tips => { return tips.meetId === this.props.selectedMeet });

        return (
            <div className="app">
                <Header page="Tips" isAdmin={this.props.isAdmin} text="You want a tip?.....be good to your mother.  Otherwise, simply select 3 horses for each race.  Don't worry about saving at the end, your tips are saved every time you make a change." />
                <RaceMeetSelector meets={this.props.raceMeets} selectedMeetId={this.props.selectedMeet} onChange={this.props.onMeetChange} />
                <TippingRaceList meet={meet} tips={tips} />
                <Menu></Menu>
            </div>
        );
    }
}