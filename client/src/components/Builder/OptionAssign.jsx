import React from 'react';
import Profile from '../../assets/Pfp.png'

const OptionAssign = ({ data }) => {
  return (
    <option value={data._id}>{data.name} / {data.subject}</option>
  );
};

export default OptionAssign;
