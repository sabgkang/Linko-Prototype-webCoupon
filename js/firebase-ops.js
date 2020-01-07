// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAhr69v1SCFW5mwzfv-qfMA6xL0IhKHNrc",
  authDomain: "webchallenge-c16eb.firebaseapp.com",
  databaseURL: "https://webchallenge-c16eb.firebaseio.com",
  projectId: "webchallenge-c16eb",
  storageBucket: "webchallenge-c16eb.appspot.com",
  messagingSenderId: "372130663533",
  appId: "1:372130663533:web:d73219272c0b4faf7f8364",
  measurementId: "G-LZ3DN86LX1"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// analytic 功能先不用
//firebase.analytics();

var database = firebase.database();

var isLogin = false;
firebase.auth().onAuthStateChanged(function (user) {
  console.log(user);

  if (user == null) {
    // not login
    console.log("no login");
    $("#loginStatus").text("請登入來寫入資料庫");
    $("#logToggle").text("登入");
    isLogin = false;
    $("#memberMangementBtn").attr("disabled", true);
    $("#addCouponBtn").attr("disabled", true);
    
    //以下三行不知為何沒作用
//    $("#courseDueBtn").attr("disabled", true);    
//    $("#courseDetailBtn").attr("disabled", true);        
//    $("#courseDeleteBtn").attr("disabled", true); 
    
//    var aaa = $('#couponTable').DataTable();
//    console.log(aaa);
//    aaa.buttons.disable();    
    
  } else {
    // login
    console.log(user.email);
    $("#loginStatus").text("Hello " + user.email);
    $("#logToggle").text("登出");
    isLogin = true;
    $("#memberMangementBtn").attr("disabled", false);
    $("#addCouponBtn").attr("disabled", false);
    
    //以下三行不知為何沒作用    
//    $("#courseDueBtn").attr("disabled", false);    
//    $("#courseDetailBtn").attr("disabled", false);        
//    $("#courseDeleteBtn").attr("disabled", false);     
  }
});

function readFromDB() {
  console.log("Read Database");

  $.loading.start('Loading data');

  var toRead = 4;
  var readTimes = 0;
  firebase.database().ref('users/林口運動中心/優惠券').once('value').then(function (snapshot) {
    console.log("data read done");
    readTimes++;
    var result = snapshot.val();
    couponData = JSON.parse(result.現在優惠券);
    couponHistory = JSON.parse(result.過去優惠券);

    if (couponData.length>0) {
      var tmp1 = couponData[couponData.length - 1][0];
      var tmp2 = parseInt(tmp1.substr(1, 4));
    } else tmp2 = 0;

    if (couponHistory.length>0) {    
      var tmp3 = couponHistory[couponHistory.length - 1][0];
      var tmp4 = parseInt(tmp3.substr(1, 4));  
    } else tmp4 = 0;
 
    couponNum = (tmp4 > tmp2)? tmp4:tmp2;
    
    //console.log(couponNum);

    refreshCourse();

    if (readTimes == toRead) $.loading.end();
  });

  firebase.database().ref('users/林口運動中心/客戶管理').once('value').then(function (snapshot) {
    console.log("member read done");
    readTimes++;
    var result = snapshot.val();
    memberData = JSON.parse(result.會員資料);

    if (readTimes == toRead) $.loading.end();
  });

  firebase.database().ref('users/林口運動中心/課程管理').once('value').then(function (snapshot) {
    console.log("class read done");
    readTimes++;
    var result = snapshot.val();
    courseMember = JSON.parse(result.課程會員);

    if (readTimes == toRead) $.loading.end();
  });
  
  firebase.database().ref('users/林口運動中心/教練管理').once('value').then(function (snapshot) {
    console.log("Coach read done");
    readTimes++;
    var result = snapshot.val();
    coachSet = JSON.parse(result.老師資料);

    if (readTimes == toRead) $.loading.end();
  });  

}

function readMemberfromDB() {
  console.log("Read memberData Database");  
  
  var toRead = 1;
  var readTimes = 0;  
  
  $.loading.start('Loading data')
  firebase.database().ref('users/林口運動中心/客戶管理').once('value').then(function (snapshot) {
    console.log("member read done");
    readTimes++;
    var result = snapshot.val();
    memberData = JSON.parse(result.會員資料);

    if (readTimes == toRead) $.loading.end();
    
    // 更新客戶表格
//    var memberTable = $('#memberTable').DataTable();
//    memberTable.clear().draw();
//    memberTable.rows.add(memberData);
//    memberTable.draw();
    
    
  });  
}