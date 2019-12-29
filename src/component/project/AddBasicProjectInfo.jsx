import React, { Component } from "react";
import "./AddBasicProjectInfo.css";
import EateryInfo from "./EateryInfo";
import styled, { css } from "styled-components";

class AddBasicProjectInfo extends Component{

  constructor(props){
    super(props);

    this.state = {
      modal: false,
      eateryInfoCloseMC: this.eateryInfoCloseMC,
      title: '',
      date: '',
      totalExpense: '',

      width: '54%',
      widthMessage: 'default는 84%'
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
      width: '38%',
      widthMessage: '이건 width가 68%'
    });
    
  }
  
  eateryInfoCloseMC = () => {
    this.setState({
      modal: false,
      width: '54%',
      widthMessage: '이건 width가 84%'
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
          <div className="titleOutline">
            <Title type="text" placeholder="프로젝트 제목을 입력하세요." name="title" 
              value={this.state.subject} onChange={this.onChange} />  
          </div>
          <BtnGroup>
            <Button onClick={this.cancel}>취 소</Button>
            <Button save>저 장</Button>
          </BtnGroup>
        </div>

        <div className="container">

          <div className="leftside">
            <div>
              <Label date for="date">날짜:</Label>
              <input type="date" placeholder="" id = "date" name="date"
                className="date" value={this.state.date} onChange={this.onChange} />
            </div>
            <div>
              <Label totalExpense for="totalExpense">총예산:</Label>
              <input type="text" placeholder="" id="totalExpense" name="totalExpense"
                className="totalExpense" value={this.state.totalExpense} onChange={this.onChange} />원
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
            <br/>
            <WidhMessage>{this.state.widthMessage}</WidhMessage>
          </div>

        </div>

      </div>
    );
  }
}

const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid palevioletred;
  color: palevioletred;
  margin: 0.6rem 1em;
  padding: 0.4em 1.2em;
  font-size: 1.05em;
  cursor: pointer;
  
  ${props => props.save && css`
  background: palevioletred;
  color: white;
  
  &:hover {
    background: #B85673;
    border: 2px solid #B85673;
    }

  `}
`
  
const Title = styled.input`
  width: 90%;
  height: 30px;
  margin: 0.35rem 0.5em;
  padding: 0em 0.5em;
  color: black;
  font-size: 1em;
  border: none;
`

const BtnGroup = styled.div`
  float: right;
`
const WidhMessage = styled.p`
  color: white;
`

const Label = styled.label`
  display: inline-block;
  width: 52px;
  height: 24px;
  
  ${props => props.date && css`
    margin: 15px 0px 3px 10px;
    `}
    
  ${props => props.totalExpense && css`
    margin: 3px 0px 15px 10px;
  `}
`

export default AddBasicProjectInfo;