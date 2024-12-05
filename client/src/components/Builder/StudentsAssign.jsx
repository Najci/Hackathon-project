import React, { useRef } from 'react'

const StudentsAssign = ({ data, onCheckboxChange }) => {

  const handleCheckboxChange = (e) => {
    onCheckboxChange(data._id, e.target.checked);
  };

  return (
    <tr>
      <td id='SelectStud'>
        <input name='students' type="checkbox" onChange={handleCheckboxChange} />
      </td>
      <td>{data.firstname}</td>
      <td>{data.lastname}</td>
      <td>{data.username}</td>
    </tr>
  );
};
export default StudentsAssign