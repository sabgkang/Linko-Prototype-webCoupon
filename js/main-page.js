function initMainPage() {
  $("#loginDiv").hide();
  $("#addCoupon").hide();
//  $("#coachTable").hide();
  $("#couponDetail").hide();
  $("#newCoachInfo").hide();
  $("#memberDiv").hide();
  $("#addMemberInfo").hide();
  

  var couponTable = $('#couponTable').DataTable({
    order: [[ 0, "desc" ]],
    data: couponData,
    pageLength: 8,
    lengthChange: false,
    deferRender: true,
    columns: [{ //title: "優惠券編號"
        className: "centerCell"
              },
      {
        //title: "優惠券內容", 不對中，對左
              },
      {
        //title: "有效期限"
        className: "centerCell"
              },

      {
        //title: "操作",
        data: null,
        defaultContent: "<button id='couponDueBtn' class = 'dueButton to-edit'>到期</button> " +
          "<button id='couponDetailBtn' class = 'detailButton to-edit'>詳細</button> " +
          "<button id='couponDeleteBtn' class = 'deleteButton to-delete'>刪除</button>"
              }
            ]
  });

  $('#couponTable tbody').on('click', '.dueButton', function () {
    console.log("Due is clicked");

    if (!isLogin) {
      alert("必須登入後才能修改");
      return 0;
    }

    var dueIt = false;
    dueIt = confirm("確定要課程過期!無法回復!");

    if (dueIt) {
      var data = couponTable.row($(this).parents('tr')).data();
      console.log("delete:" + data[0]);

      couponHistory.push(data);

      couponData = couponData.filter(function (value, index, arr) {
        return value[0] != data[0];
      });

      // 更新 couponNum
      if (couponData.length>0) {
        var tmp1 = couponData[couponData.length - 1][0];
        var tmp2 = parseInt(tmp1.substr(1, 4));
      } else tmp2 = 0;

      if (couponHistory.length>0) {    
        var tmp3 = couponHistory[couponHistory.length - 1][0];
        var tmp4 = parseInt(tmp3.substr(1, 4));  
      } else tmp4 = 0;

      couponNum = (tmp4 > tmp2)? tmp4:tmp2;

      // 更新 database
      database.ref('users/林口運動中心/優惠券').set({
        現在優惠券: JSON.stringify(couponData),
        過去優惠券: JSON.stringify(couponHistory),
      }, function (error) {
        if (error) {
          //console.log(error);
          return 0;
        }
        console.log('Write to database successful');
      });

      couponTable.clear().draw();
      couponTable.rows.add(couponData);
      couponTable.draw();

      couponHistoryTable.clear().draw();
      couponHistoryTable.rows.add(couponHistory);
      couponHistoryTable.draw();
    }

  });

  $('#couponTable tbody').on('click', '.detailButton', function () {
    console.log("Detail is clicked");
    
    if (!isLogin) {
      alert("必須登入後才能查看");
      return 0;
    }    
    
    couponMemberSet=[];

    $("#couponTable").hide();
    $("#couponHistoryTable").hide();
    $("#spacerBetweenTables").hide();

    //$(".dataTables_filter").hide();
    //$(".dataTables_info").hide();
    $('#couponTable_filter').hide();
    $('#couponTable_info').hide();
    $('#couponTable_paginate').hide();
    $('#couponHistoryTable_filter').hide();
    $('#couponHistoryTable_info').hide();
    $('#couponHistoryTable_paginate').hide();
    $("#addCoupon").hide();
    $("#inProgress").hide();
    $("#addCouponBtn").hide();
    $("#refreshBtn").hide();

    $("#couponMemberTable_filter").css({
      "font-size": "16px"
    });
    $("#couponMemberTable_info").css({
      "font-size": "16px"
    });
    $("#couponMemberTable_paginate").css({
      "font-size": "16px"
    });

    var data = couponTable.row($(this).parents('tr')).data();
    //console.log("detail:" + data[0]);

    $("#couponNumberDetail").text("優惠券頁面 - " + data[0] + " "+ data[1]);
    
    couponNumber = data[0];

    $("#couponDetail").val(data[1]);
    $("#couponDateDetail").val(data[2]);
    $("#couponOtherDescDetail").val(data[3]);

    couponMember.forEach(function (item, index, array) {
      if (item[0] == data[0]) {
        item.shift();

        var tmp1 = [];
        item.forEach(function (item1, index, array) {
          memberData.forEach(function (item2, index, array) {
            if (item1[0] == item2[0]) {
              tmp1 = item2;
            };
          });

          // Convert 
          var dataToAdd = tmp1.slice(0, 1);

          dataToAdd.push(item1[1], item1[2]);

          couponMemberSet.push(dataToAdd);
        });

        item.unshift(data[0]);
      }
    });

    couponMemberTable.clear().draw();
    couponMemberTable.rows.add(couponMemberSet);
    couponMemberTable.draw();

    $("#couponDetail").show();

  });

  $("#couponTable tbody").on('click', '.deleteButton', function () {
    // delete button
    console.log("delete:");
    if (!isLogin) {
      alert("必須登入後才能刪除");
      return 0;
    }
    var data = couponTable.row($(this).parents('tr')).data();

    var deleteIt = false;
    deleteIt = confirm("確定要刪除此優惠券!無法回復!");

    if (deleteIt) {
      //console.log("dddd");
      couponData = couponData.filter(function (value, index, arr) {
        return value[0] != data[0];
      });

      // 更新 couponNum
      if (couponData.length>0) {
        var tmp1 = couponData[couponData.length - 1][0];
        var tmp2 = parseInt(tmp1.substr(1, 4));
      } else tmp2 = 0;

      if (couponHistory.length>0) {    
        var tmp3 = couponHistory[couponHistory.length - 1][0];
        var tmp4 = parseInt(tmp3.substr(1, 4));  
      } else tmp4 = 0;

      couponNum = (tmp4 > tmp2)? tmp4:tmp2;

      // 更新 database
      database.ref('users/林口運動中心/優惠券').set({
        現在優惠券: JSON.stringify(couponData),
        過去優惠券: JSON.stringify(couponHistory),
      }, function (error) {
        if (error) {
          //console.log(error);
          return 0;
        }
        console.log('Write to database successful');
      });

      couponMember = couponMember.filter(function (value, index, arr) {
        return value[0] != data[0];
      });
      database.ref('users/林口運動中心/優惠券管理').set({
        優惠券會員: JSON.stringify(couponMember),
      }, function (error) {
        if (error) {
          //console.log(error);
          return 0;
        }
        console.log('Write to database successful');
      });

      console.log(deleteIt);
      console.log(couponData);
      couponTable.clear().draw();
      couponTable.rows.add(couponData);
      couponTable.draw();
    }
  });

  var couponHistoryTable = $('#couponHistoryTable').DataTable({
    order: [[ 0, "desc" ]],
    data: couponHistory,
    pageLength: 8,
    deferRender: true,
    lengthChange: false,
    columns: [{ //title: "優惠券編號"
        className: "centerCell"
              },
      {
        //title: "優惠券內容", 不對中，對左
              },
      {
        //title: "有效期限"
        className: "centerCell"
              },

      {
        //title: "操作",
        className: "centerCell",
        data: null,
        defaultContent: "<button class='copyButton to-edit' style='width: 150px'>複製新增優惠券</button>" 
              }              

            ]
  });
  
  $('#couponHistoryTable tbody').on('click', '.copyButton', function () {
    console.log("Copy coupon");
    
    var data = couponHistoryTable.row($(this).parents('tr')).data();     

    //console.log(data);
    $("#couponName").val(data[1]);
    $("#couponName").val(data[2]);
    var dateStr = data[3].split(" ");
    //console.log(dateStr[0]);
    $("#couponDate").val(dateStr[0]);
    $("#couponTime").val(dateStr[1]);
    $("#Calories").val(data[4]);
    $("#maxPersons").val(data[5]);
    $("#assistName").val(data[6]);
    $("#fee").val(data[7]);
    $("#otherDesc").val(data[8]); 

    
    addCoupon();
      
  });

  var couponMemberTable = $('#couponMemberTable').DataTable({
    data: couponMemberSet,
    pageLength: 8,
    lengthChange: false,
    deferRender: true,
    columns: [{ //title: "優惠券編號"
        className: "centerCell"
              },
//      { //title: "優惠券內容"
//        //className: "centerCell"
//              },
      {
        //title: "使用"
        className: "centerCell"
              },
      {
        //title: "確認"
        className: "centerCell"
              },
      {
        //title: "操作",
        className: "centerCell",
        data: null,
        defaultContent: "<button class = 'cancelUsingCoupon to-edit' style='width:80px'>取消使用</button> " 
                      + "<button class = 'confirmUsingCoupon to-edit' style='width:90px'>確認使用</button> "      
       
              }
            ]
  });
  
  $('#couponMemberTable tbody').on('click', '.cancelUsingCoupon', function () {
    var confirmIt = confirm("請確定已繳費!");
    if (!confirmIt) return 0;
    
    console.log("cancelUsingCoupon is clicked");

    //var data = couponMemberTable.row($(this)).data();
    var data = couponMemberTable.row($(this).parents('tr')).data();    
    //console.log(data[0]);
    
    var thisCourse;
    var thisIndex;
    couponMember.forEach(function(item, index, array) {
      //console.log(item[1][0]);
      if (item[0]== couponNumber) {
        //console.log(item, data[0]);
        thisCourse = item;
        thisIndex = index;
      }
    });
      
    //console.log(thisCourse, thisIndex, data[0]);
      
    var thisCourseLength = thisCourse.length;
    var thisI;
    for (var i = 0; i < thisCourseLength; i++) {
      if (thisCourse[i][0] == data[0]) {
        //console.log(thisCourse[i], thisIndex, i);
        thisI = i;
      };
    }   
    
    //console.log(couponMember[thisIndex][thisI][0],couponMember[thisIndex][thisI][1]);
    couponMember[thisIndex][thisI][1] = "已繳費";

    // Update couponMemberSet 及其 Table  
    for (var i=0; i< couponMemberSet.length; i++){
      //console.log(couponMemberSet[i][0], data[0]);
      if (couponMemberSet[i][0] == data[0]) {
        //console.log("match");
        couponMemberSet[i][5] = "已繳費";
      };
    };
    
    var table = $('#couponMemberTable').DataTable();
    table.clear().draw();
    table.rows.add(couponMemberSet);
    table.draw();    
    
    // Write couponMember to database
    database.ref('users/林口運動中心/優惠券管理').set({
      課程會員: JSON.stringify(couponMember),
    }, function (error) {
      if (error) {
        //console.log(error);
        return 0;
      }
      console.log('Write to database successful');
    }); 
    
  });

  $('#couponMemberTable tbody').on('click', '.confirmUsingCoupon', function () {
    var confirmIt = confirm("請確定已簽到!");
    if (!confirmIt) return 0;    
    console.log("confirmUsingCoupon is clicked");

    //var data = couponMemberTable.row($(this)).data();
    var data = couponMemberTable.row($(this).parents('tr')).data();    
    //console.log(data[0]);
    
    var thisCourse;
    var thisIndex;
    couponMember.forEach(function(item, index, array) {
      //console.log(item[1][0]);
      if (item[0]== couponNumber) {
        //console.log(item, data[0]);
        thisCourse = item;
        thisIndex = index;
      }
    });
      
    //console.log(thisCourse, thisIndex, data[0]);
      
    var thisCourseLength = thisCourse.length;
    var thisI;
    for (var i = 0; i < thisCourseLength; i++) {
      if (thisCourse[i][0] == data[0]) {
        //console.log(thisCourse[i], thisIndex, i);
        thisI = i;
      };
    }   
    
    //console.log(couponMember[thisIndex][thisI][2]);
    couponMember[thisIndex][thisI][2] = "已簽到";

    // Update couponMemberSet 及其 Table
    for (var i=0; i< couponMemberSet.length; i++){
      //console.log(couponMemberSet[i][0], data[0]);
      if (couponMemberSet[i][0] == data[0]) {
        //console.log("match");
        couponMemberSet[i][6] = "已簽到";
      };
    };
    
    var table = $('#couponMemberTable').DataTable();
    table.clear().draw();
    table.rows.add(couponMemberSet);
    table.draw();  
    
    // Write couponMember to database
    database.ref('users/林口運動中心/優惠券管理').set({
      課程會員: JSON.stringify(couponMember),
    }, function (error) {
      if (error) {
        //console.log(error);
        return 0;
      }
      console.log('Write to database successful');
    });
    
  });  

//  $('#couponMemberTable tbody').on('click', '.resetButton', function () {
//    var confirmIt = confirm("請確定要重置!");
//    if (!confirmIt) return 0;
//    
//    console.log("resetButton is clicked");
//
//    //var data = couponMemberTable.row($(this)).data();
//    var data = couponMemberTable.row($(this).parents('tr')).data();    
//    //console.log(data[0]);
//    
//    var thisCourse;
//    var thisIndex;
//    couponMember.forEach(function(item, index, array) {
//      //console.log(item[1][0]);
//      if (item[0]== couponNumber) {
//        //console.log(item, data[0]);
//        thisCourse = item;
//        thisIndex = index;
//      }
//    });
//      
//    //console.log(thisCourse, thisIndex, data[0]);
//      
//    var thisCourseLength = thisCourse.length;
//    var thisI;
//    for (var i = 0; i < thisCourseLength; i++) {
//      if (thisCourse[i][0] == data[0]) {
//        //console.log(thisCourse[i], thisIndex, i);
//        thisI = i;
//      };
//    }   
//    
//    //console.log(couponMember[thisIndex][thisI][0],couponMember[thisIndex][thisI][1]);
//    couponMember[thisIndex][thisI][1] = "未繳費";
//    couponMember[thisIndex][thisI][2] = "未簽到";
//
//    // Update couponMemberSet 及其 Table  
//    for (var i=0; i< couponMemberSet.length; i++){
//      //console.log(couponMemberSet[i][0], data[0]);
//      if (couponMemberSet[i][0] == data[0]) {
//        //console.log("match");
//        couponMemberSet[i][5] = "未繳費";
//        couponMemberSet[i][6] = "未簽到";
//      };
//    };
//    
//    var table = $('#couponMemberTable').DataTable();
//    table.clear().draw();
//    table.rows.add(couponMemberSet);
//    table.draw();    
//    
//    // Write couponMember to database
//    database.ref('users/林口運動中心/優惠券管理').set({
//      課程會員: JSON.stringify(couponMember),
//    }, function (error) {
//      if (error) {
//        //console.log(error);
//        return 0;
//      }
//      console.log('Write to database successful');
//    });
//    
//  });
  
}



var coachList = $('#coachList').DataTable({
  data: coachSet,
  //ordering: false,
  pageLength: 14,
  lengthChange: false,
  deferRender: true,
  columns: [
    { //title: "老師姓名"
      className: "centerCell"
    },
    {
      //title: "性別"
      className: "centerCell"
    },
    {
      //title: "其他說明"
    }
  ]
});

$('#coachList tbody').on('click', 'tr', function () {
  console.log("coach is clicked");


  var data = coachList.row($(this)).data();
  console.log(data);
  $("#couponName").val(data[0]);
  $("#addCoupon").show();
//  $("#coachTable").hide();

});