import React, { useRef } from 'react'

const StudentRow = ({ data, OnRemove }) => {

  const rowRef = useRef(null);

  return (
    <tr ref={rowRef}>
      <td>{data.firstname}</td>
      <td>{data.lastname}</td>
      <td>{data.username}</td>
      <td>{data.email}</td>
      <td id="rem">
        <button onClick={() => {OnRemove(data._id, rowRef.current)}}>REMOVE</button>
      </td>
    </tr>
  );
};
export default StudentRow