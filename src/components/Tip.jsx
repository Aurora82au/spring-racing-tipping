import React, { Component } from 'react';

export default class Tip extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props);
    }
    
    render() {
        let self = this,
            punter = this.props.punters.find(tipPunter => { return tipPunter.punterId === self.props.tips.punterId }),
            punterPic = '/pics/' + punter.pic,
            score = 0,
            firstClass = '',
            secondClass = '',
            thirdClass = '';

        if (self.props.tips.tips.includes(self.props.placings.first)) {
            score += 3;
            firstClass = 'correct';
        }
        if (self.props.tips.tips.includes(self.props.placings.second)) {
            score += 2;
            secondClass = 'correct';
        }
        if (self.props.tips.tips.includes(self.props.placings.third)) {
            score ++;
            thirdClass = 'correct';
        }

        return (
            <div className="tip">
                <img src={punterPic} alt="Profile pic" className="pic" />
                <span className="name">{punter.name.first} {punter.name.last}</span>
                <div className="numbers">
                    <div className="group">
                        <span className="label">Pick 1</span>&nbsp;-&nbsp;
                        <span className={firstClass}>{self.props.tips.tips[0]}</span>
                    </div>
                    <div className="group">
                        <span className="label">Pick 2</span>&nbsp;-&nbsp;
                        <span className={secondClass}>{self.props.tips.tips[1]}</span>
                    </div>
                    <div className="group">
                        <span className="label">Pick 3</span>&nbsp;-&nbsp;
                        <span className={thirdClass}>{self.props.tips.tips[2]}</span>
                    </div>
                </div>
                <div className="score">
                    <div className="mb-5 bold">Score</div>
                    <div>{score}</div>
                </div>
            </div>
        );
    }
}