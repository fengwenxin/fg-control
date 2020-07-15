/**
 * 流控引擎
 */
class FG {
    constructor() {

        this.ISOK = false;
        // this.CURFORM= null;   // 当前展示的是input_config_code 还是 output_config_code 表单
        this.OUTFLAG= null;   // 提交标识
        // 流程节点
        this.START = "01"; // 开始
        this.END   = "02"; // 结束
        this.DOING = "03"; // 业务类型
        // 提交方式
        this.COMMIT_DEFAULT = "01"; // 默认提交
        this.COMMIT_DEFINE  = "02"; // 自定义提交
        this.COMMIT_ORDER   = "03"; // 订单提交
        this.COMMIT_LOCAL   = "04"; // 本地提交
        // 返回设置
        this.CAN_ROLLBACK = "01"; // 可以回退
        this.CANNOT_ROLLBACK = "02"; // 不可回退
        // 是否保留数据
        this.CLEAR_DATA = "01", // 清除数据
            this.KEEP_DATA = "02",  // 保留数据

            // 数据
            this.user = {};
        this.platform =  {};
        this.nodes =  {};
        this.list =  {};
        this.utils =  {};
        // 流程当前的执行过程
        this.process = [];
    }

    /**
     * 开始节点
     * @returns {*}
     */
    getStartNode(){
        if(this.list.length == 0){
            return {}
        }
        return this.list.filter(item => item.type == this.START)[0]
    }

    /**
     * 结束节点
     * @returns {*}
     */
    getEndNode(){
        if(this.list.length == 0){
            return {}
        }
        return this.list.filter(item => item.type == this.END)[0]
    }
    /**
     * 设置数据
     * @param object
     */
    setData(key,value){
        this[key] = value;
    }

    /**
     * 检查节点能否执行
     * @param checkstart
     * @returns {*}
     */
    checkStart(checkstart) {
        if(checkstart){
            return this._solveConfigJs(checkstart)
        }
        return true;
    }

    /**
     * 处理公共函数js代码
     * @param JsCode
     * @returns {any}
     * @private
     */
    solveCommonJS(JsCode){
        try {
            return eval(JsCode)
        }catch (error) {
            console.log('===commonJs===',JsCode)
            throw  new Error(error)
        }
    }

    /**
     * 处理配置数据js代码
     * @param inputConfigJs
     * @returns {*}
     * @private
     */
    _solveConfigJs(JsCode){
        try {
            const platform = this.platform;
            const user = this.user;
            const nodes = this.nodes;
            const utils = this.utils;
            console.log('{ platform, user, nodes, utils} ',{ platform, user, nodes, utils} )
            const resCode = `function _execute(user, platform, nodes, utils){  ${JsCode}  return main(...arguments);}`;
            // console.log('resCode',resCode)
            const exeCode = eval("(" + resCode + ")");
            let rs = exeCode(user, platform, nodes, utils);
            return rs;
        } catch (error) {
            console.log('===inputConfigJs===',JsCode)
            throw new Error(error)
        }
    }

    /**
     * 过滤数据
     * @param node_code
     * @returns {*}
     * @private
     */
    _filter(node_code) {
        return this.list.filter(item => item.nodeCode == node_code);
    }

    /**
     * 下一节点
     * @param next_node
     * @returns {*}
     */
    getNext(next_node) {
        console.log('next_node', next_node)
        if (next_node) {
            const next = this._filter(next_node);
            if (next instanceof Array && next.length > 0) {
                return next[0];
            }
        }
    }

    /**
     * 节点数据
     * @param nodeCode
     * @returns {*}
     */
    getNodeData(nodeCode){
        return this._filter(nodeCode)[0];
    }

    /**
     * 保存节点数据
     * @param nodeCode
     * @param value
     */
    saveNode(nodeCode, value) {
        this.nodes[nodeCode] = value;
        console.log('nodes', JSON.stringify(this.nodes))
    }

    /**
     * 获取所有节点数据
     * @returns {{}|*}
     */
    getNodes(){
        return this.nodes;
    }

    /**
     * 节点加入到执行流程
     * @param nodeCode
     */
    pushProcess(nodeCode){
        if(this.process.includes(nodeCode)){
            return
        }
        this.process.push(nodeCode)
    }

    /**
     * 获取执行流程
     * @returns {Array}
     */
    getProcess(){
        return this.process;
    }

    /**
     * 删除最后一个元素
     */
    popProcess(){
        this.process.pop()
    }
}

// 返回单例
let getFG = (function () {
    let fee
    return function () {
        if (!fee) {
            fee = new FG();
        }
        return fee
    }
})()

export default getFG;
