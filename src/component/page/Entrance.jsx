import React, { Component } from "react";
import TDE from "../../image/TDEntertainment.jpg";

class Entrance extends Component {

  render(){
    return(
      <div> 
        Entrance Page <br/>
        <img 
          width="500px"
          height="300px"
          src={TDE}
          alt="트둥엔터테인먼트 공식 PPT 배경화면"
        />
      </div>
    );
  }
}

export default Entrance;