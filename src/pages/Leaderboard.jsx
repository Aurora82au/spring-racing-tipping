import React, { Component } from 'react';
import Header from '../components/Header';
import Podium from '../components/Podium';
import BottomMenu from '../components/BottomMenu';

export default class Leaderboard extends Component {
    /* Determines whether React should re-render the component, in this case if the new props are different from the old props. */
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props);
    }

    /* Find the tips that belong to the associated punter and race. */
    findTips = (punterId, raceId) => {
        return this.props.tips.find(tips => {
            return tips.punterId === punterId && tips.raceId === raceId;
        });
    };

    /* Find the particular punter from the punters data. */
    findPunter = punterId => {
        return this.props.punters.find(punter => {
            return punter._id === punterId;
        });
    };

    /* Get the particular punters data from the points array. */
    findPuntersPoints = (points, punterId) => {
        return points.find(punter => {
            return punter.punterId === punterId;
        });
    };

    /* Function to calculate each users points, trifectas, quinellas, firsts, seconds and thirds. */
    calculatePoints = () => {
        let points = [];
        let a = this.props.punters.length;
        let b, c, l;
        let placings;
        let tips;
        let puntersPoints;
        let raceScore;
        let firsts = 0;
        let seconds = 0;
        let thirds = 0;

        // Load each punter into the points array with a score of 0.
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

        // Reset the length of the punters after the first while loop.
        a = this.props.punters.length;

        // For each punter.
        while (a--) {
            // Reset the length of the races.
            b = this.props.races.length;
            // Loop through each race.
            while (b--) {
                // Set placings to the placings for this race.
                placings = this.props.races[b].placings;
                // Find the associated tips for this user and race.
                tips = this.findTips(this.props.punters[a]._id, this.props.races[b]._id);

                if (tips) {
                    // Reset the race score, and the number of firsts, seconds and thirds.
                    raceScore = firsts = seconds = thirds = 0;
                    // Get the current punter's points.
                    puntersPoints = this.findPuntersPoints(points, this.props.punters[a]._id);
                    // Set first place points.
                    if (placings.first.constructor === Array) {
                        for (c = 0, l = placings.first.length; c < l; c++) {
                            if (tips.selections.includes(placings.first[c])) {
                                puntersPoints.points += 3;
                                raceScore += 3;
                                puntersPoints.firsts++;
                                firsts++;
                            }
                        }
                    }
                    else {
                        if (tips.selections.includes(placings.first)) {
                            puntersPoints.points += 3;
                            raceScore += 3;
                            puntersPoints.firsts++;
                            firsts++;
                        }
                    }
                    // Set second place points.
                    if (placings.second.constructor === Array) {
                        for (c = 0, l = placings.second.length; c < l; c++) {
                            if (tips.selections.includes(placings.second[c])) {
                                puntersPoints.points += 2;
                                raceScore += 2;
                                puntersPoints.seconds++;
                                seconds++;
                            }
                        }
                    }
                    else {
                        if (tips.selections.includes(placings.second)) {
                            puntersPoints.points += 2;
                            raceScore += 2;
                            puntersPoints.seconds++;
                            seconds++;
                        }
                    }
                    // Set third place points.
                    if (placings.third.constructor === Array) {
                        for (c = 0, l = placings.third.length; c < l; c++) {
                            if (tips.selections.includes(placings.third[c])) {
                                puntersPoints.points += 1;
                                raceScore += 1;
                                puntersPoints.thirds++;
                                thirds++;
                            }
                        }
                    }
                    else {
                        if (tips.selections.includes(placings.third)) {
                            puntersPoints.points += 1;
                            raceScore += 1;
                            puntersPoints.thirds++;
                            thirds++;
                        }
                    }
                    // Set trifectas.
                    if ((firsts === 1 && seconds === 1 && thirds === 1) ||
                        (firsts === 2 && seconds === 1) ||
                        (firsts === 1 && seconds === 2)) {
                        puntersPoints.trifectas++;
                    }
                    // Set quinellas.
                    if ((firsts === 1 && seconds === 1 && thirds === 0) ||
                        (firsts === 2 && seconds === 0)) {
                        puntersPoints.quinellas++;
                    }
                }
            }
        }

        return points;
    };

    /* Function to render the component. */
    render() {
        const points = this.calculatePoints();
        let gameAccounts = [];
        let gameAccountsList = [];
        let loserList = [];
        let first;
        let second;
        let third;
        let punter;
        let position;
        let temp;

        // Set the game accounts.
        for(let i = 0, l = this.props.selectedCompetition.gameAccounts.length; i < l; i++) {
            temp = this.props.punters.find(punter => { return punter._id === this.props.selectedCompetition.gameAccounts[i]; });
            gameAccounts.push(temp);
        }

        // Populate the gameAccountsList array and then remove the game account from the points array.
        let gameAccountPoints;
        for(let i = 0, l = gameAccounts.length; i < l; i++) {
            gameAccountPoints = points.find(points => { return points.punterId === gameAccounts[i]._id; });
            gameAccountsList.push(
                <div key={i} className="total">
                    <img src={'pics/' + gameAccounts[i].image} alt="Profile pic" className="pic" />
                    <div className="name">
                        {gameAccounts[i].name.first} {gameAccounts[i].name.last}
                    </div>
                    <div className="points">{gameAccountPoints.points} PTS</div>
                </div>
            );
            points.splice(points.indexOf(gameAccountPoints), 1);
        }

        // Sort points in descending order by total points, then trifectas, then quinellas, then first places, then second places.
        points.sort((a, b) => {
            return (
                b.points - a.points ||
                b.trifectas - a.trifectas ||
                b.quinellas - a.quinellas ||
                b.firsts - a.firsts ||
                b.seconds - a.seconds
            );
        });

        // Set the winners.
        first = this.findPunter(points[0].punterId);
        second = this.findPunter(points[1].punterId);
        third = this.findPunter(points[2].punterId);

        // Generate list of losers.
        for (let i = 0, l = points.length; i < l; i++) {
            // If not the winners.
            if (i !== 0 && i !== 1 && i !== 2) {
                // Get the punter details.
                punter = this.findPunter(points[i].punterId);

                // Get positon ending name (adding 1 to index to account for array starting from 0).
                if (i + 1 !== 11 && (i + 1) % 10 === 1) {
                    position = '<sup>ST</sup>';
                } else if (i + 1 !== 12 && (i + 1) % 10 === 2) {
                    position = '<sup>ND</sup>';
                } else if (i + 1 !== 13 && (i + 1) % 10 === 3) {
                    position = '<sup>RD</sup>';
                } else {
                    position = '<sup>TH</sup>';
                }

                // Add them to the losers array.
                loserList.push(
                    <div key={i} className="loser">
                        <span
                            className="number"
                            dangerouslySetInnerHTML={{
                                __html: i + 1 + position
                            }}
                        />
                        <span className="points">{points[i].points} PTS</span>
                        <img src={'pics/' + punter.image} alt="Profile pic" className="pic" />
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
                    competitions={this.props.competitions}
                    user={this.props.user}
                    selectedCompetition={this.props.selectedCompetition}
                    handleCompetitionSelect={this.props.handleCompetitionSelect}
                    onReloadData={this.props.onReloadData}
                    isAdmin={this.props.isAdmin}
                    text="To the victors go the spoils, and to the losers....go home."
                />
                {
                    !!gameAccountsList.length &&
                    <>
                        <h4 className="lb-heading">GAME ACCOUNTS</h4>
                        <div className="game-account-totals">{gameAccountsList}</div>
                    </>
                }
                <Podium first={first} second={second} third={third} points={points} />
                <h4 className="lb-heading">BEST OF THE REST</h4>
                {loserList}
                <BottomMenu path={this.props.path} />
            </div>
        );
    }
}
