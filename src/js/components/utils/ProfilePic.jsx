import React from 'react';
import PropTypes from 'prop-types';
import noPic from '../../../img/no-photo.jpg';

/**
 * @prop {string} width
 * @prop {string} height
 * @prop {boolean} rounded
 * @prop {boolean} squared
 * @prop {boolean} imageUrl
 * @prop {boolean} alt
 */
const ProfilePic = props => {
  const styles = {};

  if (props.rounded) {
    styles.borderRadius = '50%';
  } else if (props.squared) {
    styles.borderRadius = '10px';
  }

  styles.width = props.width || '200px';
  styles.height = props.height || '200px';
  styles.backgroundColor = '#ccc';

  return <img style={styles} src={props.imageUrl || noPic} alt={props.alt} />;
};

ProfilePic.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  rounded: PropTypes.bool,
  squared: PropTypes.bool,
  imageUrl: PropTypes.string,
  alt: PropTypes.string,
};

export default ProfilePic;
