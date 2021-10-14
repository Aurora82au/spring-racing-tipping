import React, { Component } from 'react';
import Header from '../components/Header';
import Meet from '../components/ResultsMeet';
import MeetSelector from '../components/MeetSelector';
import BottomMenu from '../components/BottomMenu';

export default class Results extends Component {
    /* Determines whether React should re-render the component, in this case if the new props are different from the old props. */
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props);
    }

    /* Function to render the component. */
    render() {
        const meetRaces = this.props.races.length ? this.props.races.filter(race => race.meetId === this.props.selectedMeet) : [];
        const meetTips = this.props.tips.length ? this.props.tips.filter(tip => tip.meetId === this.props.selectedMeet) : [];

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
                    competitions={this.props.competitions}
                    user={this.props.user}
                    selectedCompetition={this.props.selectedCompetition}
                    handleCompetitionSelect={this.props.handleCompetitionSelect}
                    onReloadData={this.props.onReloadData}
                    isAdmin={this.props.isAdmin}
                    text="This is where you can see the results of the hours of peoples research, strategy and rumination....before they just picked a number because they liked the jockey's pink star-spangled uniform."
                />
                <MeetSelector meets={this.props.meets} selectedMeetId={this.props.selectedMeet} onChange={this.props.onMeetChange} />
                {
                    meetRaces && meetTips &&
                    <Meet
                        races={meetRaces}
                        selectedRace={this.props.selectedRace}
                        user={this.props.user}
                        punters={this.props.punters}
                        meets={this.props.meets}
                        meetTips={meetTips}
                        onClick={this.props.onRaceChange}
                    />
                }
                {
                    !meetRaces.length && <div>This meet doesn't seem to have any races.</div>
                }
                <BottomMenu path={this.props.path} />
            </div>
        );
    }
}
