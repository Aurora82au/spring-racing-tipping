import React, { Component } from 'react';

export default class Tip extends Component {
    render() {
        let self = this,
            punter = this.props.punters.find(tipPunter => { return tipPunter.punterId === self.props.tips.punterId }),
            punterPic = '/pics/' + punter.pic,
            firstClass = (self.props.tips.tips.first === self.props.placings.first) ? 'correct' : '',
            secondClass = (self.props.tips.tips.second === self.props.placings.second) ? 'correct' : '',
            thirdClass = (self.props.tips.tips.third === self.props.placings.third) ? 'correct' : '';

        return (
            <div className="tip">
                <img src={punterPic} alt="Profile pic" className="pic" />
                <span className="name">{punter.name.first} {punter.name.last}</span>
                <div className="numbers">
                    <div className="group">
                        <span className="label">Pick 1</span>&nbsp;-&nbsp;
                        <span className={firstClass}>{self.props.tips.tips.first}</span>
                    </div>
                    <div className="group">
                        <span className="label">Pick 2</span>&nbsp;-&nbsp;
                        <span className={secondClass}>{self.props.tips.tips.second}</span>
                    </div>
                    <div className="group">
                        <span className="label">Pick 3</span>&nbsp;-&nbsp;
                        <span className={thirdClass}>{self.props.tips.tips.third}</span>
                    </div>
                </div>
                <div className="score">
                    <div className="mb-5 bold">Score</div>
                    <div>3</div>
                </div>
            </div>
        );
    }
}