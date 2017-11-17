import React, { Component } from 'react';
import Header from '../components/Header';
import RaceMeetSelector from '../components/RaceMeetSelector';
import Menu from '../components/Menu';

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
                    scratchings: []
                },
                {
                    number: 2,
                    placings: {
                        first: '',
                        second: '',
                        third: ''
                    },
                    scratchings: []
                },
                {
                    number: 3,
                    placings: {
                        first: '',
                        second: '',
                        third: ''
                    },
                    scratchings: []
                },
                {
                    number: 4,
                    placings: {
                        first: '',
                        second: '',
                        third: ''
                    },
                    scratchings: []
                },
                {
                    number: 5,
                    placings: {
                        first: '',
                        second: '',
                        third: ''
                    },
                    scratchings: []
                },
                {
                    number: 6,
                    placings: {
                        first: '',
                        second: '',
                        third: ''
                    },
                    scratchings: []
                },
                {
                    number: 7,
                    placings: {
                        first: '',
                        second: '',
                        third: ''
                    },
                    scratchings: []
                },
                {
                    number: 8,
                    placings: {
                        first: '',
                        second: '',
                        third: ''
                    },
                    scratchings: []
                },
                {
                    number: 9,
                    placings: {
                        first: '',
                        second: '',
                        third: ''
                    },
                    scratchings: []
                },
                {
                    number: 10,
                    placings: {
                        first: '',
                        second: '',
                        third: ''
                    },
                    scratchings: []
                }
            ]
        }
    }

    /* Determines whether React should re-render the component, in this case if the new props are different from the old props,
       or if the new state is different from the current state */
    shouldComponentUpdate(nextProps, nextState) {
        return !((nextProps === this.props) && (nextState === this.state));
    }
    
    /* Runs when the component first mounts and calls setStateData with the passed race meet and selected meet props */
    componentDidMount() {
        this.setStateData(this.props.raceMeets, this.props.selectedMeet);
    }

    /* Runs when the component receives new props, but before it renders, and calls setStateData with the next props race meet 
       and selected meet */
    componentWillReceiveProps(nextProps) {
        this.setStateData(nextProps.raceMeets, nextProps.selectedMeet);
    }

    /* Takes the passed race meets and selected meet and updates the state */
    setStateData = (propsRaceMeets, propsSelectedMeet) => {
        let races = this.state.races,
            meet = propsRaceMeets.find(meet => { return meet.meetId === propsSelectedMeet });

        for (let i = 0; i < meet.races.length; i++) {
            races[i].placings = meet.races[i].placings;
            races[i].scratchings = meet.races[i].scratchings;
        }

        this.setState({
            races: races
        });
    }

    /* When the user enters a value in one of the placing fields, update it in the state */
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
    
    /* When the user clicks a Save button, pass the modified placings to the onPlacingsChange function
       passed in via props from App.js */
    handleSaveClick = event => {
        let modifiedRace = event.target.getAttribute('data-race'),
            placings = this.state.races[modifiedRace - 1].placings;
        this.props.onPlacingsChange(modifiedRace, placings);
    }

    /* When the user selects a scratching, add or remove it from the state and pass the modified scratchings to the
       onScratchingChange function passed in via props from App.js */
    handleScratchingClick = event => {
        let races = this.state.races,
            modifiedRace = parseInt(event.target.getAttribute('data-race'), 10),
            modifiedScratchings = races[modifiedRace - 1].scratchings;

        // If the selection is already selected, remove it, else add it
        if (event.target.classList.contains('scratched')) {
            let index = modifiedScratchings.indexOf(parseInt(event.target.innerText, 10));
            if (index > -1) { modifiedScratchings.splice(index, 1); }
            races[modifiedRace - 1].scratchings = modifiedScratchings;
            this.setState({
                races: races
            });
            this.props.onScratchingChange(modifiedRace, modifiedScratchings);
        }
        else {
            modifiedScratchings.push(parseInt(event.target.innerText, 10));
            races[modifiedRace - 1].scratchings = modifiedScratchings;
            this.setState({
                races: races
            });
            this.props.onScratchingChange(modifiedRace, modifiedScratchings);
        }
    }

    /* Function to render the component */
    render() {
        let meet = this.props.raceMeets.find(meet => { return meet.meetId === this.props.selectedMeet }),
            raceList = [],
            selections = [],
            className;

        // For each race in the selected meet
        for (let i = 0; i < meet.races.length; i++) {
            selections = [];

            // Generate 24 selections for the scratchings
            for (let j = 0; j < 24; j++) {
                className = 'selection';
                if (this.state.races[i].scratchings.includes(j + 1)) { className += ' scratched'; }
                
                selections.push(<div key={j} className={className} data-race={(i + 1)} onClick={this.handleScratchingClick}>{j + 1}</div>);
            }

            // Create the HTML for each race and insert into the raceList array
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
                                type="button" data-meet={meet.meetId} data-race={(i + 1)} data-status="Not Run Yet" onClick={this.props.onStatusChange}>Not Run Yet</button>
                        <button className={(meet.races[i].status === 'About To Jump') ? 'btn status-selector-btn selected' : 'btn status-selector-btn'}
                                type="button" data-meet={meet.meetId} data-race={(i + 1)} data-status="About To Jump" onClick={this.props.onStatusChange}>About To Jump</button>
                        <button className={(meet.races[i].status === 'Racing') ? 'btn status-selector-btn selected' : 'btn status-selector-btn'}
                                type="button" data-meet={meet.meetId} data-race={(i + 1)} data-status="Racing" onClick={this.props.onStatusChange}>Racing</button>
                        <button className={(meet.races[i].status === 'Has Run') ? 'btn status-selector-btn selected' : 'btn status-selector-btn'}
                                type="button" data-meet={meet.meetId} data-race={(i + 1)} data-status="Has Run" onClick={this.props.onStatusChange}>Has Run</button>
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
                <Header page="Administration" path={this.props.path} punters={this.props.punters} user={this.props.user} onReloadData={this.props.onReloadData} isAdmin={this.props.isAdmin} text="This is the Administration page used to set placings and race statuses.  In the future you will also be able to set scratchings." />
                <RaceMeetSelector meets={this.props.raceMeets} selectedMeetId={this.props.selectedMeet} onChange={this.props.onMeetChange} />
                <div className="adminRaceList">
                    {raceList}
                </div>
                <Menu path={this.props.path}></Menu>
            </div>
        );
    }
}