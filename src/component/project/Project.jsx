import React from "react";
import Maps from "./maps/Maps";
import axios from "axios";
import './Project.css';
import styled, { css } from 'styled-components';
import EateryInfo from "./EateryInfo";
import withLogin from "../login/LoginHOC";
import jQuery from "jquery";
import $ from "jquery";
import { Row, Col, Button } from "react-bootstrap";
window.$ = window.jQuery = jQuery;

class Project extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      addedStore: "",
      coordinate: "",
      coords: [],
      selectedStores: [],
      storeInfos: [],
      storeResult: [],
      showResult: false,

      //은석추가
      modal: false,
      eateryInfoCloseMC: this.eateryInfoCloseMC,
      title: '',
      date: '',
      totalExpense: '',

      //음식점 보여주기
      tel: '',
      address: '',
      storeName: '',
      mainMenu: '',

      time: '',
      expense: '',

      width: '84.3%',
      widthMessage: 'default는 84.3%'
    };
  }

 
   //DB에서 가져오긔
   getStoreInfo = async () => {
    await axios({
      method: "get",
      url: "ownerStoreList"
    })
      .then(success => {
        const data = success.data;
        console.log("음식점 정보를 다 가져왔다하하하" + data);
        this.setState({
          storeInfos: data
        });
      })
      .catch(error => console.log("에러 났다고 전해라..." + error));
  };

  //Json에서 가져오긔
  getJson = async () => {
    const storeUrl = "/store.json";
    axios
      .get(storeUrl)
      .then(response => {
        let data = response.data.storeList;
        console.log("가게 정보 넘어 오너라.." + data);
        this.setState({
          storeInfos: data
        });
      })
      .catch(error => console.log("에러 잡아라아아..." + error));
  };




  handleSelection = async (storeName, coordinate) => {
    console.log("storeName이 project에 잘 넘어 왔는가..?" + storeName);
    console.log("coordinate이 project에 잘 넘어 왔는가...?" + coordinate);
    await this.setState({
      addedStore: storeName,
      coordinate: coordinate
    });



    this.setState(state => {
      const selectedStores = state.selectedStores.concat(
        state.addedStore,
        state.coordinate
      );
      return {
        selectedStores,
        addedStore: "",
        showResult: true,
        shouldUpdate: true
      };
   
    });
    // console.log("true ?"  +this.state.shouldUpdate);
  };

  showStores = async() => {
    const { selectedStores, storeResult } = this.state;
    const result = [];


     (async () => { this.state.storeInfos.map(store => {
      for (var i = 0; i < selectedStores.length; i++) {
        // if (store.A === selectedStores[i]) {  
          // -> Json에서 가져왔을 때

        if (store.storeName === selectedStores[i]) {
          // -> DB에서 가져왔을 때, selectedStores[i]는 이름만 가져옴
          var coordinateObject = { coordinate: selectedStores[i + 1] };

          console.log("store는 JSON이 맞니? 오 여기서 다 뜨나?" + JSON.stringify(store)); // -> 맞다고 전해라~
          console.log('store', store);//캬 추출완료
          console.log("coordinateObject는 JSON이 맞니? "+JSON.stringify(coordinateObject));

          console.log('store.ownerNo 추출 => ', store.ownerNo);
          console.log('store.tel 추출 => ', store.tel);
          console.log('store.address 추출 => ', store.address);
          console.log('store.storeName 추출 => ', store.storeName);
          console.log('store.mainMenu 추출 => ', store.mainMenu);

          /* 여기서 하면 오류뜨네
          this.setState = ({
            storeName: store.storeName,
            tel: store.tel,
            address: store.address,
            mainMenu: store.mainMenu
          })
          */

          // store에 좌표를 추가하기 ...드디어 성공 흑흑 JQuery 최고야
          store = $.extend(store,coordinateObject);
        
          result.push(store);
        }
      }
      return result;
    });
  }) ()
   await this.setState({
      storeResult: result
    });
    console.log("찍혀야해..." + JSON.stringify(storeResult));
  };


  

  shortestPath = () => {
    console.log("shortestPath() called!");
    const coordinate = [];

    var data = document.getElementsByName('singleStore');

    for(var i=0; i< data.length ; i++) {
      console.log(" 나와 " +data[i].getAttribute('value'));
      coordinate.push(data[i].getAttribute('value'));
    }
    
    console.log(coordinate);

    


  };



  handleStoreChange = () => {
    console.log("handleStoreChange() called!!!!");
  };

  dropStore (ownerNo) {
    console.log("dropStore() called!!")
    const {storeResult} = this.state;
    this.setState({
      storeResult: storeResult.filter(storeResult => storeResult.ownerNo !== ownerNo)
    })
  }



  componentDidMount() {
    // this.getJson();
    this.getStoreInfo();
  }

  componentDidUpdate() {
    if (this.state.shouldUpdate === true) {
      this.showStores();
      this.setState({
        shouldUpdate: false
      });
    }

  }

  shouldComponentUpdate(nextState) {
    return this.state.selectedStores !== nextState.selectedStores;
  } 

  //은석추가부분

  onChange = (e) => {
    this.setState({
      [e.target.name] : e.target.value
    });
  }

  eateryInfoOpenMC = () => {
    this.setState({
      modal: true,
      width: '68.6%',
      widthMessage: '이건 width가 68.6%'
    });
  }
  
  eateryInfoCloseMC = () => {
    this.setState({
      modal: false,
      width: '84.3%',
      widthMessage: '이건 width가 84.3%'
    });
  };


  render() {
    const { storeResult, showResult } = this.state;

    console.log('project.jsx render()');
    console.log('제목이다 이것들아', this.state.title);

    const { modal, eateryInfoCloseMC, width } = this.state;

    const style = {
      width: width
    }

    return (
      <div className="project">

        <div className="header">
          <div className="titleOutline">
            <Title type="text" placeholder="프로젝트 제목을 입력하세요." name="title" 
              value={this.state.subject} onChange={this.onChange} />  
          </div>
          <BtnGroup>
            <Button1 onClick={this.cancel}>취 소</Button1>
            <Button1 save>저 장</Button1>
          </BtnGroup>
        </div>

        <div className="container">

          <div className="leftside">
            <div className="basicInfo">
              <Label date for="date"><b>날짜:</b></Label>
              <input type="date" placeholder="" id = "date" name="date"
                className="date" value={this.state.date} onChange={this.onChange} />
            </div>
            <div className="basicInfo">
              <Label totalExpense for="totalExpense"><b>총예산:</b></Label>
              <input type="text" placeholder="" id="totalExpense" name="totalExpense"
                className="totalExpense" value={this.state.totalExpense} onChange={this.onChange} />&nbsp;원
            </div>

            <hr/>
            <div className="optimalPath">
              <button className="btnOptimalPath">경로최적화</button>
            </div>
            <hr/>

            <div className="wow">

              프로젝트 생성 페이지 오홍홍홍 <br/>
              선택한 마커 넘어와서 리스트에 저장 되었니? 
              {this.state.selectedStores}
              <br/>
              {showResult && (
                <div className="selectedStores" style={{overflow: "scroll"}}>
                <Row className="justify-content-center">
                  <Button onClick={() => this.shortestPath()}>경로 최적화</Button>
                </Row>

                {storeResult.map(row => (
                  <div
                    className="singleStore"
                    name='singleStore'
                    id={row.ownerNo}
                    key={row.ownerNo /* row.A */ } 
                    value={row.coordinate}
                  >
                    <Route>
                      <RouteEateryInfo>
                        <p> 가게 이름 : {row.storeName}</p>

                        {/*
                        <p> OwnerNo : {row.ownerNo}</p>
                        <p> 가게 이름 : {row.storeName}</p>
                        <p> 주소 : {row.address}</p>
                        <p> 전화 번호 : {row.tel}</p>
                        <p> 메인 메뉴 : {row.mainMenu}</p>
                        <p> 좌표 : {row.coordinate}</p>
                      */}

                      </RouteEateryInfo>
                      <div className="routeDetailInfo">
                        <Label time for="time">시간:</Label>
                        <input type="text" id="time" name="time"
                          className="time" value={this.state.time} onChange={this.onChange} />
                        <Label expense for="expense">예산:</Label>
                        <input type="text" id="expense" name="expense" 
                          className="expense" value={this.state.expense} onChange={this.onChange} />
                      </div>
                      <BtnRouteDelete onClick={() => this.dropStore(row.ownerNo)} variant="danger">
                      <i class="fas fa-trash-alt" />
                      </BtnRouteDelete>
                    </Route>
                    <div className="ellipsis">
                      <i class="fas fa-ellipsis-v" />
                    </div>
                  </div>
                ))}
                </div>
              )}{" "}

            </div>

          </div>

          {!modal && (
            <button onClick={this.eateryInfoOpenMC} className="btnOpenEatery">></button>
            )}
          {modal && (
            
            <EateryInfo 
              eateryInfoCloseMC={eateryInfoCloseMC} 
              storeName={this.state.storeName}
            />)}

          <div className="googleMap" style={style}>
            <Maps
              selection={this.handleSelection}
              />
          </div>

        </div>

        
      </div> 
    );
  }
}



const Route = styled.div`
  text-align: center;
  margin: 10px auto 10px auto;
  display: block;
  border: 1px solid blue;
  border-radius: 10px;
  width: 200px;
`
  
const RouteEateryInfo = styled.div`
  text-align: center;
  margin: 10px auto 0 auto;
  display: block;
  border: 1px solid red;
  border-radius: 10px;
  width: 180px;
  height: 100px;
  background-color: gray;
`

const Button1 = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid palevioletred;
  color: palevioletred;
  margin: 1.1rem 1em;
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
  height: 20px;
  
  ${props => props.date && css`
    margin: 10px 0px 3px 10px;
    `}
    
  ${props => props.totalExpense && css`
    margin: 3px 0px 5px 10px;
  `}

  ${props => props.time && css`
    width: 30px;
    margin: 5px auto 0px auto;
    font-size: 0.9em;
    `}
    
    ${props => props.expense && css`
    width: 30px;
    margin: 0px auto 7px auto;
    font-size: 0.9em;
  `}
`

const BtnRouteDelete = styled.button`
  border-radius: 100px;
  width: 30px;
  height: 30px;
  text-align: center;
  vertical-align: middle;
  line-height: 20px;
  margin: auto;
  float: right;
  position: relative;
  right: 20px;
  top: 13px;
  font-size: 0.9em;
  cursor: pointer;

  &:hover{
    color: palevioletred;
  }
`

export default withLogin(Project);
