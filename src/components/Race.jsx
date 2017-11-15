import React, { Component } from 'react';
import Tip from './Tip';

export default class Race extends Component {
    /* Determines whether React should re-render the component, in this case if the new props are different from the old props */
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props);
    }
    
    /* Function to render the component */
    render() {
        let self = this,
            tips = self.props.tips.punters.map(punterTips => {
                return <Tip key={punterTips.punterId} tips={punterTips} punters={self.props.punters} placings={self.props.race.placings}  />
            }),
            statusClass;
        // Set the statusClass based on race's status
        switch (self.props.race.status) {
            case "Has Run": statusClass = "status green"; break;
            case "About To Jump": statusClass = "status orange"; break;
            case "Racing": statusClass = "status red"; break;
            case "Not Run Yet": statusClass = "status blue"; break;
            default: statusClass = "status"; break;
        }

        return (
            <div className="race">
                <div className="details">
                    <div className="mb-5 bold">Details</div>
                    <div className="mb-5 name">{self.props.race.name}</div>
                    <div className="mb-5">{self.props.race.time}</div>
                    <div className="mb-5">{self.props.race.distance}</div>
                    <div>
                        <span className="status-label">Status:&nbsp;</span>
                        <span className={statusClass}>{self.props.race.status}</span>
                    </div>
                </div>
                <div className="placings">
                    <div className="mb-5 bold">Placings</div>
                    <div className="mb-5"><span className="placing bold gold">1st</span>&nbsp;{self.props.race.placings.first}</div>
                    <div className="mb-5"><span className="placing bold silver">2nd</span>&nbsp;{self.props.race.placings.second}</div>
                    <div><span className="placing bold bronze">3rd</span>&nbsp;{self.props.race.placings.third}</div>
                </div>
                <div className="tips-heading bold">Tips</div>
                <div className="tips">
                    {tips}
                </div>
            </div>
        );
    }
}