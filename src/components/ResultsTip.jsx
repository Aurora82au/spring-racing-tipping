import React, { Component } from 'react';

export default class ResultsTip extends Component {
    /* Determines whether React should re-render the component, in this case if the new props are different from the old props. */
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props);
    }

    /* Function to render the component. */
    render() {
        const self = this;
        const punter = this.props.punters.find(tipPunter => {
            return tipPunter._id === self.props.tips.punterId;
        });
        let score = 0;
        let index;
        let firstPickClass = '';
        let secondPickClass = '';
        let thirdPickClass = '';
        let perfectClass = '';

        // Set the 'correct' class on punters picks.
        const setPickClass = i => {
            if (i === 0) {
                firstPickClass = 'correct';
            }
            if (i === 1) {
                secondPickClass = 'correct';
            }
            if (i === 2) {
                thirdPickClass = 'correct';
            }
        }

        // Set the scores for first place.
        if (self.props.placings.first.constructor === Array) {
            for (let i = 0, l = self.props.placings.first.length; i < l; i++) {
                index = self.props.tips.selections.indexOf(self.props.placings.first[i]);
                if (index > -1) {
                    score += 3;
                    setPickClass(index);
                }
            }
        }
        else {
            index = self.props.tips.selections.indexOf(self.props.placings.first);
            if (index > -1) {
                score += 3;
                setPickClass(index);
            }
        }

        // Set the scores for second place.
        if (self.props.placings.second.constructor === Array) {
            for (let i = 0, l = self.props.placings.second.length; i < l; i++) {
                index = self.props.tips.selections.indexOf(self.props.placings.second[i]);
                if (index > -1) {
                    score += 2;
                    setPickClass(index);
                }
            }
        }
        else {
            index = self.props.tips.selections.indexOf(self.props.placings.second);
            if (index > -1) {
                score += 2;
                setPickClass(index);
            }
        }

        // Set the scores for third place.
        if (self.props.placings.third.constructor === Array) {
            for (let i = 0, l = self.props.placings.third.length; i < l; i++) {
                index = self.props.tips.selections.indexOf(self.props.placings.third[i]);
                if (index > -1) {
                    score++;
                    setPickClass(index);
                }
            }
        }
        else {
            index = self.props.tips.selections.indexOf(self.props.placings.third);
            if (index > -1) {
                score++;
                setPickClass(index);
            }
        }

        // If it is a perfect score (greater than 6, allowing for dead heats with 1st or 2nd) then add a class to the score for a celebration animation.
        if (score >= 6) { perfectClass = 'perfect animate'; }

        return (
            <div className="tip">
                <img src={'pics/' + punter.image} alt="Profile pic" className="pic" />
                <span className="name">
                    {punter.name.first} {punter.name.last}
                </span>
                <div className="numbers">
                    <div className="group">
                        <span className="label">Pick 1</span>&nbsp;-&nbsp;
                        <span className={firstPickClass}>{self.props.tips.selections[0]}</span>
                    </div>
                    <div className="group">
                        <span className="label">Pick 2</span>&nbsp;-&nbsp;
                        <span className={secondPickClass}>{self.props.tips.selections[1]}</span>
                    </div>
                    <div className="group">
                        <span className="label">Pick 3</span>&nbsp;-&nbsp;
                        <span className={thirdPickClass}>{self.props.tips.selections[2]}</span>
                    </div>
                </div>
                <div className="score">
                    <div className="heading">Score</div>
                    <div className={perfectClass}>{score}</div>
                </div>
            </div>
        );
    }
}
