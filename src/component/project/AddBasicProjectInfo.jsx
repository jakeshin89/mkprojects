import React, { Component } from "react";
import "./AddBasicProjectInfo.css";
import EateryInfo from "./EateryInfo";

class AddBasicProjectInfo extends Component{

  constructor(props){
    super(props);

    this.state = {
      modal: false,
      eateryInfoCloseMC: this.eateryInfoCloseMC,
      title: '',
      date: '',
      budget: '',

      width: '80%'

    }
  }
  
  onChange = (e) => {
    this.setState({
      [e.target.name] : e.target.value
    });
  }

  eateryInfoOpenMC = () => {
    this.setState({
      modal: true,
      width: '68%'
    });
    
  }
  
  eateryInfoCloseMC = () => {
    this.setState({
      modal: false
    });
  };

  render(){

    console.log('AddBasicProjectInfo render()');
    console.log('제목이다 이것들아', this.state.title);

    const { modal, eateryInfoCloseMC, width } = this.state;

    const style = {
      width: width
    }

    return(
      <div>

        <div className="header">
          <input type="text" placeholder="프로젝트 제목을 입력하세요." name="title" 
            value={this.state.subject} onChange={this.onChange} />  
          <button>작성</button>
        </div>

        <div className="container">

          <div className="leftside">
            <div>
              <label>날짜</label>
              <input type="date" placeholder="" name="date"
                value={this.state.date} onChange={this.onChange} />
            </div>
            <div>
              <label>총예산</label>
              <input type="number" min="0" placeholder="예산을 입력하세요." name="budget"
                value={this.state.budget} onChange={this.onChange} />
            </div>          
          </div>

          {!modal && (
            <button onClick={this.eateryInfoOpenMC} className="btnOpenEatery">></button>
          )}
          {modal && (
            <EateryInfo eateryInfoCloseMC={eateryInfoCloseMC} />
          )}
        
          <div className="googleMap" style={style}>
            <br/>
            여기는 지도가 왔으면 좋겠는데...
          </div>

        </div>

      </div>
    );
  }
}



export default AddBasicProjectInfo;