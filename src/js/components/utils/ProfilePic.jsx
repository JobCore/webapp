import React from "react";
import PropTypes from "prop-types";

/**
 * @prop {string} width
 * @prop {string} height
 * @prop {boolean} rounded
 * @prop {boolean} squared
 */
const ProfilePic = (props) => {
  let styles = {};

  if (props.rounded) { styles.borderRadius = "50%"; }
  else if (props.squared) { styles.borderRadius = "10px"; }

  styles.width = props.width;
  styles.height = props.height;

  return (
    <img
      style={styles}
      src={props.imageUrl}
      alt="Profile Pic" />
  );
};

ProfilePic.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  rounded: PropTypes.bool,
  squared: PropTypes.bool,
};

export default ProfilePic;