import React, { Component } from 'react';
import Header from './Header';
import Menu from './Menu';

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
        this.setState({
            tabSelected: this.props.selectedTab
        });
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

    /* Find the particular meet from the tips data */
    findMeet = thisMeetIndex => {
        return this.props.tips.find(tipsMeet => {
            return tipsMeet.meetId === this.props.raceMeets[thisMeetIndex].meetId;
        });
    };

    /* Find the particular race from the tips data  */
    findRace = (tipMeet, thisMeetIndex, thisRaceIndex) => {
        return tipMeet.races.find(tipsRace => {
            return tipsRace.number === this.props.raceMeets[thisMeetIndex].races[thisRaceIndex].number;
        });
    };

    /* Find the particular punter from the punters data */
    findPunter = punterId => {
        return this.props.punters.find(punter => {
            return punter.punterId === punterId;
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
        let stats = [],
            a = this.props.punters.length,
            b = this.props.raceMeets.length,
            meetsArray = [],
            c,
            d,
            placings,
            tipMeet,
            tips,
            puntersStats,
            puntersStatsMeet,
            raceScore;

        // Create a meets array to hold the score for each meet.  This will be added to each punters stats.
        while (b--) {
            meetsArray.push({
                meetId: this.props.raceMeets[b].meetId,
                score: 0
            });
        }

        // Load each punter into the points array with a score of 0
        while (a--) {
            stats.push({
                punterId: this.props.punters[a].punterId,
                trifectas: 0,
                quinellas: 0,
                firsts: 0,
                seconds: 0,
                thirds: 0,
                meets: meetsArray.map(a => ({ ...a })) // Use map and the spread operator to clone the array with cloned values, instead of references
            });
        }

        // Reset the length of the race meets after the first while loop
        b = this.props.raceMeets.length;

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
                    // Reset the race score
                    raceScore = 0;
                    // Get the current punter's stats from the stats array
                    puntersStats = this.findPuntersStats(stats, tips.punters[d].punterId);
                    // Get the current race meet from the current punter's stats
                    puntersStatsMeet = this.findPuntersStatsMeet(puntersStats, this.props.raceMeets[b].meetId);
                    // Update the stats of that punter
                    if (tips.punters[d].tips.includes(placings.first)) {
                        puntersStats.firsts++;
                        raceScore += 3;
                    }
                    if (tips.punters[d].tips.includes(placings.second)) {
                        puntersStats.seconds++;
                        raceScore += 2;
                    }
                    if (tips.punters[d].tips.includes(placings.third)) {
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
        }

        return stats;
    };

    /* Function create the stat item HTML for each punter and adding to the arrayToUpdate */
    createStatArray = (stats, arrayToUpdate, arrayToUpdateName) => {
        let stat, punter, position;

        for (let i = 0, len = stats.length; i < len; i++) {
            // Set the correct stat data according to the array to update
            switch (arrayToUpdateName) {
                case 'trifectas':
                    stat = stats[i].trifectas;
                    break;
                case 'quinellas':
                    stat = stats[i].quinellas;
                    break;
                case 'firsts':
                    stat = stats[i].firsts;
                    break;
                case 'seconds':
                    stat = stats[i].seconds;
                    break;
                case 'thirds':
                    stat = stats[i].thirds;
                    break;
                case 'meet':
                    stat = stats[i].score;
                    break;
                default:
                    break;
            }
            // Get the current punters details
            punter = this.findPunter(stats[i].punterId);

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

            // Create the stat item and add to the array to update
            arrayToUpdate.push(
                <div key={i} className="stat-item">
                    <div className="number" dangerouslySetInnerHTML={{ __html: i + 1 + position }} />
                    <img src={'pics/' + punter.pic} alt="Profile pic" className="pic" />
                    <div className="name">{punter.name.first}</div>
                    <div className="stat">{stat}</div>
                </div>
            );
        }
    };

    /* Function to render the component */
    render() {
        let stats = this.calculateStats(),
            turnbullTemp = [],
            guineasTemp = [],
            caulCupTemp = [],
            coxPlateTemp = [],
            // derbyDayTemp = [],
            // melbCupTemp = [],
            // oaksDayTemp = [],
            // stakesDayTemp = [],
            turnbull = [],
            guineas = [],
            caulCup = [],
            coxPlate = [],
            // derbyDay = [],
            // melbCup = [],
            // oaksDay = [],
            // stakesDay = [],
            trifectas = [],
            quinellas = [],
            firsts = [],
            seconds = [],
            thirds = [],
            tabBtn1Class,
            tabBtn2Class,
            tab1Class,
            tab2Class;

        // Set the tab status and hide/show the tabs
        if (this.state.tabSelected === 1) {
            tabBtn1Class = 'btn tab-btn one selected';
            tabBtn2Class = 'btn tab-btn two';
            tab1Class = '';
            tab2Class = 'hide';
        } else {
            tabBtn1Class = 'btn tab-btn one';
            tabBtn2Class = 'btn tab-btn two selected';
            tab1Class = 'hide';
            tab2Class = '';
        }

        // Populate each of the temporary meet arrays with each punters score for that meet
        for (let i = 0, len = stats.length; i < len; i++) {
            for (let j = 0, leng = stats[i].meets.length; j < leng; j++) {
                if (stats[i].meets[j].meetId === 'TURNBULL') {
                    turnbullTemp.push({
                        punterId: stats[i].punterId,
                        score: stats[i].meets[j].score
                    });
                }
                if (stats[i].meets[j].meetId === 'CAULGUINEAS') {
                    guineasTemp.push({
                        punterId: stats[i].punterId,
                        score: stats[i].meets[j].score
                    });
                }
                if (stats[i].meets[j].meetId === 'CAULCUP') {
                    caulCupTemp.push({
                        punterId: stats[i].punterId,
                        score: stats[i].meets[j].score
                    });
                }
                if (stats[i].meets[j].meetId === 'COXPLATE') {
                    coxPlateTemp.push({
                        punterId: stats[i].punterId,
                        score: stats[i].meets[j].score
                    });
                }
                // if (stats[i].meets[j].meetId === 'DERBYDAY') {
                //     derbyDayTemp.push({
                //         punterId: stats[i].punterId,
                //         score: stats[i].meets[j].score
                //     });
                // }
                // if (stats[i].meets[j].meetId === 'MELBCUP') {
                //     melbCupTemp.push({
                //         punterId: stats[i].punterId,
                //         score: stats[i].meets[j].score
                //     });
                // }
                // if (stats[i].meets[j].meetId === 'OAKSDAY') {
                //     oaksDayTemp.push({
                //         punterId: stats[i].punterId,
                //         score: stats[i].meets[j].score
                //     });
                // }
                // if (stats[i].meets[j].meetId === 'STAKESDAY') {
                //     stakesDayTemp.push({
                //         punterId: stats[i].punterId,
                //         score: stats[i].meets[j].score
                //     });
                // }
            }
        }

        // Sort punters in descending order by their score in the Turnbull Cup
        turnbullTemp.sort((a, b) => {
            return b.score - a.score;
        });

        // Create list of punters for the Caulfield Guineas
        this.createStatArray(turnbullTemp, turnbull, 'meet');

        // Sort punters in descending order by their score in the Caulfield Guineas
        guineasTemp.sort((a, b) => {
            return b.score - a.score;
        });

        // Create list of punters for the Caulfield Cup
        this.createStatArray(guineasTemp, guineas, 'meet');

        // Sort punters in descending order by their score in the Caulfield Cup
        caulCupTemp.sort((a, b) => {
            return b.score - a.score;
        });

        // Create list of punters for the Cox Plate
        this.createStatArray(caulCupTemp, caulCup, 'meet');

        // Sort punters in descending order by their score in the Cox Plate
        coxPlateTemp.sort((a, b) => {
            return b.score - a.score;
        });

        // Create list of punters for the Cox Plate
        this.createStatArray(coxPlateTemp, coxPlate, 'meet');

        // Sort punters in descending order by their score in the Derby Day
        // derbyDayTemp.sort((a, b) => {
        //     return b.score - a.score;
        // });

        // Create list of punters for the Derby Day
        // this.createStatArray(derbyDayTemp, derbyDay, 'meet');

        // Sort punters in descending order by their score in the Melbourne Cup
        // melbCupTemp.sort((a, b) => {
        //     return b.score - a.score;
        // });

        // Create list of punters for the Melbourne Cup
        // this.createStatArray(melbCupTemp, melbCup, 'meet');

        // Sort punters in descending order by their score in the Oaks Day
        // oaksDayTemp.sort((a, b) => {
        //     return b.score - a.score;
        // });

        // Create list of punters for the Oaks Day
        // this.createStatArray(oaksDayTemp, oaksDay, 'meet');

        // Sort punters in descending order by their score in the Stakes Day
        // stakesDayTemp.sort((a, b) => {
        //     return b.score - a.score;
        // });

        // Create list of punters for the Stakes Day
        // this.createStatArray(stakesDayTemp, stakesDay, 'meet');

        // Sort punters in descending order by trifectas
        stats.sort((a, b) => {
            return b.trifectas - a.trifectas;
        });

        // Create list of punters in order of trifectas
        this.createStatArray(stats, trifectas, 'trifectas');

        // Sort punters in descending order by quinellas
        stats.sort((a, b) => {
            return b.quinellas - a.quinellas;
        });

        // Create list of punters in order of quinellas
        this.createStatArray(stats, quinellas, 'quinellas');

        // Sort punters in descending order by firsts
        stats.sort((a, b) => {
            return b.firsts - a.firsts;
        });

        // Create list of punters in order of firsts
        this.createStatArray(stats, firsts, 'firsts');

        // Sort punters in descending order by seconds
        stats.sort((a, b) => {
            return b.seconds - a.seconds;
        });

        // Create list of punters in order of seconds
        this.createStatArray(stats, seconds, 'seconds');

        // Sort punters in descending order by thirds
        stats.sort((a, b) => {
            return b.thirds - a.thirds;
        });

        // Create list of punters in order of thirds
        this.createStatArray(stats, thirds, 'thirds');

        return (
            <div className="app">
                <Header
                    page="Statistics"
                    path={this.props.path}
                    punters={this.props.punters}
                    user={this.props.user}
                    onReloadData={this.props.onReloadData}
                    loadingData={this.props.loadingData}
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
                <div className={tab1Class}>
                    <div className="bold mt-20 mb-10">Turnbull Stakes</div>
                    <div className="stat-container">{turnbull}</div>
                    <hr />
                    <div className="bold mt-20 mb-10">Caulfield Guineas</div>
                    <div className="stat-container">{guineas}</div>
                    <hr />
                    <div className="bold mt-20 mb-10">Caulfield Cup</div>
                    <div className="stat-container">{caulCup}</div>
                    <hr />
                    <div className="bold mt-20 mb-10">Cox Plate</div>
                    <div className="stat-container">{coxPlate}</div>
                    {/* <hr />
                    <div className="bold mt-20 mb-10">Derby Day</div>
                    <div className="stat-container">{derbyDay}</div>
                    <hr />
                    <div className="bold mt-20 mb-10">Melbourne Cup</div>
                    <div className="stat-container">{melbCup}</div>
                    <hr />
                    <div className="bold mt-20 mb-10">Oaks Day</div>
                    <div className="stat-container">{oaksDay}</div>
                    <hr />
                    <div className="bold mt-20 mb-10">Stakes Day</div>
                    <div className="stat-container">{stakesDay}</div> */}
                </div>
                <div className={tab2Class}>
                    <div className="bold mt-20 mb-10">Trifectas</div>
                    <div className="stat-container">{trifectas}</div>
                    <hr />
                    <div className="bold mt-20 mb-10">Quinellas</div>
                    <div className="stat-container">{quinellas}</div>
                    <hr />
                    <div className="bold mt-20 mb-10">Firsts</div>
                    <div className="stat-container">{firsts}</div>
                    <hr />
                    <div className="bold mt-20 mb-10">Seconds</div>
                    <div className="stat-container">{seconds}</div>
                    <hr />
                    <div className="bold mt-20 mb-10">Thirds</div>
                    <div className="stat-container">{thirds}</div>
                </div>
                <Menu path={this.props.path} />
            </div>
        );
    }
}
