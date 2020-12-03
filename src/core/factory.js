// 业务数据类
export class BusFactory {
  /**
   *
   * @param user     用户数据
   * @param platform 平台数据
   * @param indata   初始化配置数据
   * @param list     流程节点数据集合
   * @param flowType 流程类型
   * @param utils    流程公共函数
   */
  constructor(user, platform, indata, list, flowType, utils) {
    this.user = user;
    this.platform = platform;
    this.indata = indata;
    this.list = list;
    this.flowType = flowType;
    this.utils = utils;
  }

  /**
   * 设置初始化数据
   * @param indata
   */
  setIndata(indata) {
    this.indata = indata;
  }
}

// 操作数据类
export class OperateFactory {
  /**
   *
   * @param isUsable 是否可用
   * @param outflag  当前节点是否有响应页面
   * @param process  已执行的节点集合
   * @param nodes    已提交的节点数据
   */
  constructor(isUsable = false, outflag = false, process = [], nodes = []) {
    this.isUsable = isUsable;  // 可使用
    this.outflag = outflag;  // 提交标识
    // 流程当前的执行过程
    this.process = process;
    // 各个节点数据
    this.nodes = nodes;
  }

  /**
   * 设置流程是否可用
   * @param boolean
   */
  setUsable(boolean) {
    this.isUsable = boolean
  }
  /**
   * 节点加入到执行流程
   * @param nodeCode
   */
  pushProcess(nodeCode) {
    if (this.process.includes(nodeCode) == false) {
      this.process.push(nodeCode)
    }
  }

  /**
   * 设置执行流程
   * @param arr
   */
  setProcess(arr){
    this.process = arr || [];

  }
}




