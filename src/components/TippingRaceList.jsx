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

    componentDidMount() {
        this.setTips(this.props.tips);
    }

    componentWillReceiveProps(nextProps) {
        this.setTips(nextProps.tips);
    }

    setTips = (propsTips) => {
        let self = this,
            tips = this.state.tips,
            tipsRace, userTips;

        // Set the current users tips for each race of the chosen race meet
        for (let i = 0; i < this.props.meet.races.length; i++) {
            tipsRace = propsTips.races.find(race => { return race.number === (i + 1) });
            userTips = tipsRace.punters.find(punter => { 
                return punter.punterId === self.props.user }
            );
            tips[i] = { "race": (i + 1), selections: userTips.tips }
        }

        this.setState({
            tips: tips
        });
    }
    
    handleSelectionClick = event => {
        let tips = this.state.tips,
            tip = tips.find(tip => { return tip.race === parseInt(event.target.getAttribute('data-race'), 10) }),
            index = tips.indexOf(tip);
            
        // If the selection is already selected, remove it, else if there is less than 3 selected add it
        if (event.target.classList.contains('selected')) {
            let index = tip.selections.indexOf(event.target.innerText);
            if (index > -1) { tip.selections.splice(index, 1); }
            this.setState({
                tips: tips
            });
            this.props.onSelectionChange(this.state.tips);
        }
        else if (tip.selections.length < 3) {
            tip.selections.push(event.target.innerText);
            tips[index] = tip;
            this.setState({
                tips: tips
            });
            this.props.onSelectionChange(this.state.tips);
        }
    }

    generateList = () => {
        let races = [],
            selections = [];
            
        for (let i = 0; i < this.props.meet.races.length; i++) {
            // Clear selections for each race
            selections = [];

            for (let j = 0; j < 24; j++) {
                if (this.state.tips[i].selections.includes((j + 1).toString())) {
                    selections.push(<div key={j} className="selection selected" data-race={(i + 1)} onClick={this.handleSelectionClick}>{j + 1}</div>);
                }
                else {
                    selections.push(<div key={j} className="selection" data-race={(i + 1)} onClick={this.handleSelectionClick}>{j + 1}</div>);
                }
            }

            races.push(
                <div key={i} className="tip-group">
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
        let raceList = this.generateList(),
            raceDay = new Date(this.props.meet.date),
            raceListClass;

        raceDay.setHours(10);
        raceDay.setMinutes(15);

        // Set the meet to disabled if it is after 10:15am on race day
        if (new Date() > raceDay) {
            raceListClass = 'raceList disabled';
        }
        else {
            raceListClass = 'raceList';
        }

        return (
            <div className={raceListClass}>
                {raceList}
            </div>
        );
    }
}




// Set the first race to disabled for demo purposes
//tipGroupClass = ((i === 0) && this.props.meet.meetId === 'CAULCUP') ? 'tip-group disabled' : 'tip-group';