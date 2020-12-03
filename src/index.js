// main.js
import Grid from './core/grid';
import Toolkit from './core/toolkit';

function defaultCommit(commit, data, request) {
  //  通信提交
  return request({
    url: `/requestForward/${commit}`,
    // url: `http://192.168.2.179:30099/mock/35/${commit}`,
    method: 'post',
    data
  }).then(response => {
    const {statusCode} = response;
    if (statusCode == 200) {
      return response
    } else {
      return false
    }
  }).catch(err => {
    throw new Error(err)
  })
}

function defineCommit(currentObj,commitFunc, request) {
  // 自定义提交
  try {
    return Toolkit.matrix.handleDefineFn(currentObj,request, commitFunc)
  }catch (e) {
    throw new Error(e)
  }
}

function localCommit(data) {
  // 本地提交
  return new Promise((resolve, reject) => {
    const _response = Object.assign({}, data);
    resolve(_response)
  });
}

function orderCommit(data) {
  // 订单提交
  return new Promise((resolve, reject) => {
    // $refs.show()
    const _response = Object.assign({}, data);
    resolve(_response)
  });
}

/**
 * 封装四个提交
 */
class Api {
  constructor(requestObj) {
    this.request = requestObj;
  }

  async defaultCommit(commitFunc, data) {  // 默认提交
    return await defaultCommit(commitFunc, data, this.request);
  }

  async defineCommit(currentObj,commitFunc) { // 自定义提交
    return await defineCommit(currentObj,commitFunc, this.request);
  }

  async localCommit(data) { // 本地提交
    return await localCommit(data);
  }

  async orderCommit(data) { // 订单提交
    return await orderCommit(data);
  }
}

// 返回单例
let oneCase = (function () {
  let instance
  return function () {
    if (!instance) {
      instance = new Grid();
    }
    return instance
  }
})()

export {
  Grid,
  oneCase,
  Toolkit,
  Api
}

/*

function main(currentObj, request, callBack) {
  debugger;
  var pageIndex = 1;
  var pageSize = 5;
  request.post("http://192.168.2.179:30099/mock/35/editStatus", {body: {listName: ""},
    header: {
      antiWeightSeqNo: "anim",
      gloSeqNo: "G11111",
      pageIndex: pageIndex,
      pageSize: pageSize,
      projectId: "consequat sit",
      reqSeqNo: "R11111",
      reqTime: "202012121212",
      serviceGroupid: "pariatur anim in",
      serviceId: "consectetur",
      serviceName: "dolor nisi ex",
      subProjectId: "velit in t",
      userInfo: {role: ["dolor do", "deserunt ea", "anim occaecat ea", "sint aliqua dolore"], username: "veniam"}
    }
  }).then(res => {
    debugger;
    console.log(res);
    if (res.header.rspCode == "00000000" || res.header.rspCode == "SP000000") {
      currentObj.$notify({title: "Success", message: "查询成功", type: "success", duration: 2000});
    } else if (res.header.rspCode == "99999999") {
      currentObj.$notify({title: "fail", message: "查询失败", type: "info", duration: 2000});
      return;
    }
    callBack(res.body.define);
    return res.body.define;
  }).catch(error => console.log(error));
}
*/


