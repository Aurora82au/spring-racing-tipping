import React, { Component } from 'react';

export default class ResultsTip extends Component {
    /* Determines whether React should re-render the component, in this case if the new props are different from the old props */
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props);
    }

    /* Function to render the component */
    render() {
        const self = this;
        const punter = this.props.punters.find(tipPunter => {
            return tipPunter._id === self.props.tips.punterId;
        });
        let score = 0;
        let index;
        let firstClass = '';
        let secondClass = '';
        let thirdClass = '';

        // Set the scores and the 'correct' class on punters picks
        index = self.props.tips.selections.indexOf(self.props.placings.first);
        if (index > -1) {
            score += 3;
            if (index === 0) {
                firstClass = 'correct';
            }
            if (index === 1) {
                secondClass = 'correct';
            }
            if (index === 2) {
                thirdClass = 'correct';
            }
        }

        index = self.props.tips.selections.indexOf(self.props.placings.second);
        if (index > -1) {
            score += 2;
            if (index === 0) {
                firstClass = 'correct';
            }
            if (index === 1) {
                secondClass = 'correct';
            }
            if (index === 2) {
                thirdClass = 'correct';
            }
        }

        index = self.props.tips.selections.indexOf(self.props.placings.third);
        if (index > -1) {
            score++;
            if (index === 0) {
                firstClass = 'correct';
            }
            if (index === 1) {
                secondClass = 'correct';
            }
            if (index === 2) {
                thirdClass = 'correct';
            }
        }

        return (
            <div className="tip">
                <img src={'pics/' + punter.image} alt="Profile pic" className="pic" />
                <span className="name">
                    {punter.name.first} {punter.name.last}
                </span>
                <div className="numbers">
                    <div className="group">
                        <span className="label">Pick 1</span>&nbsp;-&nbsp;
                        <span className={firstClass}>{self.props.tips.selections[0]}</span>
                    </div>
                    <div className="group">
                        <span className="label">Pick 2</span>&nbsp;-&nbsp;
                        <span className={secondClass}>{self.props.tips.selections[1]}</span>
                    </div>
                    <div className="group">
                        <span className="label">Pick 3</span>&nbsp;-&nbsp;
                        <span className={thirdClass}>{self.props.tips.selections[2]}</span>
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
