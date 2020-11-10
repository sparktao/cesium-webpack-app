import React, {useEffect, useState} from 'react'
import * as widget from 'cesium/Widgets/widgets.css'
import './App.css'
import Img from './Assets/myApp/Images/1.bmp'
import Img1 from './Assets/myApp/Images/waterNormals.jpg'
import Toolbar from './components/Toolbar'
import 'antd/dist/antd.css'
// import 'cesium-tdt'


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
            animation: false,
            timeline: false,
            geocoder: false,
            homeButton: false,
            navigationHelpButton: false,
            baseLayerPicker: false,
            fullscreenButton: false,
            shouldAnimate: true,
            infoBox: false,
            selectionIndicator: false,
            sceneModePicker: false,
            shadows: false,
            skyAtmosphere: false,
            // terrainProvider: Cesium.createWorldTerrain(),
        });

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

        // //  叠加地形服务
        // var terrainUrls = new Array()
        // var token = 'ebf64362215c081f8317203220f133eb';
        // // 服务域名
        // var tdtUrl = 'http://t{s}.tianditu.gov.cn/'
        // // 服务负载子域
        // var subdomains = ['0', '1', '2', '3', '4', '5', '6', '7']
        // for (var i = 0; i < subdomains.length; i++) {
        //     var url =
        //     tdtUrl.replace('{s}', subdomains[i]) +
        //     'DataServer?T=elv_c&tk=' +
        //     token
        //     terrainUrls.push(url)
        // }
    
        // var provider = new Cesium.GeoTerrainProvider({
        //     urls: terrainUrls,
        // })
    
        // viewer.terrainProvider = provider

        // 将三维球定位到中国
        // viewer.camera.flyTo({
        //     destination: Cesium.Cartesian3.fromDegrees(103.84, 31.15, 17850000), //中国区域
        //     orientation: {
        //         heading: Cesium.Math.toRadians(348.4202942851978),
        //         pitch: Cesium.Math.toRadians(-89.74026687972041),
        //         roll: Cesium.Math.toRadians(0),
        //     },
        //     complete: function callback() {
        //     // 定位完成之后的回调函数
        //     },
        // });

        SetMapViewer(viewer);

        var tileset = viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
              url: "./Assets/myApp/data/OBJMesh/tileset.json",
            })
          );
          
          tileset.readyPromise
            .then(function (tileset) {
              viewer.zoomTo(
                tileset,
                new Cesium.HeadingPitchRange(
                  0.5,
                  -0.2,
                  tileset.boundingSphere.radius * 4.0
                )
              );
            })
            .otherwise(function (error) {
              console.log(error);
            });
    }

    return (
        <>
            <div id="cesiumContainer"></div>
            {mapViewer ? (<Toolbar viewer={mapViewer}></Toolbar>) : null}
        </>
    );
}

export default App;
