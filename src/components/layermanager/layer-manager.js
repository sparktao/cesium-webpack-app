import React, {useState, useEffect} from 'react'
import './layer-manager.css'
import { Tree } from 'antd'
import {
    loadServerTypeMap,
    deleteServerTypeMap
} from './layerControl'
import {CloseSquareOutlined} from '@ant-design/icons'
import * as TDT from '../../js/tdt_metadata'

const treeData = [
    {
        title: '基础数据',
        key: '0-0',
        children: [
            {
                title: '天地图影像地图',
                key: '0-0-1',
                layerurl: TDT.TDT_IMG_W,
                layerid: "BAS_TDT_IMG_W",
                layerIndex: 1,
                IsWebMercatorTilingScheme: true,
                type: 0,
                checked: true,                
                other: ''
            },
            {
                title: '天地图影像标注',
                key: '0-0-2',
                layerurl: TDT.TDT_CIA_W,
                layerid: "NAD_TDT_CIA_W",
                layerIndex: 2,
                IsWebMercatorTilingScheme: true,
                type: 0,
                checked: true,
                other: ''
            },
            {
                title: '国界服务',
                key: '0-0-3',
                layerurl: TDT.TDT_GJ_W,
                layerid: "NAD_TDT_GJ_W",
                layerIndex: 3,
                IsWebMercatorTilingScheme: true,
                type: 4,
                checked: true,
                other: ''
            }
        ]
    },
    {
        title: '业务标注数据',
        key: '0-1',
        children: [                
            {
                title: '水位站',
                key: 'river_points.kml',  // key值和layerurl的名称保持一致
                layerurl: "./Assets/myApp/data/river_points.kml",
                layerid: "NAD_SWZ",
                layerIndex: 50,
                IsWebMercatorTilingScheme:true,//是否创建摩卡托投影坐标系,默认是地理坐标系
                type: 6,
                checked: false,
                other: ''
            },
        ]
    },
    {
        title: '气象数据',
        key: '0-3',
        children: [                
            {
                title: '云图数据',
                key: '0-3-1',
                layerurl: "./Assets/myApp/Images/1.bmp",
                layerid: "NAD_YTSJ",
                layerIndex: 99,
                IsWebMercatorTilingScheme:true,//是否创建摩卡托投影坐标系,默认是地理坐标系
                type: 8,
                checked: false,
                other: [94.0107, -8.81, 147.105, 29.332]
            },
        ]
    },
    {
        title: '热力图',
        key: '0-4',
        children: [                
            {
                title: '热力图1',
                key: '0-4-1',
                layerurl: "./Assets/myApp/data/data.json",
                layerid: "NAD_RLT",
                layerIndex: 50,
                IsWebMercatorTilingScheme:true,//是否创建摩卡托投影坐标系,默认是地理坐标系
                type: 9,
                checked: false,
                other: [120.106188593, 21.9705713974, 121.951243931, 25.2954588893]
            },
        ]
    }
];


export default function LayerManager(props) {
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [checkedKeys, setCheckedKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    const [layerTreeData, setLayerTreeData] = useState([]);

    const viewer = props.viewer;
    
    useEffect(()=> {
        setLayerTreeData(treeData);
        initTreeData(treeData);
        setExpandedKeys(tempExpandedKeys);
        setCheckedKeys(tempCheckedKeys);
    },[])

    useEffect(()=>{
        
    },[props.show])

    var tempExpandedKeys = [], tempCheckedKeys = [];

    // 初始化地图图层数据，填充图层数据
    const initTreeData = (tdata) => {
        tdata.map(la => {
            // 判断layerurl属性不存在，即为文件夹
            if(!la.layerurl) {
                tempExpandedKeys.push(la.key);
                initTreeData(la.children);
            } else { //图层的情况下
                if(la.checked) {
                    tempCheckedKeys.push(la.key);
                    // 初始加载图层
                    loadServerTypeMap(viewer, la.key, la.type, la.layerurl, la.layerid, la.proxyUrl,la.IsWebMercatorTilingScheme,la.layerIndex,la.other);                    
                }
            }
        })
    } 

    const onLoad = (loadedKeys) => {
        console.log(loadedKeys)
        // console.log(e)
    }
  
    const onExpand = expandedKeys => {
        console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        setExpandedKeys(expandedKeys);
        setAutoExpandParent(false);
    };
  
    const onCheck = (checkedKeys, e) => {
        // console.log('onCheck', checkedKeys);
        console.log(e);
        setCheckedKeys(checkedKeys);
        if(e.checked) {
            // 如果是枝节点
            if(e.node.layerurl) {
                loadServerTypeMap(viewer, e.node.key, e.node.type, e.node.layerurl, e.node.layerid, e.node.proxyUrl,e.node.IsWebMercatorTilingScheme,e.node.layerIndex, e.node.other);             
            } 
            else { //如果是文件夹节点
                e.node.children.map(node => {
                    // 先全部清空图层
                    deleteServerTypeMap(viewer, node.key, node.type);                                       
                    // 再逐个添加图层 
                    loadServerTypeMap(viewer, node.key, node.type, node.layerurl, node.layerid, node.proxyUrl, node.IsWebMercatorTilingScheme,node.layerIndex, node.other);
                });
            }            
        }
        else if(e.checked === false) {
            // 如果是枝节点
            if(e.node.layerurl) {
                deleteServerTypeMap(viewer, e.node.key, e.node.type);              
            }
            else {
                // 删除树节点下面的所有子节点图层
                e.node.children.map(node => {
                    deleteServerTypeMap(viewer, node.key, e.node.type);
                });
            }
        }
    };
  
    const onSelect = (selectedKeys, info) => {
      console.log('onSelect', info);
      setSelectedKeys(selectedKeys);
    };

    return (
        <div className={props.show ? 'panel' : 'panel panel-hidden'}>
            <div className="panel-heading">
                <h4 className="panel-title">
                图层控制
                <span>
                    <CloseSquareOutlined onClick={props.closeMenu} />
                </span>
                </h4>
            </div>
            <div className="panel-body">
                <Tree
                    checkable
                    onExpand={onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onCheck={onCheck}
                    checkedKeys={checkedKeys}
                    onSelect={onSelect}
                    selectedKeys={selectedKeys}
                    treeData={layerTreeData}
                    />
            </div>
        </div>
    )

}