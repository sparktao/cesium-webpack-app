import React, {useEffect, useState} from 'react'
import * as Cesium from 'cesium/Cesium';
import './App.css'
import * as widget from 'cesium/Widgets/widgets.css'
import Img from './Assets/myApp/Images/1.bmp'
import Toolbar from './components/Toolbar'
import 'antd/dist/antd.css'


function App() {
    const [mapViewer, SetMapViewer] = useState();

    useEffect(()=>{
        initMap();
    }, [])

    const initMap = () =>  {
        // TODO: Add your ion access token from cesium.com/ion/
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1ZTYyYTU4Ny1lZmI0LTRlMDktYjYwZS1kODY5NTJjNjg5NzAiLCJpZCI6MzQzMDEsImlhdCI6MTYwMDEzNzM4NX0.-RUvFxdBEsgu6LgICTeeEhVLpcsW03e6XCItn6I6Os0';

        // cesium 初始化
        var viewer = new Cesium.Viewer('cesiumContainer', {
            shouldAnimate: true,
            selectionIndicator: true,
            //Hide the base layer picker
            baseLayerPicker : false,
        });

        var token = 'ebf64362215c081f8317203220f133eb';
        // // 服务域名
        var tdtUrl = 'http://t{s}.tianditu.gov.cn/'
        // // 服务负载子域
        var subdomains = ['0', '1', '2', '3', '4', '5', '6', '7']

        // //在线天地图影像服务地址(墨卡托投影)
        // var TDT_IMG_W = "http://t{s}.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
        //     "&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
        //     "&style=default&format=tiles&tk=" + token;
        // //在线天地图矢量地图服务(墨卡托投影) 
        // var TDT_VEC_W = "http://t{s}.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
        //     "&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
        //     "&style=default&format=tiles&tk=" + token;
        // //在线天地图影像中文标记服务(墨卡托投影)  
        // var TDT_CIA_W = "http://t{s}.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
        //     "&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
        //     "&style=default.jpg&tk=" + token
        // //在线天地图矢量中文标记服务(墨卡托投影)            
        // var TDT_CVA_W = "http://t{s}.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
        //     "&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
        //     "&style=default.jpg&tk=" + token;
        // //在线天地图地形服务(墨卡托投影) 
        // var TDT_TER_C = "http://t{s}.tianditu.gov.cn/ter_c/wmts?service=wmts&request=GetTile&version=1.0.0" +
        //     "&LAYER=ter&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
        //     "&style=default.jpg&tk=" + token;

        // let imgMap = new Cesium.WebMapTileServiceImageryProvider({   //调用影响中文服务
        //     url: TDT_IMG_W,//url地址
        //     layer: "img_w",	//WMTS请求的层名称
        //     style: "default",//WMTS请求的样式名称
        //     format: "tiles",//MIME类型，用于从服务器检索图像
        //     tileMatrixSetID: "GoogleMapsCompatible",//	用于WMTS请求的TileMatrixSet的标识符
        //     subdomains: subdomains,//天地图8个服务器
        //     minimumLevel: 0,//最小层级
        //     maximumLevel: 18,//最大层级
        // })

        // viewer.imageryLayers.addImageryProvider(imgMap)//添加到cesium图层上

        // let ciaMap = new Cesium.WebMapTileServiceImageryProvider({   //调用影响中文注记服务
        //     url: TDT_CIA_W,
        //     layer: "cia_w",
        //     style: "default",
        //     format: "tiles",
        //     tileMatrixSetID: "GoogleMapsCompatible",
        //     subdomains: subdomains,//天地图8个服务器
        //     minimumLevel: 0,
        //     maximumLevel: 18,
        // })

        // viewer.imageryLayers.addImageryProvider(ciaMap)//添加到cesium图层上

        // 抗锯齿
        viewer.scene.postProcessStages.fxaa.enabled = false;
        // 水雾特效
        viewer.scene.globe.showGroundAtmosphere = true;
        // 设置最大俯仰角，[-90,0]区间内，默认为-30，单位弧度
        viewer.scene.screenSpaceCameraController.constrainedPitch = Cesium.Math.toRadians(
            -20
        );
        // 取消默认的双击事件
        viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
            Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
        )

        // 叠加国界服务
        var iboMap = new Cesium.UrlTemplateImageryProvider({
            url: tdtUrl + 'DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=' + token,
            subdomains: subdomains,
            tilingScheme: new Cesium.WebMercatorTilingScheme(),
            maximumLevel: 10,
        });
        viewer.imageryLayers.addImageryProvider(iboMap);

        // 将三维球定位到中国
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(103.84, 31.15, 17850000),
            orientation: {
            heading: Cesium.Math.toRadians(348.4202942851978),
            pitch: Cesium.Math.toRadians(-89.74026687972041),
            roll: Cesium.Math.toRadians(0),
            },
            complete: function callback() {
            // 定位完成之后的回调函数
            },
        });
        // 添加气象云图
        // var layers = viewer.scene.imageryLayers;
        // layers.addImageryProvider(new Cesium.SingleTileImageryProvider({
        //     url : "./Assets/myApp/Images/1.bmp",
        //     rectangle : Cesium.Rectangle.fromDegrees(94.0107, -8.81, 147.105, 29.332)
        // }));

        SetMapViewer(viewer);
    }

    return (
        <>
            <div id="cesiumContainer"></div>
            {mapViewer ? (<Toolbar viewer={mapViewer}></Toolbar>) : null}
        </>
    );
}

export default App;
