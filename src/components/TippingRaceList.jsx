import React, { Component } from 'react';

export default class TippingRaceList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tips: [
                { "race": 1, selections: [] },
                { "race": 2, selections: [] },
                { "race": 3, selections: [] },
                { "race": 4, selections: [] },
                { "race": 5, selections: [] },
                { "race": 6, selections: [] },
                { "race": 7, selections: [] },
                { "race": 8, selections: [] },
                { "race": 9, selections: [] },
                { "race": 10, selections: [] }
            ]
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !((nextProps === this.props) && (nextState === this.state));
    }

    componentWillMount() {
        let tips = this.state.tips,
            meetRace;

        for (let i = 0; i < this.props.meet.races.length; i++) {
            meetRace = this.props.tips.races.find(race => { return race.number === (i + 1) });
            tips[i] = { "race": (i + 1), selections: meetRace.punters[0].tips }
        }

        this.setState({
                tips: tips
            }
        );
    }
    
    handleSelectionClick = event => {
        let tips = this.state.tips,
            tip = tips.find(tip => { return tip.race === parseInt(event.target.getAttribute('data-race'), 10) }),
            index = tips.indexOf(tip);
        tip.selections.pop();
        tip.selections.push(event.target.innerText);
        tips[index] = tip;
        this.setState({
            tips: tips
        });
    }

    generateList = () => {
        let races = [],
        selections = [],
        statusClass, tipGroupClass;

        for (let i = 0; i < this.props.meet.races.length; i++) {
            // Clear selections for each race
            selections = [];

            // Set the first race to disabled for demo purposes
            tipGroupClass = ((i === 0) && this.props.meet.meetId === 'CAULCUP') ? 'tip-group disabled' : 'tip-group';

            // Set the status colour
            switch (this.props.meet.races[i].status) {
                case "Has Run": statusClass = "status green"; break;
                case "About To Jump": statusClass = "status orange"; break;
                case "Racing": statusClass = "status red"; break;
                case "Not Run Yet": statusClass = "status blue"; break;
                default: statusClass = "status"; break;
            }

            //race = this.props.tips.races.find((race) => { return race.number === (i + 1) });

            for (let j = 0; j < 24; j++) {
                if (this.state.tips[i].selections.includes((j + 1).toString())) {
                    selections.push(<div key={j} className="selection test selected" data-race={(i + 1)} onClick={this.handleSelectionClick}>{j + 1}</div>);
                }
                else {
                    selections.push(<div key={j} className="selection test" data-race={(i + 1)} onClick={this.handleSelectionClick}>{j + 1}</div>);
                }
            }

            races.push(
                <div key={i} className={tipGroupClass}>
                    <div className="details">
                        <div className="bold">RACE {this.props.meet.races[i].number}</div>
                        <span>{this.props.meet.races[i].time}</span>
                        <span className="name">&nbsp;-&nbsp;{this.props.meet.races[i].name}</span>
                    </div>
                    <div className="selections">
                        {selections}
                    </div>
                </div>
            );
        }

        return races;
    }

    render() {
        let raceList = this.generateList();

        return (
            <div className="raceList">
                {raceList}
            </div>
        );
    }
}