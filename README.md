

> fg-control介绍

```
    fg-control 内部编码是一个类，返回一个单例
```

> fg-control安装方法

```
npm install fg-control
```

> fg-control使用方法
```
import getFG from 'fg-control'

const FG = new getFG();
```




> fg-control挂载的基础数据

流程状态  | 名称  | 类型 | 默认值
---|---|---|---
ISOK | 流程是否可用  | Boolean | false
OUTFLAG  | 提交/响应标识  | Boolean | false


节点类型  | 名称  | 类型 | 默认值
---|---|---|---
START | 开始节点  | string | 01
END  | 结束节点  | string | 02
DOING | 表单节点  | string | 03



提交方式  | 名称  | 类型 | 默认值
---|---|---|---
COMMIT_DEFAULT | 默认提交  | string | 01
COMMIT_DEFINE  | 自定义提交  | string | 02
COMMIT_ORDER | 订单提交  | string | 03
COMMIT_LOCAL | 本地提交  | string | 04



返回设置  | 名称  | 类型 | 默认值
---|---|---|---
CAN_ROLLBACK | 可以回退  | String | 01
CANNOT_ROLLBACK  | 不可回退  | String | 02

是否保留数据  | 名称  | 类型 | 默认值
---|---|---|---
CLEAR_DATA | 清除数据  | String | 01
KEEP_DATA  | 保留数据  | String | 02


存储公共信息  | 名称  | 类型 | 默认值
---|---|---|---
user | 用户数据  | Object | {}
platform  | 平台数据  | Object | {}
nodes | 节点数据  | Array | []
list  | 流程数据  | Array | []
utils | 公共函数  | Object | {}
process  | 执行过程  | Array | []


> fg-control挂载方法

方法名  | 说明  | 参数
---|---|---
getStartNode | 开始节点  |  
getEndNode  | 结束节点  |  
setData | 设置数据  | key,vlaue 
checkStart  | 检查节点能否执行  | jsCode 
solveCommonJS | 处理公共函数js代码  | jsCode 
getNext  | 下一节点  | nodeCode:节点
getNodeData  | 节点数据  | nodeCode:节点
saveNode  | 保存节点数据  | nodeCode, value：节点对象
getNodes  | 获取所有节点数据  | 
pushProcess  | 节点加入到执行流程  | nodeCode:节点
getProcess  | 获取执行流程  | 
popProcess  | 删除执行流程最后一个元素  | 






