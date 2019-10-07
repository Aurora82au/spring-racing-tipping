import React, { Component } from 'react';

export default class TipsRaceList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tips: [
                { raceId: null, number: 1, databaseId: null, selections: [] },
                { raceId: null, number: 2, databaseId: null, selections: [] },
                { raceId: null, number: 3, databaseId: null, selections: [] },
                { raceId: null, number: 4, databaseId: null, selections: [] },
                { raceId: null, number: 5, databaseId: null, selections: [] },
                { raceId: null, number: 6, databaseId: null, selections: [] },
                { raceId: null, number: 7, databaseId: null, selections: [] },
                { raceId: null, number: 8, databaseId: null, selections: [] },
                { raceId: null, number: 9, databaseId: null, selections: [] },
                { raceId: null, number: 10, databaseId: null, selections: [] }
            ]
        };
    }

    /* Determines whether React should re-render the component, in this case if the new props are different from the old props,
       or if the new state is different from the current state */
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props && nextState === this.state);
    }

    /* When the component mounts, call setTips and pass it the props */
    componentDidMount() {
        this.setTips(this.props);
    }

    /* When the component is updating and is receiving the new props, call setTips passing it the new props */
    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            this.setTips(this.props);
        }
    }

    /* Function to take the passed props and set the currently selected tips */
    setTips = passedProps => {
        const noOfRaces = passedProps.races.length;
        let tips = this.state.tips;
        let count = 0;

        // Set the current users tips for each race of the chosen race meet
        for (let i = 0, l = passedProps.tips.length; i < l; i++) {
            if (count === noOfRaces) {
                break;
            }
            if (passedProps.tips[i].punterId === passedProps.user._id) {
                for (let j = 0; j < noOfRaces; j++) {
                    if (passedProps.races[j]._id === passedProps.tips[i].raceId) {
                        tips[passedProps.races[j].number - 1] = {
                            raceId: passedProps.races[j]._id,
                            number: passedProps.races[j].number,
                            databaseId: passedProps.tips[i]._id,
                            selections: passedProps.tips[i].selections
                        };
                        break;
                    }
                }
                count++;
            }
        }

        this.setState({
            tips: tips
        });
    };

    /* When the user selects a number, either add or remove it from the local state and pass it to the onSelectionChange function
       passed in via props from App.js */
    handleSelectionClick = event => {
        const tips = this.state.tips;
        const modifiedRace = parseInt(event.target.getAttribute('data-race-no'), 10);
        const tip = tips.find(tip => {
            return tip.number === modifiedRace;
        });
        let index = tips.indexOf(tip);

        // If the selection is already selected, remove it, else if there is less than 3 selected add it
        if (event.target.classList.contains('selected')) {
            index = tip.selections.indexOf(parseInt(event.target.innerText));
            if (index > -1) {
                tip.selections.splice(index, 1);
            }
            this.setState({
                tips: tips
            });
            this.props.onSelectionChange(tip);
        } else if (tip.selections.length < 3) {
            tip.selections.push(parseInt(event.target.innerText));
            tips[index] = tip;
            this.setState({
                tips: tips
            });
            this.props.onSelectionChange(tip);
        }
    };

    /* Generate the HTML for the tips for each race */
    generateList = () => {
        let races = [];
        let selections = [];
        let className;

        // For each race in the selected meet
        for (let i = 0, l = this.props.races.length; i < l; i++) {
            // Clear selections for each race
            selections = [];

            // Generate 24 selections for the tips
            for (let j = 0; j < 24; j++) {
                className = 'selection';
                if (this.props.races[i].scratchings.includes(j + 1)) {
                    className += ' scratched';
                }
                if (this.state.tips[i].selections.includes(j + 1)) {
                    className += ' selected';
                }

                selections.push(
                    <div key={j} className={className} data-race-no={i + 1} onClick={this.handleSelectionClick}>
                        {j + 1}
                    </div>
                );
            }

            // Create the HTML for each race and insert into the races array
            races.push(
                <div key={i} className="tip-group">
                    <div className="details">
                        <div className="bold">RACE {this.props.races[i].number}</div>
                        <span>{this.props.races[i].time}</span>
                        <span className="name">&nbsp;-&nbsp;{this.props.races[i].name}</span>
                    </div>
                    <div className="selections">{selections}</div>
                </div>
            );
        }

        return races;
    };

    /* Function to render the component */
    render() {
        const raceList = this.generateList();
        let raceDay = this.props.meet ? new Date(this.props.meet.date) : new Date();
        let raceListClass;

        // Set the meet to disabled if it is after 10:15am on race day
        raceDay.setHours(10);
        raceDay.setMinutes(15);

        if (new Date() > raceDay) {
            raceListClass = 'raceList disabled';
        } else {
            raceListClass = 'raceList';
        }

        return <div className={raceListClass}>{raceList}</div>;
    }
}
