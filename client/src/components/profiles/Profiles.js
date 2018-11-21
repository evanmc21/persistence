import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../common/Spinner';
import ShowProfile from './ShowProfile';
import { getProfiles } from '../../actions/profile';

class Profiles extends Component {
  componentDidMount = () => {
    this.props.getProfiles();
  };

  render() {
    const { profiles, loading } = this.props.profile;
    let profileContent;

    if (profiles === null || loading) {
      profileContent = <Spinner />;
    } else {
      if (profiles.length > 0) {
        profileContent = profiles.map(profile => (
          <ShowProfile key={profile._id} profile={profile} />
        ));
      } else {
        profileContent = <h4>No profiles found</h4>;
      }
    }

    return (
      <div className="profiles">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4 text-center">Trainer Profiles</h1>
              <p className="lead text-center">Connect with other trainers</p>
              {profileContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getProfiles }
)(Profiles);
