import React from 'react';
import Button from '../components/Button';

const CompetitionSelector = ({ competitions, selectedCompetition, handleCompetitionSelect }) => {
    let options = [];
    let selector;

    if (competitions.length) {
        // If there are no competitions, display a message.
        if (competitions.length === 0) {
            return (
                <div className="competition-selector">
                    <p className="error">You have not been added to any competitions yet.</p>
                    <p className="error">Please talk to a competition admin to be added.</p>
                </div>
            );
        }
        // If there are more than 5 competitions, display them as a select box.
        else if (competitions.length > 5) {
            for (let i = 0, l = competitions.length; i < l; i++) {
                options.push(
                    <option key={competitions[i]._id} value={competitions[i]._id}>
                        {competitions[i].name}
                    </option>
                );
            }

            // Add a default <option> at the beginning of the list if no selected competition.
            if (!selectedCompetition) {
                options.unshift(
                    <option key="a" value="">
                        -- Select Competition --
                    </option>
                );
            }

            selector = (
                <div className="selector">
                    <select defaultValue={selectedCompetition} onChange={handleCompetitionSelect}>
                        {options}
                    </select>
                    <span className="icon-select" />
                </div>
            );
        }
        // Else display them as a list.
        else {
            let linkClass;

            for (let i = 0, l = competitions.length; i < l; i++) {
                linkClass = 'link';
                if (selectedCompetition && selectedCompetition._id === competitions[i]._id) {
                    linkClass += ' disabled';
                }
                options.push(
                    <li key={competitions[i]._id}>
                        <Button
                            classes={linkClass}
                            type="button"
                            attributes={{'data-value': competitions[i]._id}}
                            onClick={handleCompetitionSelect}
                            text={competitions[i].name}
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
    else {
        return <div />;
    }
}

export default CompetitionSelector;