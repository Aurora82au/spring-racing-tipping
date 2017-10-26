import React, { Component } from 'react';

export default class RaceMeetSelector extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props);
    }
    
    render() {
        let meets = this.props.meets.sort((a, b) => { return a.date.localeCompare(b.date) }),
            split, date;

        return (
            <div className="selector">
                <select value={this.props.selectedMeetId} onChange={this.props.onChange}>
                    {meets.map(meet => {
                        split = meet.date.split('-');
                        date = `${split[2]}/${split[1]}`;
                        return <option key={meet.meetId} value={meet.meetId}>{meet.name} ({date})</option>
                    })}
                </select>
                <span className="icon-select"></span>
            </div>
        );
    }
}