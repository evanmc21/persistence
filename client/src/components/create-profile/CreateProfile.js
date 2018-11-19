import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextField from '../common/TextField';
import Input from '../common/Input';
import SelectList from '../common/SelectList';

class CreateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displaySocialInputs: false,
      handle: '',
      company: '',
      website: '',
      location: '',
      bio: '',
      favoriteQuote,
      specialty: '',
      experienceLevel: '',
      skills: '',
      twitter: '',
      linkedin: '',
      youtube: '',
      instagram: '',
      errors: {}
    };
  }
  render() {
    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8-m-auto">
              <h1 className="display-4 text-center">Create Your Profile</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(mapStateToProps)(CreateProfile);
