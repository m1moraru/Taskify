import React from 'react';
import Login from '../components/Login/Login';
import '../pages/CSS/Login.css';
import taskify_icon from '../assets/taskify-icon.png';

function Home() {
  return(
    <div id='home-cnt'>
      {/*<img src={taskify_icon} alt="ison" className="icon" />*/}
      <Login />
    </div>
 
  )

}

export default Home; 
