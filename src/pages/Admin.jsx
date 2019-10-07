import React, { Component } from 'react';
import Header from '../components/Header';
import MeetSelector from '../components/MeetSelector';
import BottomMenu from '../components/BottomMenu';
import Button from '../components/Button';

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
        };
    }

    /* Determines whether React should re-render the component, in this case if the new props are different from the old props,
       or if the new state is different from the current state */
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props && nextState === this.state);
    }

    /* Runs when the component first mounts and calls setStateData with the passed races and selected meet props */
    componentDidMount() {
        this.setStateData(this.props.races, this.props.selectedMeet);
    }

    /* Runs when the component updates and calls setStateData with the new passed races and selected meet props, if they have changed */
    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            this.setStateData(this.props.races, this.props.selectedMeet);
        }
    }

    /* Takes the passed races and selected meet and updates the state */
    setStateData = (propsRaces, propsSelectedMeet) => {
        const stateRaces = this.state.races;
        const meetRaces = propsRaces.filter(race => {
            return race.meetId === propsSelectedMeet;
        });

        for (let i = 0, j = meetRaces.length; i < j; i++) {
            stateRaces[i].placings = meetRaces[i].placings;
            stateRaces[i].scratchings = meetRaces[i].scratchings;
        }

        this.setState({
            races: stateRaces
        });
    };

    /* When the user enters a value in one of the placing fields, update it in the state */
    handlePlacingChange = event => {
        const races = this.state.races;
        const raceChanged = event.target.id.split('-')[1];
        const placingChanged = event.target.id.split('-')[2];
        let placings = races[raceChanged - 1].placings;
        const value = !Number.isNaN(parseInt(event.target.value)) ? parseInt(event.target.value) : 0;

        if (placingChanged === 'first') {
            placings.first = value;
        }
        if (placingChanged === 'second') {
            placings.second = value;
        }
        if (placingChanged === 'third') {
            placings.third = value;
        }

        this.setState({
            races: races
        });
    };

    /* When the user clicks a Save button, pass the modified placings to the onPlacingsChange function
       passed in via props from App.js */
    handleSaveClick = event => {
        const placings = this.state.races[event.target.getAttribute('data-race') - 1].placings;
        this.props.onPlacingsChange(parseInt(event.target.getAttribute('data-race-id')), placings);
    };

    /* When the user selects a scratching, add or remove it from the state and pass the modified scratchings to the
       onScratchingChange function passed in via props from App.js */
    handleScratchingClick = event => {
        const races = this.state.races;
        const modifiedRaceIndex = parseInt(event.target.getAttribute('data-race'), 10) - 1;
        let modifiedScratchings = races[modifiedRaceIndex].scratchings;

        // If the selection is already selected, remove it, else add it
        if (event.target.classList.contains('scratched')) {
            let index = modifiedScratchings.indexOf(parseInt(event.target.innerText, 10));
            if (index > -1) {
                modifiedScratchings.splice(index, 1);
            }
        } else {
            modifiedScratchings.push(parseInt(event.target.innerText, 10));
        }
        races[modifiedRaceIndex].scratchings = modifiedScratchings;
        this.setState({
            races: races
        });
        this.props.onScratchingChange(parseInt(event.target.getAttribute('data-race-id'), 10), modifiedScratchings);
    };

    /* Function to render the component */
    render() {
        const meetRaces = this.props.races.filter(race => {
            return race.meetId === this.props.selectedMeet;
        });
        let raceList = [];
        let selections = [];
        let className;

        // For each race in the selected meet
        for (let i = 0, l = meetRaces.length; i < l; i++) {
            selections = [];

            // Generate 24 selections for the scratchings
            for (let j = 0; j < 24; j++) {
                className = 'selection';
                if (this.state.races[i].scratchings.includes(j + 1)) {
                    className += ' scratched';
                }

                selections.push(
                    <div key={j} className={className} data-race={i + 1} data-race-id={meetRaces[i]._id} onClick={this.handleScratchingClick}>
                        {j + 1}
                    </div>
                );
            }

            // Create the HTML for each race and insert into the raceList array
            raceList.push(
                <div key={i} className="adminRace">
                    <div className="details">
                        <span className="bold">RACE {meetRaces[i].number}</span>
                        <span className="name">&nbsp;-&nbsp;{meetRaces[i].name}</span>
                    </div>
                    <div className="placings">
                        <div>
                            <label htmlFor={'race-' + (i + 1) + '-first'}>1st</label>
                            <input
                                id={'race-' + (i + 1) + '-first'}
                                type="tel"
                                value={this.state.races[i].placings.first !== 0 ? this.state.races[i].placings.first : ''}
                                onChange={this.handlePlacingChange}
                            />
                        </div>
                        <div>
                            <label htmlFor={'race-' + (i + 1) + '-second'}>2nd</label>
                            <input
                                id={'race-' + (i + 1) + '-second'}
                                type="tel"
                                value={this.state.races[i].placings.second !== 0 ? this.state.races[i].placings.second : ''}
                                onChange={this.handlePlacingChange}
                            />
                        </div>
                        <div>
                            <label htmlFor={'race-' + (i + 1) + '-third'}>3rd</label>
                            <input
                                id={'race-' + (i + 1) + '-third'}
                                type="tel"
                                value={this.state.races[i].placings.third !== 0 ? this.state.races[i].placings.third : ''}
                                onChange={this.handlePlacingChange}
                            />
                        </div>
                        <button className="save-btn" type="button" data-race={i + 1} data-race-id={meetRaces[i]._id} onClick={this.handleSaveClick}>
                            Save
                        </button>
                    </div>
                    <div className="mb-10 bold">Set Race Status</div>
                    <div className="status-selector">
                        <Button
                            classes={meetRaces[i].status === 1 ? 'btn status-selector-btn selected' : 'btn status-selector-btn'}
                            type='button'
                            attributes={{
                                'data-meet': this.props.selectedMeet,
                                'data-race': i + 1,
                                'data-race-id': meetRaces[i]._id,
                                'data-status': 1
                            }}
                            onClick={this.props.onStatusChange}
                            text='Not Run Yet'
                             />
                        <Button
                            classes={meetRaces[i].status === 2 ? 'btn status-selector-btn selected' : 'btn status-selector-btn'}
                            type='button'
                            attributes={{
                                'data-meet': this.props.selectedMeet,
                                'data-race': i + 1,
                                'data-race-id': meetRaces[i]._id,
                                'data-status': 2
                            }}
                            onClick={this.props.onStatusChange}
                            text='About To Jump' />
                        <Button
                            classes={meetRaces[i].status === 3 ? 'btn status-selector-btn selected' : 'btn status-selector-btn'}
                            type='button'
                            attributes={{
                                'data-meet': this.props.selectedMeet,
                                'data-race': i + 1,
                                'data-race-id': meetRaces[i]._id,
                                'data-status': 3
                            }}
                            onClick={this.props.onStatusChange}
                            text='Racing' />
                        <Button
                            classes={meetRaces[i].status === 4 ? 'btn status-selector-btn selected' : 'btn status-selector-btn'}
                            type='button'
                            attributes={{
                                'data-meet': this.props.selectedMeet,
                                'data-race': i + 1,
                                'data-race-id': meetRaces[i]._id,
                                'data-status': 4
                            }}
                            onClick={this.props.onStatusChange}
                            text='Has Run' />
                    </div>
                    <div className="scratching-list">
                        <div className="mb-10 bold">Scratchings</div>
                        <div className="selections">{selections}</div>
                    </div>
                </div>
            );
        }

        return (
            <div className="app">
                <Header
                    page="Administration"
                    path={this.props.path}
                    competitions={this.props.competitions}
                    user={this.props.user}
                    selectedCompetition={this.props.selectedCompetition}
                    handleCompetitionSelect={this.props.handleCompetitionSelect}
                    onReloadData={this.props.onReloadData}
                    isAdmin={this.props.isAdmin}
                    text="This is the Administration page used to set placings and race statuses.  In the future you will also be able to set scratchings."
                />
                <MeetSelector meets={this.props.meets} selectedMeetId={this.props.selectedMeet} onChange={this.props.onMeetChange} />
                <div className="adminRaceList">{raceList}</div>
                <BottomMenu path={this.props.path} />
            </div>
        );
    }
}
