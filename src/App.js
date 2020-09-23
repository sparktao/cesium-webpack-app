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
