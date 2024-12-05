import React from 'react'
import '../css/AboutUs.css'

const AboutUs = () => {
  return (
    <div id='MainAboutUS'>
        <div id='Us'>
          <div>
            <div id='Max'></div>
            <div id='Me'>
              <p>Max Aramis Hidanović</p>
              <p className='role'>Frontend Engineer</p>
            </div>
          </div>

          <div>
            <div id='Janko'></div>
            <div id='Me'>
              <p>Janko Nikolić</p>
              <p className='role'>Project Manager</p>
            </div>
          </div>

          <div>
            <div id='Stevan'></div>
            <div id='Me'>
              <p>Stevan Stanković</p>
              <p className='role'>Backend Engineer</p>
            </div>
          </div>
         
        </div>

        <div id='desc'>
          <p>We are a newly founded team in Jagodina, Serbia. We represent that even a group of friends in high school can achieve great things and we hope to do just that in this competition. We feel like programming is an essential part of our lives, and the beauty of it is what makes us love it so much. Teamwork is extremely important to us, owing to the fact that everything is easier as a team. Our primary goal is to create beneficial applications that help people in their everyday lives.</p>
        </div>
    </div>
  )
}

export default AboutUs