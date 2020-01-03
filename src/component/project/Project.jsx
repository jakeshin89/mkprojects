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

const {Tmap} = window;

class Project extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      addedStore: "",
      coordinate: "",
      index: "",
      coords: [],
      selectedStores: [],
      storeInfos: [],
      storeResult: [],
      showResult: false,
      modifiedOrder: [],
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

      //프로젝트 추가용

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
        //console.log("음식점 정보를 다 가져왔다하하하" + data);
        this.setState({
          storeInfos: data
        });
      })
      .catch(error => console.log("에러 났다고 전해라..." + error));
  };

  handleSelection = async (storeName, coordinate) => {
    console.log('해당 음식점 클릭하자마자 1번만 실행됨')
    console.log('handleSelection에서는 어떻게 나올까? ', this.state.storeResult);
    //console.log("storeName이 project에 잘 넘어 왔는가..?" + storeName);
    //console.log("coordinate이 project에 잘 넘어 왔는가...?" + coordinate);
    
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
  };

  showStores = async() => {

    console.log('showStores() excuted');
    const { selectedStores, storeResult } = this.state;
    const result = [];

    console.log('●storeResult => ', storeResult); //얘는 null
    console.log('지금까지 클릭한 selectedStores => ', selectedStores); //클릭한 음식점 이름, 좌표
    console.log('storeInfo 어마어마 => ', this.state.storeInfos); //db에 있는 음식점정보

     (async () => { 
       this.state.storeInfos.map(store => {
      for (var i = 0; i < selectedStores.length; i++) {

        if (store.storeName === selectedStores[i]) {

          var coordinateObject = { coordinate: selectedStores[i + 1] };

          console.log("store는 JSON이 맞니? 오 여기서 다 뜨나?" + JSON.stringify(store)); // -> 맞다고 전해라~
          console.log('store', store);//캬 추출완료
          console.log("coordinateObject는 JSON이 맞니? "+JSON.stringify(coordinateObject));

          window.stName = store.storeName;
          window.stAddress = store.address;
          window.stTel = store.tel;
          window.stMainMenu = store.mainMenu;
         
          console.log('변수에 저장한 stName 등 =>', 
            window.stName, window.stAddress, window.stTel, window.stMainMenu);
          
            
          // store에 좌표를 추가하기 ...드디어 성공 흑흑 JQuery 최고야
          store = $.extend(store, coordinateObject);
          
          console.log('★★selectedStores', selectedStores);
          console.log('★★storeResult', storeResult);
          console.log('★★store', store);

          result.push(store);
        }
      }
      return result;
    });
  }) ();
  await this.setState({
    storeResult: result,
    tel: window.stTel,
    address: window.stAddress,
    storeName: window.stName,
    mainMenu: window.mainMenu,
  });
  
};

  shortestPath = () => {
    console.log("shortestPath() called!");
    const coordinate = [];
    const ownerNo = [];
    let firstOrder = [];

    let startPoint = "";
    let endPoint = "";

    let startOwnerNo = "";
    let endOwnerNo = "";

    var data = document.getElementsByName("singleStore");

    firstOrder.push("출발");

    for (var i = 0; i < data.length; i++) {
      console.log(" 나와 " + data[i].getAttribute("value"));
      console.log(" OwnerNo " + data[i].getAttribute("id"));

      if (data[i].getAttribute("id") === "출발") {
        startPoint = data[i].getAttribute("value");
        startOwnerNo = data[i].getAttribute("mydata");
      } else if (data[i].getAttribute("id") === "도착") {
        endPoint = data[i].getAttribute("value");
        endOwnerNo = data[i].getAttribute("mydata");
      } else {
        coordinate.push(data[i].getAttribute("value"));
        ownerNo.push(data[i].getAttribute("id"));
        firstOrder.push(data[i].getAttribute("id"));
      }
    }

    firstOrder.push("도착");

    console.log("firstOrder ? " + firstOrder);

    console.log(coordinate);
    console.log(coordinate[1].split(","));
    console.log(coordinate[1].split(",")[1]);
    console.log(ownerNo);
    console.log(ownerNo[1]);
    console.log("startPoint ? " + startPoint);
    console.log("endPoint ? " + endPoint);
    console.log(startPoint.split(",")[0]);
    console.log(endPoint.split(",")[1]);

    this.setState({
      coords: coordinate
    });

    // ---------------------- Tmap 경유지 최적화 API -----------------------------------

    const map = new Tmap.Map({
      div: "map_div",
      width: "500px",
      height: "500px"
    }); // -> zoom 설정

    let routeLayer = new Tmap.Layer.Vector("route");
    map.addLayer(routeLayer);

    var prtcl;
    var headers = {};

    var result;
    var order = [];

    // 주현 Tmap appKey.. 이거 지우고 올려야해...
    headers["appKey"] = "84431dd5-3d00-402c-8f27-83feafcd1ff8";

    $.ajax({
      type: "POST",
      headers: headers,
      url:
        "https://apis.openapi.sk.com/tmap/routes/routeOptimization10?version=1&format=xml", //
      async: false,
      contentType: "application/json",
      data: JSON.stringify({
        reqCoordType: "WGS84GEO",
        resCoordType: "EPSG3857",
        startName: "출발",
        startX: startPoint.split(",")[0],
        startY: startPoint.split(",")[1],
        startTime: "201711121314",
        endName: "도착",
        endX: endPoint.split(",")[0],
        endY: endPoint.split(",")[1],
        searchOption: "0",
        viaPoints: [
          {
            viaPointId: "test01",
            viaPointName: firstOrder[1],
            viaX: coordinate[0].split(",")[0],
            viaY: coordinate[0].split(",")[1],
            viaTime: 600
          },
          {
            viaPointId: "test02",
            viaPointName: firstOrder[2],
            viaX: coordinate[1].split(",")[0],
            viaY: coordinate[1].split(",")[1],
            viaTime: 600
          },
          {
            viaPointId: "test03",
            viaPointName: firstOrder[3],
            viaX: coordinate[2].split(",")[0],
            viaY: coordinate[2].split(",")[1],
            viaTime: 600
          }
        ]
      }),
      success: function(response) {
        prtcl = response;

        // 5. 경유지 최적화 결과 Line 그리기
        //경유지 최적화 결과 POINT 찍기
        /* -------------- Geometry.Point -------------- */
        var pointLayer = new Tmap.Layer.Vector("point");
        var prtclString = new XMLSerializer().serializeToString(prtcl); //xml to String

        // console.log("prtclString 찍어보긔" + prtclString);

        let xmlDoc = $.parseXML(prtclString),
          $xml = $(xmlDoc),
          $intRate = $xml.find("Placemark");

        // console.log("xmlDoc 찍어보긔" + xmlDoc);

        var style_red = {
          fillColor: "#FF0000",
          fillOpacity: 0.2,
          strokeColor: "#FF0000",
          strokeWidth: 3,
          strokeDashstyle: "solid",
          pointRadius: 2,
          title: "this is a red line"
        };

        $intRate.each(function(index, element) {
          var nodeType = element.getElementsByTagName("tmap:nodeType")[0]
            .childNodes[0].nodeValue;
          if (nodeType === "POINT") {
            var point = element
              .getElementsByTagName("coordinates")[0]
              .childNodes[0].nodeValue.split(",");
            var geoPoint = new Tmap.Geometry.Point(point[0], point[1]);
            var pointFeature = new Tmap.Feature.Vector(
              geoPoint,
              null,
              style_red
            );

            pointLayer.addFeatures([pointFeature]);
          }
          // var util = require("util");
          // console.log("pointLayer는 무엇?" + util.inspect(pointLayer));
        });

        map.addLayer(pointLayer);
        /* -------------- Geometry.Point -------------- */
        //경유지 최적화 결과 Line 그리기
        routeLayer.style = {
          fillColor: "#FF0000",
          fillOpacity: 0.2,
          strokeColor: "#FF0000",
          strokeWidth: 3,
          strokeDashstyle: "solid",
          pointRadius: 2,
          title: "this is a red line"
        };
        var kmlForm = new Tmap.Format.KML().read(prtcl);

        result = kmlForm;

        // setTimeout(function() {
          // var util = require("util");
          // console.log("kmlForm은 무엇? " +  util.inspect(kmlForm));

          // var makeItString = kmlForm.toString();

          // console.log("kmlForm toString 가능? " + JSON.stringify(makeItString));
          // console.log("viaPointName 은 무엇?1 " + JSON.stringify(makeItString)[0].data.viaPointName);
          // console.log("viaPointName 은 무엇?2 " + kmlForm[0].data.viaPointName);
          // console.log("viaPointName 은 무엇?3 " + util.inspect(kmlForm)[0].data.viaPointName);
        // }, 3000);

        routeLayer.addFeatures(kmlForm);

        // 6. 경유지 최적화 결과 반경만큼 지도 레벨 조정
        map.zoomToExtent(routeLayer.getDataExtent());
      },
      error: function(request, status, error) {
        console.log(
          "code:" +
            request.status +
            "\n message:" +
            request.responseText +
            "\n error:" +
            error
        );
      }
    });

    for (var j = 0; j < result.length; j++) {
      console.log(result[j].data.viaPointName);
      if (j % 2 === 0) {
        order.push(result[j].data.viaPointName);
      }
    }

    console.log("firstOrder " + firstOrder);
    console.log("(modified) order? " + order);

    this.setState({
      modifiedOrder: order
    });

    // ------------------- 정렬 ---------------------

    const { storeResult } = this.state;

    var beforeSort = storeResult;
    var afterSort = [];

    console.log("beforeSort length ? " + beforeSort.length);
    console.log("beforeSort  ? " + JSON.stringify(beforeSort));

    console.log("beforeSort ownerNo? " + beforeSort[0].ownerNo);
    console.log("beforeSort ownerNo? " + beforeSort[1].ownerNo);
    console.log("beforeSort ownerNo? " + beforeSort[2].ownerNo);
    console.log("beforeSort ownerNo? " + beforeSort[3].ownerNo);
    console.log("beforeSort ownerNo? " + beforeSort[4].ownerNo);

    console.log("modified order's ownerNo ? " + order[0].split(" ")[1]);
    console.log("modified order's ownerNo ? " + order[1].split(" ")[1]);
    console.log("modified order's ownerNo ? " + order[2].split(" ")[1]);
    console.log("modified order's ownerNo ? " + order[3].split(" ")[1]);
    console.log("modified order's ownerNo ? " + order[4].split(" ")[1]);


    console.log("startOwnerNo ? " + startOwnerNo);
    console.log("startOwnerNo's type ? " + typeof(startOwnerNo));

    console.log("endOwnerNo ? " + endOwnerNo);
    console.log("endOwnerNo's type ? " + typeof(endOwnerNo));

    for (var y = 0; y < beforeSort.length; y++) {
      console.log(startOwnerNo);
      console.log(beforeSort[y].ownerNo);


      if (startOwnerNo.includes(beforeSort[y].ownerNo)) {
        console.log(" 첫번째 push");
        afterSort.push(beforeSort[y]);
      }
    }

    for (var x = 0; x < beforeSort.length; x++) {
      if (order[1].split(" ")[1].includes(beforeSort[x].ownerNo)) {

        console.log("modified order의 두번째 ownerNo ?"+ order[1].split(" ")[1]);
        console.log(" 두번째 push");
        afterSort.push(beforeSort[x]);
      }
    }

    for (var z = 0; z < beforeSort.length; z++) {
      if (order[2].split(" ")[1].includes(beforeSort[z].ownerNo)) {
        console.log(" 세번째 push");
        afterSort.push(beforeSort[z]);
      }
    }

    for (var c = 0; c < beforeSort.length; c++) {
      if (order[3].split(" ")[1].includes(beforeSort[c].ownerNo)) {
        console.log(" 네번째 push");
        afterSort.push(beforeSort[c]);
      }
    }

    for (var v = 0; v < beforeSort.length; v++) {
      if (order[4].split(" ")[1].includes(beforeSort[v].ownerNo)) {
        console.log(" 마지막번째 push");
        afterSort.push(beforeSort[v]);
      }
    }

    for (var b = 0; b < beforeSort.length; b++) {
      if (endOwnerNo === beforeSort[b].ownerNo) {
        afterSort.push(beforeSort[b]);
      }
    }

    if (afterSort.length !==0) {
      console.log(" sort 된 것 출력하기 " + JSON.stringify(afterSort));
        this.setState(state => {
          const storeResult = afterSort;
          return {
            storeResult: storeResult
          }
        });
    }
  };

  handleStoreChange = () => {
    console.log("handleStoreChange() called!!!!");
  };

  dropStore(ownerNo) {
    console.log("dropStore() called!!");
    const { storeResult } = this.state;
    this.setState({
      storeResult: storeResult.filter(
        storeResult => storeResult.ownerNo !== ownerNo
      )
    });
  }

  setStartPoint(ownerNo, index) {
    console.log("setStartPoint() called!!");
    console.log("ownerNo 뭐임 " + ownerNo);
    const id = [];
    var data = document.getElementsByName("singleStore");
    for (var i = 0; i < data.length; i++) {
      console.log(" id " + data[i].getAttribute("id"));
      console.log(" mydata " + data[i].getAttribute("mydata"));
      console.log(" mykey " + data[i].getAttribute("mykey"));

      if (
        "" + ownerNo + "" === data[i].getAttribute("mydata") &&
        data[i].getAttribute("id") === "도착"
      ) {
        $("#도착").attr("id", data[i].getAttribute("mydata"));
      }
      if (data[i].getAttribute("id") === "출발") {
        $("#출발").attr("id", data[i].getAttribute("mydata"));
      }
      if (data[i].getAttribute("mykey") !== index) {
        $("#" + data[i].getAttribute("mykey") + "").html(
          "<span> 출발지로 설정</span>"
        );
        $("#1" + data[i].getAttribute("mykey") + "").html(
          "<span> 도착지로 설정</span>"
        );
      }
    }
    $("#" + ownerNo + "").attr("id", "출발");
    $("#" + index + "").html("<span> 출발지</span>");
    // 잘 바뀌었는지 확인용! 나중에 지우셈
    for (var j = 0; j < data.length; j++) {
      id.push(data[j].getAttribute("id"));
    }
    console.log(id);
  }

  setEndPoint(ownerNo, index) {
    console.log("setEndPoint() called!!");
    const id = [];
    var data = document.getElementsByName("singleStore");
    for (var i = 0; i < data.length; i++) {
      console.log(" id " + data[i].getAttribute("id"));
      console.log(" mydata " + data[i].getAttribute("mydata"));
      console.log(" mykey " + data[i].getAttribute("mykey"));

      if (
        "" + ownerNo + "" === data[i].getAttribute("mydata") &&
        data[i].getAttribute("id") === "출발"
      ) {
        $("#출발").attr("id", data[i].getAttribute("mydata"));
      }
      if (data[i].getAttribute("id") === "도착") {
        $("#도착").attr("id", data[i].getAttribute("mydata"));
      }
      if (data[i].getAttribute("mykey") + 10 !== index) {
        $("#" + data[i].getAttribute("mykey") + "").html(
          "<span> 출발지로 설정하기</span>"
        );
        $("#1" + data[i].getAttribute("mykey") + "").html(
          "<span> 도착지로 설정하기</span>"
        );
      }
    }
    $("#" + ownerNo + "").attr("id", "도착");
    $("#1" + index + "").html("<span> 도착지</span>");

    // 잘 바뀌었는지 확인용! 나중에 지우셈
    for (var j = 0; j < data.length; j++) {
      id.push(data[j].getAttribute("id"));
    }
    console.log(id);
    console.log(id[1]);
  }

  handleStoreChange = () => {
    console.log("handleStoreChange() called!!!!");
  };

  dropStore (ownerNo) {
    console.log("dropStore() called!!")
    const {storeResult} = this.state;
    
    this.setState({
      storeResult: storeResult.filter(storeResult => storeResult.ownerNo !== ownerNo)
    })

    console.log('♥non-drop storeResult[]', storeResult);
    console.log('★dropped storeResult[]', storeResult.filter(storeResult => storeResult.ownerNo !== ownerNo));
  };

  componentDidMount() {
    this.getStoreInfo();
  };
  
  componentDidUpdate() {

    const { storeName, tel, address, mainMenu} = this.state;

    if (this.state.shouldUpdate === true) {
      this.showStores();
      this.setState({
        shouldUpdate: false,
      });
      console.log('다찍어 => ', storeName, tel, address, mainMenu);
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
  }

  saveProject = (e) => {
    e.preventDefault();

    const { title, date, totalExpense, storeResult } = this.state;
    //console.log('너는 누구냐', window.sessionStorage.getItem('userNo'));
    
    let project = {
      userNo: window.sessionStorage.getItem('userNo'),
      title: title,
      meetingDate: date,
      totalExpense: totalExpense,
      //여기까지
      projectDetail: [
        { routeNo: 0, ownerNo: 0 }
      ]
    }

    if(project.userNo){
      let rNo = 0;
      for(var i = 0; i < storeResult.length; i++){
        project.projectDetail.push({
          routeNo: ++rNo,
          ownerno: storeResult[i].ownerNo
        })
      }
      project.projectDetail = project.projectDetail.filter(
        store => store.routeNo !== 0
      );
    }else{
      console.log('userID가 존재하지 않습니다.');
    }

    console.log('★프로젝트정보 => ', project);
    
    axios.post('http://localhost:9999/project', project)
      .then( res => {
        console.log(res);
      })
      .catch( err => {
        console.log(err);
      })

  }

  render() {
    const { storeResult, showResult, coords, 
     storeName, tel, address, mainMenu } = this.state;

    console.log('project.jsx render() => 맛집순서배열', storeResult);
    console.log('제목이다 이것들아', this.state.title);

    console.log('project.jsx가 render()되면서 현재 선택한 값이 잘 찍힐까? =>',
     storeName, tel, address, mainMenu)

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
            <Button1 save onClick={this.saveProject}>저 장</Button1>
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
                <Button onClick={() => this.shortestPath()} className="btnOptimalPath">경로 최적화</Button>
              </div>
            <hr/>

            <div className="wow">
            {/*this.state.selectedStores*/}
            <br/>
            {showResult && (
              <div className="selectedStores" style={{overflow: "scroll"}}>
                {storeResult.map((row, index) => (
               <div
               className="singleStore"
               name="singleStore"
               id={row.ownerNo}
               mydata={row.ownerNo}
               key={index}
               mykey={index}
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
                        className="expense" value={this.state.expense} onChange={this.onChange} />&nbsp;원
                    </div>
                    
                    <div className="btnNavi">

                      <BtnSP
                        id={index}
                        onClick={() => this.setStartPoint(row.ownerNo, index)}
                        variant="info"
                        style={{ fontSize: "10pt", padding: "2px, 7px" }}
                        >
                        출발지
                      </BtnSP>

                      <BtnEP
                        id={index + 10}
                        onClick={() => this.setEndPoint(row.ownerNo, index)}
                        variant="warning"
                        style={{ fontSize: "10pt", padding: "2px, 7px" }}
                        >
                        도착지
                      </BtnEP>
                    </div>

                    <BtnRouteDelete 
                      onClick={() => this.dropStore(row.ownerNo)} 
                      variant="danger">
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
              storeAddress={this.state.address}
              storeTel={this.state.tel}
              storeMainMenu={this.state.mainMenu}
            />)}

          <div className="googleMap" style={style}>
            <Maps
              selection={this.handleSelection}
              />
          </div>

        </div>
        <br/>
        <div className="tmapTemp">
          <div id="map_div" />
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
  line-height: 18px;
  margin: auto;
  float: right;
  position: relative;
  right: 15px;
  top: -90px;
  font-size: 0.9em;
  cursor: pointer;
  background-color: white;
  border: 1px solid gray;

  &:hover{
    color: palevioletred;
  }
`

const BtnSP = styled.button`
  margin: 0 10px 0 0;
`
  
const BtnEP = styled.button`
  margin: 0 0 0 10px;

`

export default withLogin(Project);