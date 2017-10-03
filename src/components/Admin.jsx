import React, { Component } from 'react';
import Header from './Header';
import RaceMeetSelector from './RaceMeetSelector';
import Menu from './Menu';

export default class Admin extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props);
    }

    render() {
        let meet = this.props.raceMeets.find(meet => { return meet.meetId === this.props.selectedMeet }),
            raceList = [],
            classes, btnTxt, dataStatus;

        for (let i = 0; i < meet.races.length; i++) {
            if (meet.races[i].status === 'Not Run Yet' || meet.races[i].status === 'About to jump') {
                classes = 'status-selector-btn';
                btnTxt = 'Race Started';
                dataStatus = 'Racing';
            }
            else if (meet.races[i].status === 'Racing') {
                classes = 'status-selector-btn active';
                btnTxt = 'Race Finished';
                dataStatus = 'Has Run';
            }
            else {
                classes = 'status-selector-btn disabled';
                btnTxt = 'Race Has Run';
            }

            raceList.push(
                <div key={i} className="adminRace">
                    <div className="details">
                        <span className="bold">RACE {meet.races[i].number}</span>
                        <span className="name">&nbsp;-&nbsp;{meet.races[i].name}</span>
                    </div>
                    <div className="placings">
                        <div className="mb-5"><label htmlFor={"race-" + (i + 1) + "-first"}>1st</label><input id={"race-" + (i + 1) + "-first"} type="tel" defaultValue={meet.races[i].placings.first} /></div>
                        <div className="mb-5"><label htmlFor={"race-" + (i + 1) + "-second"}>2nd</label><input id={"race-" + (i + 1) + "-second"} type="tel" defaultValue={meet.races[i].placings.second} /></div>
                        <div className="mb-5"><label htmlFor={"race-" + (i + 1) + "-third"}>3rd</label><input id={"race-" + (i + 1) + "-third"} type="tel" defaultValue={meet.races[i].placings.third} /></div>
                    </div>
                    <div className="status-selector">
                        <h4>Set Race Status</h4>
                        <button className={classes} type="button" data-meet={meet.meetId} data-race={(i + 1)} data-status={dataStatus}>{btnTxt}</button>
                    </div>
                </div>
            );
        }

        return (
            <div className="app">
                <Header page="Administration" text="This is the Administration page used to set placings and race statuses.  In the future you will also be able to set scratchings." />
                <RaceMeetSelector meets={this.props.raceMeets} selectedMeetId={this.props.selectedMeet} onChange={this.props.onMeetChange} />
                <div className="adminRaceList">
                    {raceList}
                </div>
                <Menu></Menu>
            </div>
        );
    }
}