import React, { Component } from 'react';

export default class RaceMeetSelector extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props);
    }
    
    render() {
        return (
            <div className="race-meet-selector">
                <select value={this.props.selectedMeetId} onChange={this.props.onChange}>
                    {this.props.meets.map(meet => {
                        return <option key={meet.meetId} value={meet.meetId}>{meet.name}</option>
                    })}
                </select>
                <span className="icon-select"></span>
            </div>
        );
    }
}