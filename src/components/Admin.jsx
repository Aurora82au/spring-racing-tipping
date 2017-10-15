import React, { Component } from 'react';
import Header from './Header';
import RaceMeetSelector from './RaceMeetSelector';
import Menu from './Menu';

export default class Admin extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props);
    }

    handleSelectionClick = () => {
        console.log('Selection clicked');
    }

    render() {
        let meet = this.props.raceMeets.find(meet => { return meet.meetId === this.props.selectedMeet }),
            raceList = [],
            selections = [],
            className;

        for (let i = 0; i < meet.races.length; i++) {
            selections = [];

            for (let j = 0; j < 24; j++) {
                className = 'selection';
                if (meet.races[i].scratchings.includes(j + 1)) { className += ' scratched'; }
                
                selections.push(<div key={j} className={className} data-race={(i + 1)} onClick={this.handleSelectionClick}>{j + 1}</div>);
            }

            raceList.push(
                <div key={i} className="adminRace">
                    <div className="details">
                        <span className="bold">RACE {meet.races[i].number}</span>
                        <span className="name">&nbsp;-&nbsp;{meet.races[i].name}</span>
                    </div>
                    <div className="placings">
                        <div><label htmlFor={"race-" + (i + 1) + "-first"}>1st</label><input id={"race-" + (i + 1) + "-first"} type="tel" defaultValue={meet.races[i].placings.first} /></div>
                        <div><label htmlFor={"race-" + (i + 1) + "-second"}>2nd</label><input id={"race-" + (i + 1) + "-second"} type="tel" defaultValue={meet.races[i].placings.second} /></div>
                        <div><label htmlFor={"race-" + (i + 1) + "-third"}>3rd</label><input id={"race-" + (i + 1) + "-third"} type="tel" defaultValue={meet.races[i].placings.third} /></div>
                        <button className="save-btn" type="button">Save</button>
                    </div>
                    <div className="mb-10 bold">Set Race Status</div>
                    <div className="status-selector">
                        <button className={(meet.races[i].status === 'Not Run Yet') ? 'btn status-selector-btn selected' : 'btn status-selector-btn'}
                                type="button" data-meet={meet.meetId} data-race={(i + 1)} data-status="Not Run Yet">Not Run Yet</button>
                        <button className={(meet.races[i].status === 'About To Jump') ? 'btn status-selector-btn selected' : 'btn status-selector-btn'}
                                type="button" data-meet={meet.meetId} data-race={(i + 1)} data-status="About To Jump">About To Jump</button>
                        <button className={(meet.races[i].status === 'Racing') ? 'btn status-selector-btn selected' : 'btn status-selector-btn'}
                                type="button" data-meet={meet.meetId} data-race={(i + 1)} data-status="Racing">Racing</button>
                        <button className={(meet.races[i].status === 'Has Run') ? 'btn status-selector-btn selected' : 'btn status-selector-btn'}
                                type="button" data-meet={meet.meetId} data-race={(i + 1)} data-status="Has Run">Has Run</button>
                    </div>
                    <div className="scratching-list">
                        <div className="mb-10 bold">Scratchings</div>
                        <div className="selections">
                            {selections}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="app">
                <Header page="Administration" path={this.props.path} punters={this.props.punters} user={this.props.user} isAdmin={this.props.isAdmin} text="This is the Administration page used to set placings and race statuses.  In the future you will also be able to set scratchings." />
                <RaceMeetSelector meets={this.props.raceMeets} selectedMeetId={this.props.selectedMeet} onChange={this.props.onMeetChange} />
                <div className="adminRaceList">
                    {raceList}
                </div>
                <Menu path={this.props.path}></Menu>
            </div>
        );
    }
}