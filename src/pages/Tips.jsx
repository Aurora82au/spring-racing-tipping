import React, { Component } from 'react';
import Header from '../components/Header';
import MeetSelector from '../components/MeetSelector';
import TipsRaceList from '../components/TipsRaceList';
import Menu from '../components/Menu';

export default class Tips extends Component {
    /* Determines whether React should re-render the component, in this case if the new props are different from the old props */
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props);
    }

    /* Function to render the component */
    render() {
        const meet = this.props.meets.find(meet => {
            return meet._id === this.props.selectedMeet;
        });
        const races = this.props.races.filter(race => {
            return race.meetId === this.props.selectedMeet;
        });
        const tips = this.props.tips.filter(tip => {
            return tip.meetId === this.props.selectedMeet;
        });

        return (
            <div className="app">
                <Header
                    page="Tips"
                    path={this.props.path}
                    punters={this.props.punters}
                    user={this.props.user}
                    onReloadData={this.props.onReloadData}
                    isAdmin={this.props.isAdmin}
                    text="You want a tip?.....be good to your mother.  Otherwise, simply select 3 horses for each race.  If you already have 3 selected and want to change one, simply unselect one of them. Don't worry about saving at the end, your tips are saved every time you make a change."
                />
                <p>
                    <b>* Tips must be in by 10:00am AEDT on race day.</b>
                </p>
                <p>The tips will be disabled after this time.</p>
                <MeetSelector meets={this.props.meets} selectedMeetId={this.props.selectedMeet} onChange={this.props.onMeetChange} />
                <div className="tip-examples">
                    <span className="selection selected">18</span>
                    <span>Selected</span>
                    <span className="selection scratched">18</span>
                    <span>Scratched</span>
                    <span className="selection selected scratched">18</span>
                    <span>Both</span>
                </div>
                <TipsRaceList
                    meet={meet}
                    races={races}
                    tips={tips}
                    selectedRace={this.props.selectedRace}
                    user={this.props.user}
                    onSelectionChange={this.props.onSelectionChange}
                />
                <Menu path={this.props.path} />
            </div>
        );
    }
}
