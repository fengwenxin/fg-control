// 工具类
const matriToolkit = {
  // 处理流控数据
  getFlow(res) {
    const list = res.body.detail.records;
    let utils = {};
    let flowType = null;
    let funcColn = null;
    const define = res.body.define;
    if (define) {
      flowType = define.flowType || null;
      funcColn = define.funcCollection;
      utils = funcColn ? Toolkit.matrix.solveCommonUtilsJS(funcColn) : {};
    }
    // console.log('res', res)
    return {list, flowType, utils}
  },
  /**
   * 提交前检查
   * @param busdata 业务数据
   * @param operdata 操作数据
   * @param type 节点类型
   * @param commitType 提交处理
   * @returns {{status: number, error: string}}
   */
  checkSubmit(busdata, operdata, type, commitType) {
    let msg = {status: 0,error: ""};

    if (operdata.isUsable == Toolkit.static.notUsable) {
      // alert("流程已取消");
      msg = {status: 1, error: "流程已取消"};
    }
    // 结束节点
    if (type == Toolkit.static.isEnd) {
      // alert("流程已经结束");
      msg = {status: 1, error: "流程已经结束"};
    }
    if(!commitType && type != Toolkit.static.isStart){
      msg = {status: 1, error: "提交失败，当前节点没有设置提交类型"};
    }
    return msg
  },
  /**
   * 上一步检查
   * @param gridObj grid对象实例
   * @param data 当前节点
   * @returns {{status: number, error: string}}
   */
  checkPrev(gridObj,data){
    debugger
    let msg = {status: 0,error: ""};
    let {type, rollback, returnNode} = data;

    if (!returnNode) {
      msg = {status: 1, error: "没有设置返回的节点"};
    }

    if (rollback == Toolkit.static.disabledRollback || !rollback) {
      msg = {status: 1, error: "当前节点不能回退"};
    }
    if (type == Toolkit.static.isStart) {
      msg = {status: 1, error: "开始节点不能回退"};
    }
    if (type == Toolkit.static.isEnd) {
      msg = {status: 1, error: "流程已经结束,不能回退"};
    }
    if (returnNode) {
      // 判断上一节点是否在当前的返回列表中
      let processList = gridObj.getProcess().slice();
      const ret = Toolkit.matrix.handleBackNode(returnNode, processList);
      if (!ret) {
        msg = {error: -1, text: "上一节点不在设置的回退数组中，不能回退"};
      }
    }
    return msg;
  },

  /**
   * 处理公共函数js代码
   * @param JsCode
   * @returns {any}
   * @private
   */
  solveCommonUtilsJS(JsCode) {
    try {
      return eval(JsCode)
    } catch (error) {
      console.log('===commonJs===', JsCode)
      throw  new Error(JsCode)
    }
  },
  /** 初始化配置数据
   * @param _this 当前组件对象
   * @param fn 字符串main函数
   * @param gridObj grid
   * @param requestObj axios对象
   * @returns {Promise<any>}
   */
  solveInitDataConfigJs(_this, busdata, fn, requestObj) {
    const platform = busdata.platform;
    const user = busdata.user;
    const utils = busdata.utils;
    const request = requestObj;
    return new Promise((resolve, reject) => {
      try {
        let fns = eval("(" + fn + ")");
        fns.call(_this, user, platform, utils, request, function (callData) {
          debugger
          console.log('callData', callData)
          if (callData) {
            resolve(callData)
          } else {
            reject("没有返回数据")
          }
        });
      } catch (err) {
        throw new Error(fn)
      }
    })
  },
  /**
   * 处理配置数据js代码
   * @param inputConfigJs
   * @returns {*}
   * @private
   */
  solveStartConfigJs(busdata, operdata, JsCode) {
    debugger
    try {
      const platform = busdata.platform;
      const user =     busdata.user;
      const indata =   busdata.indata;
      const utils =    busdata.utils;
      const nodes =    operdata.nodes;
      const resCode = `function _execute(user, platform, indata, nodes, utils){  ${JsCode}  return main(...arguments);}`;
      // console.log('{ user, platform, indata, nodes, utils} ', {user, platform, indata, nodes, utils})
      // console.log('resCode',resCode)
      const exeCode = eval("(" + resCode + ")");
      let rs = exeCode(user, platform, indata, nodes, utils);
      return rs;
    } catch (error) {
      console.log('===inputConfigJs===', JsCode)
      throw new Error(JsCode)
    }
  },
  /**
   * 自定义函数提交 原函数handleRemoteFn
   * @param fn 自定义函数
   * @returns {Promise<any>}
   */
  handleDefineFn(currentObj, request, fn) {
    return new Promise((resolve, reject) => {
      try {
        let fns = eval("(" + fn + ")");
        // console.log('fns',typeof fns)
        fns(currentObj, request, function (tableCf) {
          debugger
          console.log('tableCf', tableCf)
          if (tableCf) {
            resolve(tableCf)
          } else {
            reject("没有返回数据")
          }
        });
      } catch (err) {
        throw new Error(err)
      }
    })

  },
  /**
   * 复制数据
   * @param object
   * @returns {any}
   */
  copyObject(object){
    return JSON.parse(JSON.stringify(object))
  },
  /**
   *
   * @param node  返回节点
   * @param execData 执行的流程数组
   * @returns {*}
   */
  handleBackNode(node, processData){
    let ret = null;
    let execData = processData.slice();
    // 判断上一节点是否在当前的返回列表中
    let backNodes = [];
    backNodes = node.includes(",") ?  node.split(",") : [node];
    function findBack() {
      if (execData.length > 0) {
        let lastNode = execData.pop();
        if (backNodes.includes(lastNode) == false) {
          findBack()
        } else {
          ret = lastNode
        }
      }
    }
    findBack();
    return ret;
  },
};
const boxToolkit = {
  notUsable: false, // 不可用

  // 流程节点
  isStart: "01", // 开始
  isEnd: "02", // 结束
  isBusing: "03", // 业务类型

  // 提交类型
  isDefaultType: "01", // 默认提交
  isOrderType: "02", // 订单提交
  isDefineType: "03", // 自定义提交
  isLocalType: "04", // 本地提交

  // 返回设置
  canRollBack: "01", // 可以回退
  disabledRollback: "02", // 不可回退
  // 是否保留数据
  clearIt: "01", // 清除数据
  keepIt: "02",  // 保留数据
};


export default class Toolkit {

  // 工具1
  static get matrix() {
    return matriToolkit;
  }

  // 工具2
  static get static() {
    return boxToolkit;
  }
}
