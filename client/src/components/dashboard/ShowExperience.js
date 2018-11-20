import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

class ShowExperience extends Component {
  render() {
    const experience = this.props.experience.map(exp => (
      <tr key={exp._id}>
        <td>{exp.company}</td>
        <td>{exp.title}</td>
        <td>
          <Moment format="MM/YYYY">{exp.from}</Moment> - {''}
          {exp.to === null ? (
            ' Current'
          ) : (
            <Moment format="MM/YYYY">{exp.to}</Moment>
          )}
        </td>
        <td>
          <button className="btn btn-danger active">Remove Experience</button>
        </td>
      </tr>
    ));

    return (
      <div>
        <h3 class="mb-4">Experience</h3>
        <table className="table">
          <tr>
            <th>Company</th>
            <th>Title</th>
            <th>Years</th>
          </tr>
          {experience}
        </table>
      </div>
    );
  }
}

export default connect(null)(ShowExperience);
