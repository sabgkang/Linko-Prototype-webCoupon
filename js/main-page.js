function initMainPage() {
  $("#loginDiv").hide();
  $("#addCoupon").hide();
//  $("#coachTable").hide();
  $("#courseDetail").hide();
  $("#newCoachInfo").hide();
  $("#memberDiv").hide();
  $("#addMemberInfo").hide();

  //  var memberTable = $('#memberTable').DataTable({
  //    data: memberData,
  //    pageLength: 10,
  //    lengthChange: false,
  //    deferRender: true,
  //    columns: [{ //title: 姓名
  //        className: "centerCell"
  //              },
  //      {
  //        //title: LINE ID
  //        className: "centerCell"
  //              },
  //      { //title: "姓別"
  //        className: "centerCell"
  //              },
  //      {
  //        //title: "年紀"
  //        className: "centerCell"
  //              },
  //      {
  //        //title: "電話"
  //        className: "centerCell"
  //              },
  //      {
  //        //title: "身分字號"
  //        className: "centerCell"
  //              },              
  //      {
  //        //title: "地址", 不對中，對左
  //      
  //              },
  ////      {
  ////        //title: "操作",
  ////        data: null,
  ////        defaultContent: "<button class = 'dueButton to-edit'>到期</button> " +
  ////          "<button class = 'detailButton to-edit'>詳細</button> " +
  ////          "<button class = 'deleteButton to-delete'>刪除</button>"
  ////              }
  //            ]
  //  });  

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
        //title: "優惠券名稱", 不對中，對左
              },
      {
        //title: "有效期限"
        className: "centerCell"
              },

      {
        //title: "操作",
        data: null,
        defaultContent: "<button id='courseDueBtn' class = 'dueButton to-edit'>到期</button> " +
          "<button id='courseDetailBtn' class = 'detailButton to-edit'>詳細</button> " +
          "<button id='courseDeleteBtn' class = 'deleteButton to-delete'>刪除</button>"
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
      database.ref('users/林口運動中心/團課課程').set({
        現在課程: JSON.stringify(couponData),
        過去課程: JSON.stringify(couponHistory),
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
    
    courseMemberSet=[];

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

    $("#courseMemberTable_filter").css({
      "font-size": "16px"
    });
    $("#courseMemberTable_info").css({
      "font-size": "16px"
    });
    $("#courseMemberTable_paginate").css({
      "font-size": "16px"
    });

    var data = couponTable.row($(this).parents('tr')).data();
    //console.log("detail:" + data[0]);

    $("#couponNumberDetail").text("簽到頁面 - " + data[0] + " "+ data[1] + " @" + data[3]);
    
    courseForDetail = data[0];

    $("#courseNameDetail").val(data[1]);
    $("#couponNameDetail").val(data[2]);
    $("#assistNameDetail").val(data[6]);
    $("#courseTimeDetail").val(data[3]);
    $("#CaloriesDetail").val(data[4]);
    $("#maxPersonsDetail").val(data[5]);
    $("#feeDetail").val(data[7]);
    $("#otherDescDetail").val(data[8]);

    courseMember.forEach(function (item, index, array) {
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
          var dataToAdd = tmp1.slice(0, 2);
          var tmp2 = tmp1.slice(4, 7);
          tmp2.forEach(function (obj, idx, array) {
            dataToAdd.push(obj);
          })

          dataToAdd.push(item1[1], item1[2]);
          //console.log("bbbbb", dataToAdd);

          courseMemberSet.push(dataToAdd);
        });

        item.unshift(data[0]);
      }
    });

    courseMemberTable.clear().draw();
    courseMemberTable.rows.add(courseMemberSet);
    courseMemberTable.draw();

    $("#courseDetail").show();

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
    deleteIt = confirm("確定要刪除此課程!無法回復!");

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
      database.ref('users/林口運動中心/團課課程').set({
        現在課程: JSON.stringify(couponData),
        過去課程: JSON.stringify(couponHistory),
      }, function (error) {
        if (error) {
          //console.log(error);
          return 0;
        }
        console.log('Write to database successful');
      });

      courseMember = courseMember.filter(function (value, index, arr) {
        return value[0] != data[0];
      });
      database.ref('users/林口運動中心/課程管理').set({
        課程會員: JSON.stringify(courseMember),
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
        //title: "優惠券名稱", 不對中，對左
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
    console.log("Copy course");
    
    var data = couponHistoryTable.row($(this).parents('tr')).data();     

    //console.log(data);
    $("#courseName").val(data[1]);
    $("#couponName").val(data[2]);
    var dateStr = data[3].split(" ");
    //console.log(dateStr[0]);
    $("#couponDate").val(dateStr[0]);
    $("#courseTime").val(dateStr[1]);
    $("#Calories").val(data[4]);
    $("#maxPersons").val(data[5]);
    $("#assistName").val(data[6]);
    $("#fee").val(data[7]);
    $("#otherDesc").val(data[8]); 

    
    addCoupon();
      
  });

  var courseMemberTable = $('#courseMemberTable').DataTable({
    data: courseMemberSet,
    pageLength: 8,
    lengthChange: false,
    deferRender: true,
    columns: [{ //title: "Name"
        className: "centerCell"
              },
      {
        //title: "LINE ID"
        className: "centerCell"
              },
      { //title: "電話"
        className: "centerCell"
              },
      {
        //title: "身分證號"
        className: "centerCell"
              },
      {
        //title: "地址"
        className: "centerCell"
              },
      {
        //title: "繳費"
        className: "centerCell"
              },
      {
        //title: "簽到"
        className: "centerCell"
              },
      {
        //title: "操作",
        className: "centerCell",
        data: null,
        defaultContent: "<button class = 'payButton to-edit'>繳費</button> " +
          "<button class = 'checkInButton to-edit'>簽到</button> " +
          "<button class = 'resetButton to-edit'>重置</button> " 
              }
            ]
  });
  
  $('#courseMemberTable tbody').on('click', '.payButton', function () {
    var confirmIt = confirm("請確定已繳費!");
    if (!confirmIt) return 0;
    
    console.log("payButton is clicked");

    //var data = courseMemberTable.row($(this)).data();
    var data = courseMemberTable.row($(this).parents('tr')).data();    
    //console.log(data[0]);
    
    var thisCourse;
    var thisIndex;
    courseMember.forEach(function(item, index, array) {
      //console.log(item[1][0]);
      if (item[0]== courseForDetail) {
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
    
    //console.log(courseMember[thisIndex][thisI][0],courseMember[thisIndex][thisI][1]);
    courseMember[thisIndex][thisI][1] = "已繳費";

    // Update courseMemberSet 及其 Table  
    for (var i=0; i< courseMemberSet.length; i++){
      //console.log(courseMemberSet[i][0], data[0]);
      if (courseMemberSet[i][0] == data[0]) {
        //console.log("match");
        courseMemberSet[i][5] = "已繳費";
      };
    };
    
    var table = $('#courseMemberTable').DataTable();
    table.clear().draw();
    table.rows.add(courseMemberSet);
    table.draw();    
    
    // Write courseMember to database
    database.ref('users/林口運動中心/課程管理').set({
      課程會員: JSON.stringify(courseMember),
    }, function (error) {
      if (error) {
        //console.log(error);
        return 0;
      }
      console.log('Write to database successful');
    }); 
    
  });

  $('#courseMemberTable tbody').on('click', '.checkInButton', function () {
    var confirmIt = confirm("請確定已簽到!");
    if (!confirmIt) return 0;    
    console.log("checkInButton is clicked");

    //var data = courseMemberTable.row($(this)).data();
    var data = courseMemberTable.row($(this).parents('tr')).data();    
    //console.log(data[0]);
    
    var thisCourse;
    var thisIndex;
    courseMember.forEach(function(item, index, array) {
      //console.log(item[1][0]);
      if (item[0]== courseForDetail) {
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
    
    //console.log(courseMember[thisIndex][thisI][2]);
    courseMember[thisIndex][thisI][2] = "已簽到";

    // Update courseMemberSet 及其 Table
    for (var i=0; i< courseMemberSet.length; i++){
      //console.log(courseMemberSet[i][0], data[0]);
      if (courseMemberSet[i][0] == data[0]) {
        //console.log("match");
        courseMemberSet[i][6] = "已簽到";
      };
    };
    
    var table = $('#courseMemberTable').DataTable();
    table.clear().draw();
    table.rows.add(courseMemberSet);
    table.draw();  
    
    // Write courseMember to database
    database.ref('users/林口運動中心/課程管理').set({
      課程會員: JSON.stringify(courseMember),
    }, function (error) {
      if (error) {
        //console.log(error);
        return 0;
      }
      console.log('Write to database successful');
    });
    
  });  

  $('#courseMemberTable tbody').on('click', '.resetButton', function () {
    var confirmIt = confirm("請確定要重置!");
    if (!confirmIt) return 0;
    
    console.log("resetButton is clicked");

    //var data = courseMemberTable.row($(this)).data();
    var data = courseMemberTable.row($(this).parents('tr')).data();    
    //console.log(data[0]);
    
    var thisCourse;
    var thisIndex;
    courseMember.forEach(function(item, index, array) {
      //console.log(item[1][0]);
      if (item[0]== courseForDetail) {
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
    
    //console.log(courseMember[thisIndex][thisI][0],courseMember[thisIndex][thisI][1]);
    courseMember[thisIndex][thisI][1] = "未繳費";
    courseMember[thisIndex][thisI][2] = "未簽到";

    // Update courseMemberSet 及其 Table  
    for (var i=0; i< courseMemberSet.length; i++){
      //console.log(courseMemberSet[i][0], data[0]);
      if (courseMemberSet[i][0] == data[0]) {
        //console.log("match");
        courseMemberSet[i][5] = "未繳費";
        courseMemberSet[i][6] = "未簽到";
      };
    };
    
    var table = $('#courseMemberTable').DataTable();
    table.clear().draw();
    table.rows.add(courseMemberSet);
    table.draw();    
    
    // Write courseMember to database
    database.ref('users/林口運動中心/課程管理').set({
      課程會員: JSON.stringify(courseMember),
    }, function (error) {
      if (error) {
        //console.log(error);
        return 0;
      }
      console.log('Write to database successful');
    });
    
  });
  
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