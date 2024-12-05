import React from 'react'

const ShowScore = ({data}) => {
  return (
    <tr>
      <td>{data.name}</td>
      <td>{data.username}</td>
      <td>{data.score}</td>
    </tr>
  )
}

export default ShowScore