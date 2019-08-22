import React, { PureComponent } from 'react';
import Button from '../components/Button';

export default class CompetitionSelector extends PureComponent {
    render() {
        const competitions = this.props.competitions;
        let options = [];
        let selector;

        // If there are more than 5 competitions, display them as a select box
        if (competitions.length > 5) {
            for (let i = 0, l = competitions.length; i < l; i++) {
                options.push(
                    <option key={competitions[i]._id} value={competitions[i]._id}>
                        {competitions[i].name}
                    </option>
                );
            }

            // Add a default <option> at the beginning of competitions
            options.unshift(
                <option key="a" value="">
                    -- Select Competition --
                </option>
            );

            selector = (
                <div className="selector">
                    <select onChange={this.props.handleCompetitionSelect}>
                        {options}
                    </select>
                    <span className="icon-select" />
                </div>
            );
        }
        // Else display them as a list
        else {
            for (let i = 0, l = competitions.length; i < l; i++) {
                options.push(
                    <li key={competitions[i]._id}>
                        <Button
                            classes="link"
                            type="button"
                            attributes={{'data-value': competitions[i]._id}}
                            onClick={this.props.handleCompetitionSelect}
                            text={competitions[i].name}
                            disabled={false}
                        />
                    </li>
                );
            }

            selector = (
                <ul>
                    {options}
                </ul>
            );
        }

        return (
            <div className="competition-selector">
                <h3>Please select a competition:</h3>
                {selector}
            </div>
        );
    }
}