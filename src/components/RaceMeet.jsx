import React, { Component } from 'react';
import Race from './Race';

export default class RaceMeet extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props);
    }
    
    render() {
        let self = this,
            raceSelectors = [],
            race = self.props.meet.races.find(race => { return race.number === self.props.selectedRace }),
            raceTips = self.props.meetTips.races.find(tipRace => { return tipRace.number === self.props.selectedRace });
            for (let i = 0; i < self.props.meet.races.length; i++) {
                let className;
                switch (self.props.meet.races[i].status) {
                    case "Has Run": className = 'circle bg-green'; break;
                    case "About To Jump": className = 'circle bg-orange'; break;
                    case "Racing": className = 'circle bg-red'; break;
                    default: className = 'circle bg-blue'; break;
                }
                if (self.props.meet.races[i].number === self.props.selectedRace) { className += ' selected' }
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