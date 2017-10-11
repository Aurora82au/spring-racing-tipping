import React, { Component } from 'react';
import Header from './Header';
import Menu from './Menu';

export default class Information extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !(nextProps === this.props);
    }
    
    render() {
        return (
            <div className="app">
                <Header page="Information" path={this.props.path} punters={this.props.punters} user={this.props.user} isAdmin={this.props.isAdmin} text="This is where you can find a run down of how each of the pages of this app work, as well as the browser support and what some of the ideas for v2.0 are." />
                <div className="bold mt-20">Browser Support</div>
                <p>While this app will work fine on tablets and desktop, it was designed for mobile screen size, and to run in the latest version of the following browsers:</p>
                <ul className="browser-list">
                    <li><span className="browser chrome"></span>Chrome</li>
                    <li><span className="browser safari"></span>Safari</li>
                    <li><span className="browser firefox"></span>Firefox</li>
                    <li><span className="browser opera"></span>Opera</li>
                </ul>
                <div className="bold mt-20">Tips</div>
                <p>On the Tips page you can select a race meet from the drop down menu to view the list of races and their associated tips. You can submit 3 tips for each race of every race meet.  If you have selected 3 horses already, but want to change a selection, then you will have to unselect a horse before you can select a new one.  If you select less than 3 horses, then you simply miss out on the opprtunity to get those points.</p>
                <p>The tips for each race meet must be submitted by 10:00am AEDT on the day of the race meet.</p>
                <p>The tips for all the races of a race meet will be disabled after 10:00am on the day of the meet.</p>
                <div className="bold mt-20">Results</div>
                <p>On the Results page you can select a race meet to view the races for that meet, and the associated details and each punters tips for each race.</p>
                The races appear as coloured circles below the race meet drop down.  The selected race has a tapered bottom.  The colours match the status of the race:
                <ul>
                    <li><span className="demo-square bg-blue"></span> Not Yet Run</li>
                    <li><span className="demo-square bg-orange"></span> About To Jump</li>
                    <li><span className="demo-square bg-red"></span> Racing</li>
                    <li><span className="demo-square bg-green"></span> Has Run</li>
                </ul>
                <p>5 minutes before a race is due to run its status will automatically change to 'About To Jump'.  An admin will then have to manually set it to 'Racing' and 'Has Run' on the Admin page, as they can tend to run late.</p>
                <p>When you select a race you can see its details and placings appear, and below that will be a list of everybody's tips for that race.  Each person's tips shows each of their 3 picks and the calculated score.  Any correct tips will be shown in teal with a tick next to it.</p>
                <div className="bold mt-20">Leaderboard</div>
                <p>On the Leaderboard page you can see the current rank of all the punters according to their overall score.  The top three will appear on the podium, everybody else will be listed in order under 'Best of the Rest'.</p>
                <div className="bold mt-20">Admin</div>
                <p>Anybody who is marked as an admin will see an admin icon appear in the top right of the screen, below the profile picture <span className="icon-admin demo"></span></p>
                <p>When you click the admin link it will take you to the Admin page.  Currently on the Admin page you can set the placings and the status for each race. Click the green 'Race Started' button to change the status to Racing.  Then click the red 'Race Finished' button to change the status to Has Run, which will disable the button.</p>
                <p>In v2.0 I'd like to add more functionality here, like the ability to add scratchings and the ability to disable people from getting points, etc.</p>
                <div className="bold mt-20">Plans for v2.0</div>
                <ul className="marked-list">
                    <li>People can create accounts and it has proper authentication.</li>
                    <li>Introduce groups, so different groups of people can have their own tipping competitions.</li>
                    <li>To improve the design for tablet and desktop screen sizes.</li>
                    <li>Include scratchings.</li>
                    <li>Have a Statistics section that shows various statistics, like who won each race meet, most number of 1st, 2nds, 3rds, etc.</li>
                    <li>Use a service worker to allow people to pin the page to their Home screens with an icon, and cache all the files so that the page will start up instantly like a native app.</li>
                    <li>
                        Make a different version of the same app, but introduce some game-type elements.  So it would be more for fun than serious tipping.  It could also be modified to be for the greyhounds.
                        <br />
                        Ideas for the game elements are:
                        <ul>
                            <li>
                                <div>7 x Carrots (1 per meet probably)</div>
                                <div><b>Tag line:</b> Makes a horse surge home at the finish.</div>
                                <div><b>Explaination:</b> Earn points for one place higher than it actually finishes. Wasted if the horse comes in 1st, or 5th or below.</div>
                            </li>
                            <li>
                                <div>2 x Purple Carrots</div>
                                <div><b>Tag line:</b> More nutritious than regular carrots.</div>
                                <div><b>Explaination:</b> Earn points for two places higher. Wasted if the horse comes in 1st, or 6th or below. If it comes in 2nd then get the points for 1st, same as a regular carrot</div>
                            </li>
                            <li>
                                <div>1 x Juiced Syringe</div>
                                <div><b>Tag line:</b> Turn your nags into the Lance Armstrong of horses.</div>
                                <div><b>Explaination:</b> Get double points for a whole race meet.</div>
                            </li>
                            <li>
                                <div>1 x Poisioned Syringe</div>
                                <div><b>Tag line:</b> 'Phar Lap' a horse.</div>
                                <div><b>Explaination:</b> Kill a horse so nobody can get points for it for that race. Perhaps could be a bonus that is awarded to the person who wins the second meet or something, so then it is limited to only being used once by one person, but affects everyone equally?</div>
                            </li>
                            <li>
                                <div>1 x Shank</div>
                                <div><b>Tag line:</b> 'Monica Seles' a jockey.</div>
                                <div><b>Explaination:</b> Shank a jockey so nobody can get points for them for that race meet. Perhaps could be a bonus that is awarded to the person that wins the first meet or something, so then it is limited to only being used once by one person, but affects everyone equally?</div>
                            </li>
                            <li>
                                <div>7 x Glue Sticks (1 per meet probably)</div>
                                <div><b>Tag line:</b> Get out of a sticky situation.</div>
                                <div><b>Explaination:</b> If any of the horses you pick come last, send them to the glue factory to earn 1 point.</div>
                            </li>
                            <li>
                                <div>1 x Ricky Bobby</div>
                                <div><b>Tag line:</b> If you ain't first, your last.</div>
                                <div><b>Explaination:</b> Pick a horse to put everything on (only one tip for that race).  If it comes first you get double points (6).  If it comes anything else you get nothing.</div>
                            </li>
                            <li>
                                <div>? x Sugar Cubes</div>
                                <div><b>Tag line:</b> ?</div>
                                <div><b>Explaination:</b> Something good?</div>
                            </li>
                            <li>
                                <div>? x Riding Crops</div>
                                <div><b>Tag line:</b> ?</div>
                                <div><b>Explaination:</b> Something good or bad?</div>
                            </li>
                        </ul>
                    </li>
                </ul>
                <p>If you have any ideas for things to add or improve, let me know via message or email - sanmerah@gmail.com</p>
                <Menu path={this.props.path}></Menu>
            </div>
        );
    }
}