import React, { Component } from 'react';
import Race from './ResultsRace';

export default class ResultsMeet extends Component {
    /* Determines whether React should re-render the component, in this case if the new props are different from the old props */
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props);
    }

    /* Function to render the component */
    render() {
        const self = this;
        const raceSelectors = [];
        const race = self.props.races.find(race => {
            return race._id === self.props.selectedRace;
        });
        const raceTips = self.props.meetTips.filter(raceTip => {
            return raceTip.raceId === self.props.selectedRace;
        });
        let className;

        // For each race of the meet passed in via props
        for (let i = 0, l = self.props.races.length; i < l; i++) {
            // Select the colour class for the race circles based on the status of the race
            switch (self.props.races[i].status) {
                case 2: // About To Jump
                    className = 'circle bg-orange';
                    break;
                case 3: // Racing
                    className = 'circle bg-red';
                    break;
                case 4: // Has Run
                    className = 'circle bg-green';
                    break;
                default:
                    // Default and Not Yet Run
                    className = 'circle bg-blue';
                    break;
            }
            // If race is the currently selected race, add the 'selected' class to className
            if (self.props.races[i]._id === self.props.selectedRace) {
                className += ' selected';
            }
            // Create selector HTML and add to the raceSelectors array
            raceSelectors.push(
                <div key={i} id={self.props.races[i]._id} className={className} onClick={self.props.onClick}>
                    {i + 1}
                </div>
            );
        }

        if (race) {
            return (
                <div className="race-meet">
                    <div className="race-selector">{raceSelectors}</div>
                    <h3>RACE {race.number}</h3>
                    <Race race={race} meets={self.props.meets} punters={self.props.punters} user={self.props.user} tips={raceTips} />
                </div>
            );
        }
        else {
            return <div />;
        }
    }
}
