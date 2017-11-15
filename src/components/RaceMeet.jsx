import React, { Component } from 'react';
import Race from './Race';

export default class RaceMeet extends Component {
    /* Determines whether React should re-render the component, in this case if the new props are different from the old props */
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props);
    }
    
    /* Function to render the component */
    render() {
        let self = this,
            raceSelectors = [],
            race = self.props.meet.races.find(race => { return race.number === self.props.selectedRace }),
            raceTips = self.props.meetTips.races.find(tipRace => { return tipRace.number === self.props.selectedRace });
            // For each race of the meet passed in via props
            for (let i = 0; i < self.props.meet.races.length; i++) {
                let className;
                // Select the colour class for the race circles based on the status of the race
                switch (self.props.meet.races[i].status) {
                    case "Has Run": className = 'circle bg-green'; break;
                    case "About To Jump": className = 'circle bg-orange'; break;
                    case "Racing": className = 'circle bg-red'; break;
                    default: className = 'circle bg-blue'; break;
                }
                // If race is the currently selected race, add the 'selected' class to className
                if (self.props.meet.races[i].number === self.props.selectedRace) { className += ' selected' }
                // Create selector HTML and add to the raceSelectors array
                raceSelectors.push(<div key={i} id={i + 1} className={className} onClick={self.props.onClick}>{i + 1}</div>);
            }
        
        return (
            <div className="race-meet">
                <div className="race-selector">
                    {raceSelectors}
                </div>
                <h3>RACE {race.number}</h3>
                <Race race={race} punters={self.props.punters} tips={raceTips} />
            </div>
        );
    }
}