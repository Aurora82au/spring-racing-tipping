import React, { Component } from 'react';

export default class Tip extends Component {
    render() {
        let self = this,
            punter = this.props.punters.find(tipPunter => { return tipPunter.punterId === self.props.tips.punterId }),
            punterPic = '/pics/' + punter.pic,
            firstClass = '',
            secondClass = 'correct',
            thirdClass = '';

        return (
            <div className="tip">
                <img src={punterPic} alt="Profile pic" className="pic" />
                <span className="name">{punter.name.display}</span>
                <div className="numbers">
                    <div className="group">
                        <span className="label">1st</span>&nbsp;-&nbsp;
                        <span className={firstClass}>{self.props.tips.tips.first}</span>
                    </div>
                    <div className="group">
                        <span className="label">2nd</span>&nbsp;-&nbsp;
                        <span className={secondClass}>{self.props.tips.tips.second}</span>
                    </div>
                    <div className="group">
                        <span className="label">3rd</span>&nbsp;-&nbsp;
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