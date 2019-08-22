import React, { Component, Fragment } from 'react';
import Header from '../components/Header';
import Menu from '../components/Menu';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabSelected: 1
        };
    }

    /* Determines whether React should re-render the component, in this case if the new props are different from the old props,
       or if the new state is different from the current state */
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props && nextState === this.state);
    }

    /* When the component mounts, set the selected tab in the state based off the selected tab passed via props */
    componentDidMount() {
        if (this.state.tabSelected !== this.props.selectedTab) {
            this.setState({
                tabSelected: this.props.selectedTab
            });
        }
    }

    /* When the user clicks a tab, set it as the selected tab in local state, and pass it to the onTabSelect function in App.js
       passed via props */
    handleTabClick = event => {
        let tab = 1;

        if (event.target.classList.contains('two')) {
            tab = 2;
        }
        this.setState({
            tabSelected: tab
        });
        this.props.onTabSelect(tab);
    };

    /* Find the tips that belong to the associated punter and race */
    findTips = (punterId, raceId) => {
        return this.props.tips.find(tips => {
            return tips.punterId === punterId && tips.raceId === raceId;
        });
    };

    /* Find the particular punter from the punters data */
    findPunter = punterId => {
        return this.props.punters.find(punter => {
            return punter._id === punterId;
        });
    };

    /* Find the current punter's stats from the stats array */
    findPuntersStats = (stats, punterId) => {
        return stats.find(punter => {
            return punter.punterId === punterId;
        });
    };

    /* Find the current race meet from the current punter's stats */
    findPuntersStatsMeet = (puntersStats, meetId) => {
        return puntersStats.meets.find(meet => {
            return meet.meetId === meetId;
        });
    };

    /* Function to calculate each users points, trifectas, quinellas, firsts, seconds and thirds and score for each meet */
    calculateStats = () => {
        let stats = [];
        let meetsArray = [];
        let a = this.props.meets.length;
        let b = this.props.punters.length;
        let c;
        let placings;
        let tips;
        let puntersStats;
        let puntersStatsMeet;
        let raceScore;

        // Create a meets array to hold the score for each meet.  This will be added to each punters stats.
        while (a--) {
            meetsArray.push({
                meetId: this.props.meets[a]._id,
                date: this.props.meets[a].date,
                score: 0
            });
        }

        // Sort the meets array in order of date
        meetsArray.sort((a, b) => {
            const aDate = Date.parse(a.date);
            const bDate = Date.parse(b.date);
            return aDate - bDate;
        });

        // Load each punter into the points array with a score of 0
        while (b--) {
            stats.push({
                punterId: this.props.punters[b]._id,
                trifectas: 0,
                quinellas: 0,
                firsts: 0,
                seconds: 0,
                thirds: 0,
                meets: meetsArray.map(x => ({ ...x })) // Use map and the spread operator to clone the array with cloned values, instead of references
            });
        }

        // Reset the length of the punters after the first while loop
        b = this.props.punters.length;

        // For each punter
        while (b--) {
            // Reset the length of the races
            c = this.props.races.length;
            // Loop through each race
            while (c--) {
                // Set placings to the placings for this race
                placings = this.props.races[c].placings;
                // Find the associated tips for this user and race
                tips = this.findTips(this.props.punters[b]._id, this.props.races[c]._id);
                // Reset the race score
                raceScore = 0;
                // Get the current punter's stats from the stats array
                puntersStats = this.findPuntersStats(stats, this.props.punters[b]._id);
                // Get the current race meet from the current punter's stats
                puntersStatsMeet = this.findPuntersStatsMeet(puntersStats, this.props.races[c].meetId);

                // Update the stats of that punter
                if (tips.selections.includes(placings.first)) {
                    puntersStats.firsts++;
                    raceScore += 3;
                }
                if (tips.selections.includes(placings.second)) {
                    puntersStats.seconds++;
                    raceScore += 2;
                }
                if (tips.selections.includes(placings.third)) {
                    puntersStats.thirds++;
                    raceScore += 1;
                }
                if (raceScore === 6) {
                    puntersStats.trifectas++;
                }
                if (raceScore === 5) {
                    puntersStats.quinellas++;
                }
                // Add the race score to this meets score
                puntersStatsMeet.score += raceScore;
            }
        }

        return stats;
    };

    /* Function create the stat item HTML for each punter and adding to the arrayToUpdate */
    createStatArray = (dataArray, arrayToUpdate, isMeets) => {
        let tempArray = [];
        let trifectaArray = [];
        let quinellaArray = [];
        let firstArray = [];
        let secondArray = [];
        let thirdArray = [];
        let count = 0;
        let punter;
        let position;
        let name;

        if (isMeets) {
            // For each meet
            for (let i = 0, l = dataArray.length; i < l; i++) {
                // Sort by scores
                dataArray[i].scores.sort((a, b) => {
                    return b.score - a.score;
                });

                // For each score in the meet
                for (let j = 0, len = dataArray[i].scores.length; j < len; j++) {
                    // Get the current punters details
                    punter = this.findPunter(dataArray[i].scores[j].punterId);

                    // Get positon ending name (adding 1 to index to account for array starting from 0)
                    if (j + 1 !== 11 && (j + 1) % 10 === 1) {
                        position = '<sup>ST</sup>';
                    } else if (j + 1 !== 12 && (j + 1) % 10 === 2) {
                        position = '<sup>ND</sup>';
                    } else if (j + 1 !== 13 && (j + 1) % 10 === 3) {
                        position = '<sup>RD</sup>';
                    } else {
                        position = '<sup>TH</sup>';
                    }

                    // Create the stat item and add to the temporary array
                    tempArray.push(
                        <div key={j} className="stat-item">
                            <div className="number" dangerouslySetInnerHTML={{ __html: j + 1 + position }} />
                            <img src={'pics/' + punter.image} alt="Profile pic" className="pic" />
                            <div className="name">{punter.name.first}</div>
                            <div className="stat">{dataArray[i].scores[j].score}</div>
                        </div>
                    );
                }

                // Add the scores for this meet to the passed array to update
                arrayToUpdate.push(
                    <Fragment key={i}>
                        <hr />
                        <div className="bold mt-20 mb-10">{dataArray[i].name}</div>
                        <div className="stat-container">{tempArray}</div>
                    </Fragment>
                );

                // Reset the temporary array
                tempArray = [];
            }
        } else {
            while (count < 5) {
                // Set the correct array and sort by the correct stat
                if (count === 0) {
                    tempArray = trifectaArray;
                    name = 'trifectas';
                    dataArray.sort((a, b) => {
                        return b.trifectas - a.trifectas;
                    });
                } else if (count === 1) {
                    tempArray = quinellaArray;
                    name = 'quinellas';
                    dataArray.sort((a, b) => {
                        return b.quinellas - a.quinellas;
                    });
                } else if (count === 2) {
                    tempArray = firstArray;
                    name = 'firsts';
                    dataArray.sort((a, b) => {
                        return b.firsts - a.firsts;
                    });
                } else if (count === 3) {
                    tempArray = secondArray;
                    name = 'seconds';
                    dataArray.sort((a, b) => {
                        return b.seconds - a.seconds;
                    });
                } else {
                    tempArray = thirdArray;
                    name = 'thirds';
                    dataArray.sort((a, b) => {
                        return b.thirds - a.thirds;
                    });
                }

                for (let i = 0, l = dataArray.length; i < l; i++) {
                    // Get the current punters details
                    punter = this.findPunter(dataArray[i].punterId);

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

                    // Create the stat item and add to the temporary array
                    tempArray.push(
                        <div key={`${count}${i}`} className="stat-item">
                            <div className="number" dangerouslySetInnerHTML={{ __html: i + 1 + position }} />
                            <img src={'pics/' + punter.image} alt="Profile pic" className="pic" />
                            <div className="name">{punter.name.first}</div>
                            <div className="stat">{dataArray[i][name]}</div>
                        </div>
                    );
                }
                count++;
            }

            // Add the scores for the stats to the passed array to update
            arrayToUpdate.push(
                <Fragment key="a">
                    <div className="bold mt-20 mb-10">Trifectas</div>
                    <div className="stat-container">{trifectaArray}</div>
                    <hr />
                    <div className="bold mt-20 mb-10">Quinellas</div>
                    <div className="stat-container">{quinellaArray}</div>
                    <hr />
                    <div className="bold mt-20 mb-10">Firsts</div>
                    <div className="stat-container">{firstArray}</div>
                    <hr />
                    <div className="bold mt-20 mb-10">Seconds</div>
                    <div className="stat-container">{secondArray}</div>
                    <hr />
                    <div className="bold mt-20 mb-10">Thirds</div>
                    <div className="stat-container">{thirdArray}</div>
                </Fragment>
            );
        }
    };

    /* Function to render the component */
    render() {
        const stats = this.calculateStats();
        let meetArray = [];
        let arrayMeet;
        let meetScoresHTML = [];
        let otherScoresHTML = [];
        let tabBtn1Class;
        let tabBtn2Class;
        let tab1Class;
        let tab2Class;

        // Set the tab status and hide/show the tabs
        if (this.state.tabSelected === 1) {
            tabBtn1Class = 'btn tab-btn one selected';
            tabBtn2Class = 'btn tab-btn two';
            tab1Class = 'tab-panel';
            tab2Class = 'tab-panel hide';
        } else {
            tabBtn1Class = 'btn tab-btn one';
            tabBtn2Class = 'btn tab-btn two selected';
            tab1Class = 'tab-panel hide';
            tab2Class = 'tab-panel';
        }

        // Populate the meet array with each meet
        for (let i = 0, l = this.props.meets.length; i < l; i++) {
            meetArray.push({
                meetId: this.props.meets[i]._id,
                name: this.props.meets[i].name,
                scores: []
            });
        }

        // Populate each of the temporary meet arrays with each punters score for that meet
        for (let i = 0, l = stats.length; i < l; i++) {
            for (let j = 0, len = stats[i].meets.length; j < len; j++) {
                arrayMeet = meetArray.find(meet => {
                    return meet.meetId === stats[i].meets[j].meetId;
                });
                arrayMeet.scores.push({ punterId: stats[i].punterId, score: stats[i].meets[j].score });
            }
        }

        // Create an array of the scores for each meet
        this.createStatArray(meetArray, meetScoresHTML, true);

        // Create an array of the scores for trifectas, quinellas, first, seconds and thirds
        this.createStatArray(stats, otherScoresHTML, false);

        return (
            <div className="app">
                <Header
                    page="Statistics"
                    path={this.props.path}
                    punters={this.props.punters}
                    user={this.props.user}
                    selectedCompetition={this.props.selectedCompetition}
                    onReloadData={this.props.onReloadData}
                    isAdmin={this.props.isAdmin}
                    text="Here you can find various statistics, such as the placings for each race meet, number of trifectas, quinellas, 1sts, 2nds, 3rds, etc."
                />
                <div className="tab-btns">
                    <button className={tabBtn1Class} onClick={this.handleTabClick}>
                        Meet Scores
                    </button>
                    <button className={tabBtn2Class} onClick={this.handleTabClick}>
                        Other
                    </button>
                </div>
                <div className={tab1Class}>{meetScoresHTML}</div>
                <div className={tab2Class}>{otherScoresHTML}</div>
                <Menu path={this.props.path} />
            </div>
        );
    }
}
