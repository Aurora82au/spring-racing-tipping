import React, { Fragment } from 'react';

export default function Podium(props) {
    // Returns the HTML for the podium, inserting the details for first, second and third from the passed props
    return (
        <Fragment>
            <h4 className="lb-heading teal">PODIUM</h4>
            <div className="podium">
                <div className="second">
                    <img src={'pics/' + props.second.image} alt="Profile pic" className="pic" />
                    <span className="name">
                        {props.second.name.first} {props.second.name.last}
                    </span>
                    <div className="bar">
                        <div className="number">
                            2<sup>ND</sup>
                        </div>
                        <div className="points">{props.points[1].points} PTS</div>
                    </div>
                </div>
                <div className="first">
                    <img src={'pics/' + props.first.image} alt="Profile pic" className="pic" />
                    <span className="name">
                        {props.first.name.first} {props.first.name.last}
                    </span>
                    <div className="bar">
                        <div className="icon-trophy" />
                        <div className="number">
                            1<sup>ST</sup>
                        </div>
                        <div className="points">{props.points[0].points} PTS</div>
                    </div>
                </div>
                <div className="third">
                    <img src={'pics/' + props.third.image} alt="Profile pic" className="pic" />
                    <span className="name">
                        {props.third.name.first} {props.third.name.last}
                    </span>
                    <div className="bar">
                        <div className="number">
                            3<sup>RD</sup>
                        </div>
                        <div className="points">{props.points[2].points} PTS</div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
