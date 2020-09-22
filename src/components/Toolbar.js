import React, {useState, useEffect} from 'react'
import * as Cesium from 'cesium/Cesium'
import { Tree } from 'antd'
import './Toolbar.css'
import {
    loadServerTypeMap,
    deleteServerTypeMap
} from './layerControl'
import {CloseSquareOutlined} from '@ant-design/icons'
import * as TDT from '../js/tdt_metadata'

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
                IsWebMercatorTilingScheme: true,
                type: 0,
                checked: true,
                other: ''
            }
        ]
    },
    {
        title: '气象数据',
        key: '0-1',
        children: [                
            {
                title: '云图数据',
                key: '0-1-1',
                layerurl: "./Assets/myApp/Images/1.bmp",
                layerid: "NAD_YTSJ",
                IsWebMercatorTilingScheme:true,//是否创建摩卡托投影坐标系,默认是地理坐标系
                type: 8,
                checked: false,
                other: '94.0107, -8.81, 147.105, 29.332'
            },
        ]
    }
];

export default function Toolbar(props) {

    const [expandedKeys, setExpandedKeys] = useState([]);
    const [checkedKeys, setCheckedKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    const [layerDatas, setLayerDatas] = useState([]);
    const [layerTreeData, setLayerTreeData] = useState([]);
    const [layerManagerVisibility, SetLayerManagerVisibility] = useState(false);
    const viewer = props.viewer;

    useEffect(()=> {
        setLayerTreeData(treeData);
        initTreeData(treeData);
        setExpandedKeys(tempExpandedKeys);
        setCheckedKeys(tempCheckedKeys);
        setLayerDatas(tempLayerDatas);

    },[])

    var tempExpandedKeys = [], tempCheckedKeys = [], tempLayerDatas = [];

    const initTreeData = (tdata) => {
        tdata.map(la => {
            console.log(la)
            // 判断layerurl属性不存在，即为文件夹
            if(!la.layerurl) {
                tempExpandedKeys.push(la.key);
                initTreeData(la.children);
            } else { //图层的情况下
                if(la.checked) {
                    tempCheckedKeys.push(la.key);
                    // 初始化图层
                    var curlayerData = loadServerTypeMap(viewer, la.key, la.type, la.layerurl, la.layerid, la.proxyUrl,la.IsWebMercatorTilingScheme, la.other);
                    tempLayerDatas.push(curlayerData);
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
        // console.log(e);
        setCheckedKeys(checkedKeys);
        if(e.checked && e.node) {
            var curlayerData = loadServerTypeMap(viewer, e.node.key, e.node.type, e.node.layerurl, e.node.layerid, e.node.proxyUrl,e.node.IsWebMercatorTilingScheme, e.node.other);
            setLayerDatas([...layerDatas, curlayerData]);
        }
        else if(e.checked === false) {
            deleteServerTypeMap(viewer, layerDatas, e.node.key);
        }

    };
  
    const onSelect = (selectedKeys, info) => {
      console.log('onSelect', info);
      setSelectedKeys(selectedKeys);
    };

    
    
    const fly2HomeView = () => {
        // 将三维球定位到中国
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(103.84, 31.15, 17850000),
            orientation: {
                heading: Cesium.Math.toRadians(348.4202942851978),
                pitch: Cesium.Math.toRadians(-89.74026687972041),
                roll: Cesium.Math.toRadians(0),
            }
        });
    }
    
    const toggleDownLayerManager = () => {
        SetLayerManagerVisibility(!layerManagerVisibility);
    }

    const closeLayerManager = () => {
        SetLayerManagerVisibility(false);
    }

    return (
        <>
            <div className="app-toolbar">
                <button className="cesium-toolbar-button cesium-button" onClick={fly2HomeView}>
                    <svg className="cesium-svgPath-svg" width="28" height="28" viewBox="0 0 28 28"><path d="M14,4l-10,8.75h20l-4.25-3.7188v-4.6562h-2.812v2.1875l-2.938-2.5625zm-7.0938,9.906v10.094h14.094v-10.094h-14.094zm2.1876,2.313h3.3122v4.25h-3.3122v-4.25zm5.8442,1.281h3.406v6.438h-3.406v-6.438z"></path></svg>
                </button>
                
                <button className="cesium-toolbar-button cesium-button" onClick={toggleDownLayerManager}>
                    <svg t="1600757667604" className="cesium-svgPath-svg" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7282" width="32" height="32"><path d="M942.933 311.467l-384-192c-25.6-17.067-55.466-17.067-81.066 0l-384 192c0 4.266-4.267 8.533-8.534 8.533-4.266 17.067 0 34.133 12.8 38.4l136.534 68.267-115.2 59.733c-12.8 8.533-21.334 21.333-21.334 34.133 0 12.8 8.534 29.867 21.334 34.134l98.133 51.2-98.133 51.2c-12.8 8.533-21.334 21.333-21.334 34.133 0 12.8 8.534 29.867 21.334 34.133l358.4 179.2c12.8 8.534 25.6 12.8 38.4 12.8 12.8 0 29.866-4.266 42.666-12.8l358.4-179.2c12.8-8.533 21.334-21.333 21.334-34.133 0-12.8-8.534-29.867-21.334-34.133l-98.133-51.2 98.133-51.2c12.8-8.534 21.334-21.334 21.334-34.134s-8.534-29.866-21.334-34.133L806.4 426.667 942.933 358.4c4.267-4.267 8.534-4.267 8.534-8.533 4.266-17.067 0-34.134-8.534-38.4zM861.867 691.2L533.333 857.6c-8.533 4.267-17.066 4.267-25.6 0L179.2 691.2l106.667-55.467 196.266 98.134c12.8 8.533 25.6 12.8 38.4 12.8 12.8 0 29.867-4.267 42.667-12.8l196.267-98.134 102.4 55.467z m0-170.667L755.2 576l-64 29.867-162.133 81.066c-8.534 4.267-17.067 4.267-25.6 0l-162.134-81.066-64-29.867-106.666-55.467 128-64L482.133 550.4c25.6 17.067 55.467 17.067 81.067 0l183.467-93.867 115.2 64z" p-id="7283"></path></svg>
                </button>
            </div>

            <div className={layerManagerVisibility ? 'panel' : 'panel panel-hidden'}>
                <div className="panel-heading">
                    <h4 className="panel-title">
                    图层控制
                    <span>
                        <CloseSquareOutlined onClick={closeLayerManager} />
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
        </>
    );
}