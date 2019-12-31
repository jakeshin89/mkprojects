import React, { Component } from "react";
import "./EateryInfo.css";

class EateryInfo extends Component{

  render(){

    const { eateryInfoCloseMC } = this.props;

    return(
      <div>

        <div className="eateryInfo">

          <br/>
          <h3 className="sectionHeader">음식점이름<b>{this.props.storeName}</b></h3>
          <br/>
          <div className="mainImage">
          </div>

          <h3 className="sectionHeader">Information</h3>
          <div className="information">
            주소: <br/>
            전화번호: <br/>
          </div>
          <br/>

          <h3 className="sectionHeader">Reviews</h3>
          <div className="review">
            <h4>아 거기 별로였어요{this.props.reviewTitle}</h4>
            <p>
              블라블라{this.props.reviewContents}
            </p>
          </div>

        </div>
        <button onClick={eateryInfoCloseMC} className="btnCloseEatery">&#60;</button>
      
      </div>
    );
  }

}

export default EateryInfo;