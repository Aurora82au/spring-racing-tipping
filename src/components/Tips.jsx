import React, { Component } from 'react';
import Header from './Header';
import RaceMeetSelector from './RaceMeetSelector';
import TippingRaceList from './TippingRaceList';
import Menu from './Menu';

export default class Tips extends Component {
    /* Determines whether React should re-render the component, in this case if the new props are different from the old props */
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props);
    }
    
    /* When the user clicks to go back from the Rick Roll screen, flip it back to the normal screen */
    handleLogoBack = event => {
        let container = document.querySelector('.flip-container');
        container.classList.remove('flipped');
        setTimeout(() => { container.classList.remove('preserve-3d'); }, 600);
    }

    /* Function to render the component */
    render() {
        let meet = this.props.raceMeets.find(meet => { return meet.meetId === this.props.selectedMeet }),
            tips = this.props.tips.find(tips => { return tips.meetId === this.props.selectedMeet });
        
        // The code for this page is within the 'front' <div>, the rest is the scaffolding to do the page flip for the Rick Roll
        return (
            <div className="app">
                <div className="flip-container">
                    <div className="flipper">
                        <div className="front">
                            <Header page="Tips" path={this.props.path} punters={this.props.punters} user={this.props.user} onReloadData={this.props.onReloadData} isAdmin={this.props.isAdmin} text="You want a tip?.....be good to your mother.  Otherwise, simply select 3 horses for each race.  If you already have 3 selected and want to change one, simply unselect one of them. Don't worry about saving at the end, your tips are saved every time you make a change." />
                            <p><b>* Tips must be in by 10:00am AEDT on race day.</b></p>
                            <p>The tips will be disabled after this time.</p>
                            <RaceMeetSelector meets={this.props.raceMeets} selectedMeetId={this.props.selectedMeet} onChange={this.props.onMeetChange} />
                            <div className="tip-examples">
                                <span className="selection selected">18</span><span>Selected</span>
                                <span className="selection scratched">18</span><span>Scratched</span>
                                <span className="selection selected scratched">18</span><span>Both</span>
                            </div>
                            <TippingRaceList meet={meet} tips={tips} user={this.props.user} onSelectionChange={this.props.onSelectionChange} />
                            <Menu path={this.props.path}></Menu>
                        </div>
                        <div className="back">
                            <img className="you-got" src='rickrolled.jpg' alt="You've been Rick Rolled" />
                            <img src='rick.gif' alt="Rick Roll" />
                            <div>Click the button below to return</div>
                            <button className="btn" type="button" onClick={this.handleLogoBack}>
                                <img src='rickrolled2.jpg' alt="Go back" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}