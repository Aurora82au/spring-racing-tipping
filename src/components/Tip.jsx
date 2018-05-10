import React, { Component } from 'react';

export default class Tip extends Component {
    /* Determines whether React should re-render the component, in this case if the new props are different from the old props */
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props);
    }

    /* Function to render the component */
    render() {
        let self = this,
            punter = this.props.punters.find(tipPunter => {
                return tipPunter._id === self.props.tips.punterId;
            }),
            score = 0,
            index,
            firstClass = '',
            secondClass = '',
            thirdClass = '';

        // Set the scores and the 'correct' class on punters picks
        index = self.props.tips.tips.indexOf(self.props.placings.first);
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

        index = self.props.tips.tips.indexOf(self.props.placings.second);
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

        index = self.props.tips.tips.indexOf(self.props.placings.third);
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
                <img src={'pics/' + punter.pic} alt="Profile pic" className="pic" />
                <span className="name">
                    {punter.name.first} {punter.name.last}
                </span>
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
