import { Component } from 'react';
import { withRouter } from 'react-router-dom';

/* This is a component to reset the page scroll to the top whenever the router changes the page */
class ScrollToTop extends Component {
    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        return this.props.children;
    }
}

export default withRouter(ScrollToTop);