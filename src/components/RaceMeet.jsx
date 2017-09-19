import React, { Component } from 'react';
import Race from './Race';

export default class RaceMeet extends Component {
    render() {
        let self = this,
            races = self.props.meet.races.map(race => {
                let raceTips = self.props.meetTips.races.find(tipRace => { return tipRace.number === race.number });
                return <Race key={race.name} race={race} punters={self.props.punters} tips={raceTips} />;
            });
        
        return (
            <div className="race-meet">
                <h3>{self.props.meet.name}</h3>
                {races}
            </div>
        );
    }
}