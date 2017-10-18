import React, { Component } from 'react';
import Header from './Header';
import RaceMeetSelector from './RaceMeetSelector';
import Menu from './Menu';

export default class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            races: [
                {
                    number: 1,
                    placings: {
                        first: '',
                        second: '',
                        third: ''
                    },
                    status: '',
                    scratchings: []
                },
                {
                    number: 2,
                    placings: {
                        first: '',
                        second: '',
                        third: ''
                    },
                    status: '',
                    scratchings: []
                },
                {
                    number: 3,
                    placings: {
                        first: '',
                        second: '',
                        third: ''
                    },
                    status: '',
                    scratchings: []
                },
                {
                    number: 4,
                    placings: {
                        first: '',
                        second: '',
                        third: ''
                    },
                    status: '',
                    scratchings: []
                },
                {
                    number: 5,
                    placings: {
                        first: '',
                        second: '',
                        third: ''
                    },
                    status: '',
                    scratchings: []
                },
                {
                    number: 6,
                    placings: {
                        first: '',
                        second: '',
                        third: ''
                    },
                    status: '',
                    scratchings: []
                },
                {
                    number: 7,
                    placings: {
                        first: '',
                        second: '',
                        third: ''
                    },
                    status: '',
                    scratchings: []
                },
                {
                    number: 8,
                    placings: {
                        first: '',
                        second: '',
                        third: ''
                    },
                    status: '',
                    scratchings: []
                },
                {
                    number: 9,
                    placings: {
                        first: '',
                        second: '',
                        third: ''
                    },
                    status: '',
                    scratchings: []
                },
                {
                    number: 10,
                    placings: {
                        first: '',
                        second: '',
                        third: ''
                    },
                    status: '',
                    scratchings: []
                }
            ]
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !((nextProps === this.props) && (nextState === this.state));
    }
    
    componentDidMount() {
        this.setStateData(this.props.raceMeets, this.props.selectedMeet);
    }

    componentWillReceiveProps(nextProps) {
        this.setStateData(nextProps.raceMeets, nextProps.selectedMeet);
    }

    setStateData = (propsRaceMeets, propsSelectedMeet) => {
        let races = this.state.races,
            meet = propsRaceMeets.find(meet => { return meet.meetId === propsSelectedMeet });

        for (let i = 0; i < meet.races.length; i++) {
            races[i].placings = meet.races[i].placings;
            races[i].status = meet.races[i].status;
            races[i].scratchings = meet.races[i].scratchings;
        }

        this.setState({
            races: races
        });
        console.log(this.state.races);
    }

    handlePlacingChange = event => {
        let races = this.state.races,
            raceChanged = event.target.id.split('-')[1],
            placingChanged = event.target.id.split('-')[2],
            placings = races[raceChanged - 1].placings;

        if (placingChanged === 'first') { placings.first = event.target.value }
        if (placingChanged === 'second') { placings.second = event.target.value }
        if (placingChanged === 'third') { placings.third = event.target.value }

        this.setState({
            races: races
        });
    }
    
    handleSaveClick = event => {
        let modifiedRace = event.target.getAttribute('data-race'),
            placings = this.state.races[modifiedRace - 1].placings;
        this.props.onPlacingsChange(modifiedRace, placings);
    }
    
    handleStatusChange = event => {
        console.log('handleStatusChange called: ' + event.target.getAttribute('data-status'));
    }

    handleSelectionClick = event => {
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
                if (this.state.races[i].scratchings.includes(j + 1)) { className += ' scratched'; }
                
                selections.push(<div key={j} className={className} data-race={(i + 1)} onClick={this.handleSelectionClick}>{j + 1}</div>);
            }

            raceList.push(
                <div key={i} className="adminRace">
                    <div className="details">
                        <span className="bold">RACE {meet.races[i].number}</span>
                        <span className="name">&nbsp;-&nbsp;{meet.races[i].name}</span>
                    </div>
                    <div className="placings">
                        <div><label htmlFor={"race-" + (i + 1) + "-first"}>1st</label><input id={"race-" + (i + 1) + "-first"} type="tel" value={this.state.races[i].placings.first} onChange={this.handlePlacingChange} /></div>
                        <div><label htmlFor={"race-" + (i + 1) + "-second"}>2nd</label><input id={"race-" + (i + 1) + "-second"} type="tel" value={this.state.races[i].placings.second} onChange={this.handlePlacingChange} /></div>
                        <div><label htmlFor={"race-" + (i + 1) + "-third"}>3rd</label><input id={"race-" + (i + 1) + "-third"} type="tel" value={this.state.races[i].placings.third} onChange={this.handlePlacingChange} /></div>
                        <button className="save-btn" type="button" data-race={i + 1} onClick={this.handleSaveClick}>Save</button>
                    </div>
                    <div className="mb-10 bold">Set Race Status</div>
                    <div className="status-selector">
                        <button className={(meet.races[i].status === 'Not Run Yet') ? 'btn status-selector-btn selected' : 'btn status-selector-btn'}
                                type="button" data-meet={meet.meetId} data-race={(i + 1)} data-status="Not Run Yet" onClick={this.handleStatusChange}>Not Run Yet</button>
                        <button className={(meet.races[i].status === 'About To Jump') ? 'btn status-selector-btn selected' : 'btn status-selector-btn'}
                                type="button" data-meet={meet.meetId} data-race={(i + 1)} data-status="About To Jump" onClick={this.handleStatusChange}>About To Jump</button>
                        <button className={(meet.races[i].status === 'Racing') ? 'btn status-selector-btn selected' : 'btn status-selector-btn'}
                                type="button" data-meet={meet.meetId} data-race={(i + 1)} data-status="Racing" onClick={this.handleStatusChange}>Racing</button>
                        <button className={(meet.races[i].status === 'Has Run') ? 'btn status-selector-btn selected' : 'btn status-selector-btn'}
                                type="button" data-meet={meet.meetId} data-race={(i + 1)} data-status="Has Run" onClick={this.handleStatusChange}>Has Run</button>
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