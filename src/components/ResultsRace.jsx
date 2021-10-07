import React, { Component } from 'react';
import Tip from './ResultsTip';

export default class ResultsRace extends Component {
    /* Determines whether React should re-render the component, in this case if the new props are different from the old props. */
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props);
    }

    /* Function to render the component. */
    render() {
        const self = this;
        const tips = self.props.tips.map(punterTips => {
            return <Tip key={punterTips._id} tips={punterTips} punters={self.props.punters} placings={self.props.race.placings} />;
        });
        let statusClass;
        let statusName;

        if (!tips.length) {
            tips.push(<div key="a" className="no-races-msg">There are not yet any tips for this race.</div>);
        }

        // Set the statusClass based on race's status.
        switch (self.props.race.status) {
            case 1:
                statusClass = 'status blue';
                statusName = 'Not Yet Run';
                break;
            case 2:
                statusClass = 'status orange';
                statusName = 'About To Jump';
                break;
            case 3:
                statusClass = 'status red';
                statusName = 'Racing';
                break;
            case 4:
                statusClass = 'status green';
                statusName = 'Has Run';
                break;
            default:
                statusClass = 'status';
                statusName = 'Unknown';
                break;
        }

        // Set placings.
        let firstPlace = self.props.race.placings.first !== 0 ? self.props.race.placings.first : '';
        let secondPlace = self.props.race.placings.second !== 0 ? self.props.race.placings.second : '';
        let thirdPlace = self.props.race.placings.third !== 0 ? self.props.race.placings.third : '';
        if (firstPlace.constructor === Array) {
            firstPlace = firstPlace.join(', ');
        }
        if (secondPlace.constructor === Array) {
            secondPlace = secondPlace.join(', ');
        }
        if (thirdPlace.constructor === Array) {
            thirdPlace = thirdPlace.join(', ');
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
                        <span className={statusClass}>{statusName}</span>
                    </div>
                </div>
                <div className="placings">
                    <div className="mb-5 bold">Placings</div>
                    <div className="placing mb-5">
                        <span className="label bold gold">1st</span>&nbsp;{firstPlace}
                    </div>
                    <div className="placing mb-5">
                        <span className="label bold silver">2nd</span>&nbsp;{secondPlace}
                    </div>
                    <div className="placing">
                        <span className="label bold bronze">3rd</span>&nbsp;{thirdPlace}
                    </div>
                </div>
                <div className="tips-heading bold">Tips</div>
                <div className="tips">{tips}</div>
            </div>
        );
    }
}
