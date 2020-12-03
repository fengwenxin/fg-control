import {BusFactory, OperateFactory} from './factory';
import Toolkit from './toolkit';

class Getting {
  constructor() {
    // 业务数据
    this.busdata = null;
    // 操作数据
    this.operdata = null;
  }
  getUsable(){
    return this.operdata.isUsable
  }
  /**
   * 开始节点
   * @returns {*}
   */
  getStart() {
    const busdata = this.busdata.list;
    const result = this._find(busdata, item => item.type == Toolkit.static.isStart)
    return result || {}
  }

  /**
   * 结束节点
   * @returns {*}
   */
  getEnd() {
    const busdata = this.busdata.list;
    const result = this._find(busdata, item => item.type == Toolkit.static.isEnd)
    return result || {}
  }

  // 返回初始化启动数据
  getStartSet(_this,initFunc, request) {
    if (initFunc) {
      return Toolkit.matrix.solveInitDataConfigJs(_this, this.busdata, initFunc, request)
    } else {
      return Promise.resolve({})
    }
  }

  /**
   * 获取节点数据
   * @param nodeCode
   * @returns {*}
   */
  getNodeData(nodeCode) {
    const busdata = this.busdata.list;
    const result = this._find(busdata, item => item.nodeCode == nodeCode)
    return result || {}
  }
  /**
   * 获取所有节点数据
   * @returns {*}
   */
  getNodes() {
    return this.operdata.nodes;
  }
  /**
   * 获取执行流程
   * @returns {Array}
   */
  getProcess() {
    console.warn('process',this.operdata.process)
    return this.operdata.process || [];
  }

  /**
   * 判断执行节点
   * @param nextNodes
   * @returns {string}
   */
  findNext(nextNodes) {
    const _this = this;
    let findNextNode = ""; // 最终要执行的节点
    if (!nextNodes) {
      throw new Error('没有传递节点')
    }
    if (nextNodes.includes(",")) {
      try {
        // 多节点
        const nodes = nextNodes.split(",");
        for (let j = 0; j < nodes.length; j++) {
          let nodeId = nodes[j];
          const nextFlow = _this._find(this.busdata.list, item => item.nodeCode == nodeId);
          if (_this.checkHandler(nextFlow["checkStart"])) {
            findNextNode = nextFlow["nodeCode"];
            break;
          } else {
            console.log('checkHandler error:', nextFlow["checkStart"])
          }
        }
      } catch (error) {
        throw new Error(error);
      }
    } else {
      // 单节点
      findNextNode = nextNodes;
    }
    return findNextNode;
  }

  /**
   * 查找数据
   * @param callback
   * @returns {*}
   * @private
   */
  _find(listdata, callback) {
    return listdata.find(callback)
  }
}

class Grid extends Getting {
  constructor() {
    super()
  }

  /**
   * 检查节点能否执行
   * @param checkstart
   * @returns {*}
   */
  checkHandler(checkstart) {
    if (checkstart) {
      return Toolkit.matrix.solveStartConfigJs(this.busdata, this.operdata, checkstart)
    }
    return true
  }
  /**
   * 创建业务和操作数据
   * @param user
   * @param platform
   * @param res
   */
  build(user, platform, res) {
    let flow = Toolkit.matrix.getFlow(res);
    const {list, flowType, utils} = flow;
    let indata = Object.create(null);
    this.busdata = new BusFactory(user, platform, indata, list, flowType, utils);

    let isUsable = false;
    let outflag  = false;
    let process  = [];
    let nodes    = [];
    this.operdata= new OperateFactory(isUsable, outflag, process, nodes);
  }

  /**
   * 保存节点数据
   * @param nodeCode
   * @param value
   */
  setNode(nodeCode, value) {
    this.operdata.nodes[nodeCode] = value;
    // console.log('nodes', JSON.stringify(this.operdata.nodes))
  }

  // 设置提交标识
  setOutFlag(boolean) {
    this.operdata.outflag = boolean
  }

  /**
   *  设置流程是否可用
   * @param boolean
   */
  setUsable(boolean) {
    this.operdata.setUsable(boolean)
  }

  /**
   * 保存执行流程
   * @param nodeCode
   */
  pushProcess(nodeCode) {
    this.operdata.pushProcess(nodeCode)
  }

  /**
   *
   * @param arr
   */
  setProcess(arr){
    this.operdata.setProcess(arr || [])
  }

  /**
   * 保存节点数据
   * @param data
   * @param response
   * @param nodeCode
   */
  saveNodeData(data, response, nodeCode) {
    const Obj = {
      up: data,
      down: {...response, rspCode: "SP000000"}
    };
    console.log("通信提交响应数据：" + JSON.stringify(Obj));
    const copyObj = Toolkit.matrix.copyObject(Obj);
    this.setNode(nodeCode, copyObj);
  }
  // 取消流程
  destroyGrid() {
    console.log('destory...')
    const keys = Object.keys(this.operdata.nodes);
    keys.forEach(key => {
      delete this.operdata.nodes[key];
    });
    this.operdata.isUsable = false;
  }
}

export default Grid

