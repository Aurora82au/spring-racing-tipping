import React from 'react';
import TopMenu from './TopMenu';

const Header = ({ path, page, user, isAdmin, competitions, selectedCompetition, handleCompetitionSelect, onReloadData, text }) => (
    <>
        {
            // Show the top menu, profile pic and reload data button on every page but the Login page.
            page !== 'Log In' &&
            <>
                <TopMenu
                    path={path}
                    user={user}
                    competitions={competitions}
                    selectedCompetition={selectedCompetition}
                    handleCompetitionSelect={handleCompetitionSelect}
                    isAdmin={isAdmin}
                />
                <img className="profile-pic" src={'pics/' + user.image} alt="profile-pic" title={`${user.name.first} ${user.name.last}`} />
                <button className="reload-btn" title="Reload data" onClick={onReloadData}>
                    <span className="icon-reload" />
                </button>
            </>
        }
        <h2>
            Spring Racing Tipping <img src="horse.png" alt="Title logo" />
            <span className="beta">BETA</span>
        </h2>
        {
            // Show the competition name on every page but the Login page, and if the selectedCompetition is set.
            page !== 'Log In' && selectedCompetition &&
            <span className="comp-name">{selectedCompetition.name}</span>
        }
        <h3>{page}</h3>
        <p>{text}</p>
    </>
);

const areEqual = (prevProps, nextProps) => {
    return nextProps.page === prevProps.page &&
           (prevProps.user && nextProps.user.name.first === prevProps.user.name.first) &&
           (prevProps.user && nextProps.user.name.last === prevProps.user.name.last) &&
           nextProps.isAdmin === prevProps.isAdmin &&
           nextProps.competitions.length === prevProps.competitions.length &&
           nextProps.selectedCompetition.name === prevProps.selectedCompetition.name;
}

export default React.memo(Header, areEqual);
