import React from 'react';
import Profile from '../../assets/Pfp.png'

const Field = ({ data, addStudent }) => {
  return (
    <div id="field">
      <img src={Profile} alt="" />

   
        <div id='second'>
          <div>
            <p>First name: <br /> <span>{data.firstname}</span></p>
            <p>Last name: <br /> <span>{data.lastname}</span></p>
          </div>

          <br />
  
          <div>
            <p>Username: <br /> <span>{data.username}</span></p>
            <p>Email: <br /> <span>{data.email}</span></p>
          </div>
        </div>


      <button id='addstud' onClick={() => addStudent(data._id)}>ADD</button>
    </div>
  );
};

export default Field;
