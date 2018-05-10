import React, { Component } from 'react';
import Header from '../components/Header';
import Podium from '../components/Podium';
import Menu from '../components/Menu';

export default class Leaderboard extends Component {
    /* Determines whether React should re-render the component, in this case if the new props are different from the old props */
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props);
    }

    /* Find the particular meet from the tips data */
    findMeet = thisMeetIndex => {
        return this.props.tips.find(tipsMeet => {
            return (
                tipsMeet.meetId === this.props.raceMeets[thisMeetIndex].meetId
            );
        });
    };

    /* Find the particular race from the tips data  */
    findRace = (tipMeet, thisMeetIndex, thisRaceIndex) => {
        return tipMeet.races.find(tipsRace => {
            return (
                tipsRace.number ===
                this.props.raceMeets[thisMeetIndex].races[thisRaceIndex].number
            );
        });
    };

    /* Find the particular punter from the punters data */
    findPunter = punterId => {
        return this.props.punters.find(punter => {
            return punter._id === punterId;
        });
    };

    /* Get the particular punters data from the points array */
    findPuntersPoints = (points, punterId) => {
        return points.find(punter => {
            return punter.punterId === punterId;
        });
    };

    /* Function to calculate each users points, trifectas, quinellas, firsts, seconds and thirds */
    calculatePoints = () => {
        let points = [],
            a = this.props.punters.length,
            b = this.props.raceMeets.length,
            c,
            d,
            placings,
            tipMeet,
            tips,
            puntersPoints,
            raceScore;

        // Load each punter into the points array with a score of 0
        while (a--) {
            points.push({
                punterId: this.props.punters[a]._id,
                points: 0,
                trifectas: 0,
                quinellas: 0,
                firsts: 0,
                seconds: 0,
                thirds: 0
            });
        }

        // For each meet
        while (b--) {
            c = this.props.raceMeets[b].races.length;
            // For each race in meet
            while (c--) {
                // Set placings to the placings for this race
                placings = this.props.raceMeets[b].races[c].placings;
                // Find race meet in tips, and then get the associated tips
                tipMeet = this.findMeet(b);
                tips = this.findRace(tipMeet, b, c);
                d = tips.punters.length;
                // For each punters tips
                while (d--) {
                    raceScore = 0;
                    puntersPoints = this.findPuntersPoints(
                        points,
                        tips.punters[d].punterId
                    );
                    if (tips.punters[d].tips.includes(placings.first)) {
                        puntersPoints.points += 3;
                        raceScore += 3;
                        puntersPoints.firsts++;
                    }
                    if (tips.punters[d].tips.includes(placings.second)) {
                        puntersPoints.points += 2;
                        raceScore += 2;
                        puntersPoints.seconds++;
                    }
                    if (tips.punters[d].tips.includes(placings.third)) {
                        puntersPoints.points += 1;
                        raceScore += 1;
                        puntersPoints.thirds++;
                    }
                    if (raceScore === 6) {
                        puntersPoints.trifectas++;
                    }
                    if (raceScore === 5) {
                        puntersPoints.quinellas++;
                    }
                }
            }
        }

        return points;
    };

    /* Function to render the component */
    render() {
        let points = this.calculatePoints(),
            oddsList = [],
            loserList = [],
            firstThree,
            topOdds,
            bottomOdds,
            first,
            second,
            third,
            punter,
            position;

        // Set '1, 2, 3', Top Odds and Bottom Odds
        firstThree = this.findPunter(points[2].punterId);
        topOdds = this.findPunter(points[1].punterId);
        bottomOdds = this.findPunter(points[0].punterId);

        // Populate the oddsList array
        oddsList.push(
            <div key="a" className="total">
                <img
                    src={'pics/' + firstThree.pic}
                    alt="Profile pic"
                    className="pic"
                />
                <div className="name">
                    {firstThree.name.first} {firstThree.name.last}
                </div>
                <div className="points">{points[2].points} PTS</div>
            </div>
        );
        oddsList.push(
            <div key="b" className="total">
                <img
                    src={'pics/' + topOdds.pic}
                    alt="Profile pic"
                    className="pic"
                />
                <div className="name">
                    {topOdds.name.first} {topOdds.name.last}
                </div>
                <div className="points">{points[1].points} PTS</div>
            </div>
        );
        oddsList.push(
            <div key="c" className="total">
                <img
                    src={'pics/' + bottomOdds.pic}
                    alt="Profile pic"
                    className="pic"
                />
                <div className="name">
                    {bottomOdds.name.first} {bottomOdds.name.last}
                </div>
                <div className="points">{points[0].points} PTS</div>
            </div>
        );

        // Remove odds totals from the points
        points.shift();
        points.shift();
        points.shift();

        // Sort points in descending order by total points, then trifectas, then quinellas, then first places, then second places
        points.sort((a, b) => {
            return (
                b.points - a.points ||
                b.trifectas - a.trifectas ||
                b.quinellas - a.quinellas ||
                b.firsts - a.firsts ||
                b.seconds - a.seconds
            );
        });

        // Set winners
        first = this.findPunter(points[0].punterId);
        second = this.findPunter(points[1].punterId);
        third = this.findPunter(points[2].punterId);

        // Generate list of losers
        for (let i = 0; i < points.length; i++) {
            // If not the winners
            if (i !== 0 && i !== 1 && i !== 2) {
                // Get the punter details
                punter = this.findPunter(points[i].punterId);

                // Get positon ending name (adding 1 to index to account for array starting from 0)
                if (i + 1 !== 11 && (i + 1) % 10 === 1) {
                    position = '<sup>ST</sup>';
                } else if (i + 1 !== 12 && (i + 1) % 10 === 2) {
                    position = '<sup>ND</sup>';
                } else if (i + 1 !== 13 && (i + 1) % 10 === 3) {
                    position = '<sup>RD</sup>';
                } else {
                    position = '<sup>TH</sup>';
                }

                // Add them to the losers array
                loserList.push(
                    <div key={i} className="loser">
                        <span
                            className="number"
                            dangerouslySetInnerHTML={{
                                __html: i + 1 + position
                            }}
                        />
                        <span className="points">{points[i].points} PTS</span>
                        <img
                            src={'pics/' + punter.pic}
                            alt="Profile pic"
                            className="pic"
                        />
                        <span className="name">
                            {punter.name.first} {punter.name.last}
                        </span>
                    </div>
                );
            }
        }

        return (
            <div className="app">
                <Header
                    page="Leaderboard"
                    path={this.props.path}
                    punters={this.props.punters}
                    user={this.props.user}
                    onReloadData={this.props.onReloadData}
                    isAdmin={this.props.isAdmin}
                    text="To the victors go the spoils, and to the losers....go home."
                />
                <h4 className="lb-heading">GAME ACCOUNTS</h4>
                <div className="odds-totals">{oddsList}</div>
                <Podium
                    first={first}
                    second={second}
                    third={third}
                    points={points}
                />
                <h4 className="lb-heading">BEST OF THE REST</h4>
                {loserList}
                <Menu path={this.props.path} />
            </div>
        );
    }
}
