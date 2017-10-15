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
                <Header page="Tips" path={this.props.path} punters={this.props.punters} user={this.props.user} isAdmin={this.props.isAdmin} text="You want a tip?.....be good to your mother.  Otherwise, simply select 3 horses for each race.  If you already have 3 selected and want to change one, simply unselect one of them. Don't worry about saving at the end, your tips are saved every time you make a change." />
                <p><b>* Tips must be in by 10:00am AEDT on race day.</b></p>
                <p>The tips will be disabled after this time.</p>
                <RaceMeetSelector meets={this.props.raceMeets} selectedMeetId={this.props.selectedMeet} onChange={this.props.onMeetChange} />
                <div className="tip-examples">
                    <span className="selection selected">18</span><span>Selected</span>
                    <span className="selection scratched">18</span><span>Scratched</span>
                    <span className="selection selected scratched">18</span><span>Both</span>
                </div>
                <TippingRaceList meet={meet} tips={tips} user={this.props.user} onSelectionChange={this.props.onSelectionChange} />
                <Menu path={this.props.path}></Menu>
            </div>
        );
    }
}