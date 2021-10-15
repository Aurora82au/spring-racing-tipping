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
        const meet = this.props.meets.find(meet => {
            return meet._id === this.props.selectedMeetId;
        });
        let raceDay = meet ? new Date(meet.date) : new Date();
        let isAfterCutoff = false;
        let score = 0;
        let firstPickClass = '';
        let secondPickClass = '';
        let thirdPickClass = '';
        let perfectClass = '';
        let index, pick1, pick2, pick3;

        raceDay.setHours(10);
        raceDay.setMinutes(15);

        // Check if it is after the tip cutoff time, and set variable to use for showing/hiding tips.
        if (new Date() > raceDay) {
            isAfterCutoff = true;
        }

        // If it is the current users tips, or it is after the cut off time, display the actual tips, else hide them.
        if (punter === self.props.user || isAfterCutoff) {
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

            // Set the picks to the punters selections.
            pick1 = self.props.tips.selections[0];
            pick2 = self.props.tips.selections[1];
            pick3 = self.props.tips.selections[2];

            // If it is a perfect score (greater than 6, allowing for dead heats with 1st or 2nd) then add a class to the score for a celebration animation.
            if (score >= 6) { perfectClass = 'perfect animate'; }
        }
        else {
            // Mask the picks with a question mark.  Only show if there is a value for that pick, so we can still see missing tips.
            pick1 = self.props.tips.selections[0] ? <span className="question-mark">?</span> : '';
            pick2 = self.props.tips.selections[1] ? <span className="question-mark">?</span> : '';
            pick3 = self.props.tips.selections[2] ? <span className="question-mark">?</span> : '';
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
                        <span className={firstPickClass}>{pick1}</span>
                    </div>
                    <div className="group">
                        <span className="label">Pick 2</span>&nbsp;-&nbsp;
                        <span className={secondPickClass}>{pick2}</span>
                    </div>
                    <div className="group">
                        <span className="label">Pick 3</span>&nbsp;-&nbsp;
                        <span className={thirdPickClass}>{pick3}</span>
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
