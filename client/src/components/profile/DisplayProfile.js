import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ProfileAbout from './ProfileAbout';
import ProfileCreds from './ProfileCreds';
import ProfileHeader from './ProfileHeader';
import { getProfileByHandle } from '../../actions/profile';

class DisplayProfile extends Component {
  componentDidMount = () => {
    // retrieve handle from props
    if (this.props.match.params.handle) {
      this.props.getProfileByHandle(this.props.match.params.handle);
    }
  };
  render() {
    return (
      <div>
        <h1>Display Profile</h1>
      </div>
    );
  }
}

DisplayProfile.propTypes = {
  profile: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getProfileByHandle }
)(DisplayProfile);
