import React, { Component } from 'react';

export default class RaceMeetSelector extends Component {
    render() {
        return (
            <select className="race-meet-selector" value={this.selectedMeetId} onChange={this.props.onChange}>
                {this.props.meets.map(meet => {
                    return <option key={meet.meetId} value={meet.meetId}>{meet.name}</option>
                })}
            </select>
        );
    }
}

// TODO: Setting selectedMeetId isn't working at the moment.