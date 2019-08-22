import React, { Component } from 'react';
import Header from '../components/Header';
import Meet from '../components/ResultsMeet';
import MeetSelector from '../components/MeetSelector';
import Menu from '../components/Menu';

export default class Results extends Component {
    /* Determines whether React should re-render the component, in this case if the new props are different from the old props. */
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props);
    }

    /* Function to render the component. */
    render() {
        const meetRaces = this.props.races.length && this.props.races.filter(race => race.meetId === this.props.selectedMeet);
        const meetTips = this.props.tips.length && this.props.tips.filter(tip => tip.meetId === this.props.selectedMeet);

        if (meetRaces && meetTips) {
            // Sort the races according to race number.
            meetRaces.sort((a, b) => {
                return (
                    a.number - b.number
                );
            });
            
            return (
                <div className="app">
                    <Header
                        page="Results"
                        path={this.props.path}
                        punters={this.props.punters}
                        user={this.props.user}
                        selectedCompetition={this.props.selectedCompetition}
                        onReloadData={this.props.onReloadData}
                        isAdmin={this.props.isAdmin}
                        text="This is where you can see the results of the hours of peoples research, strategy and rumination....before they just picked a number because they liked the jockey's pink star-spangled uniform."
                    />
                    <MeetSelector meets={this.props.meets} selectedMeetId={this.props.selectedMeet} onChange={this.props.onMeetChange} />
                    <Meet
                        races={meetRaces}
                        selectedRace={this.props.selectedRace}
                        punters={this.props.punters}
                        meetTips={meetTips}
                        onClick={this.props.onRaceChange}
                    />
                    <Menu path={this.props.path} />
                </div>
            );
        }
        else {
            return <div />;
        }
    }
}
