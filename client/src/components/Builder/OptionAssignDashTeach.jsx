import React from 'react';
import Profile from '../../assets/Pfp.png'

const OptionAssignDashTeach = ({ data, index }) => {
  return (
    <option value={index}>{data}</option>
  );
};

export default OptionAssignDashTeach;
