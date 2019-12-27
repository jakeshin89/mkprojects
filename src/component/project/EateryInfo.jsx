import React, { Component } from "react";
import "./EateryInfo.css";

class EateryInfo extends Component{

  render(){

    const { eateryInfoCloseMC } = this.props;

    return(
      <div className="eateryInfoBody">

        <div className="eateryInfo">
          <br/>
          <p>
          가나다라마바사
          </p>
        </div>
        <button onClick={eateryInfoCloseMC} className="btnCloseEatery">&#60;</button>
      
      </div>
    );
  }

}

export default EateryInfo;