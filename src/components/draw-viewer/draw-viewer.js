import React, {useState, useEffect} from 'react'
import {CloseSquareOutlined} from '@ant-design/icons'
import {Row, Col, Button, Form, Input} from 'antd'
import './draw-viewer.css'
import {checkComponent} from '../../js/utils'
import {CesiumPolygon} from '../shared/Graphic'
import GraphicManager from '../shared/GraphicManager'

const DrawViewerModel = {
    graphicManager: undefined
}

export default function DrawViewer(props) {
    const [data, setData] = useState({
        visible: true,
        editMode: false,
        graphicType: undefined,
        menuSelected: {},
        markerColor: "rgba(255, 255,255, 1)",
        fontSize: "28px",
        markerFont: "sans-serif",
        markerOptionsVisible: false,
        markerOption: "",
        lineColor: "rgba(247,224,32,1)",
        lineWidth: "3px",
        lineWidthList: [
            "1px",
            "2px",
            "3px",
            "4px",
            "5px",
            "6px",
            "8px",
            "10px",
            "12px"
        ],
        lineStyleList: [
            { value: "solid", name: "实线" },
            { value: "dash", name: "虚线" },
            { value: "glow", name: "发光线" },
            { value: "arrow", name: "箭头线" }
        ],
        lineStyle: "solid",
        graphicHeight: "GROUND_ADN_MODEL",
        //   lineHeight: "GROUND_ADN_MODEL",
        //   polygonHeight: "GROUND_ADN_MODEL",
        heightList: [
            { value: "GROUND_ADN_MODEL", name: "依附地形和模型" },
            { value: "GROUND", name: "依附地形" },
            { value: "MODEL", name: "依附模型" },
            { value: "NONE", name: "空间线" }
        ],
        outlineWidth: "3px",
        outlineColor: "rgba(247,224,32,1)",
        polygonColor: "rgba(247,224,32,0.5)",
        outline: true,
    });
    const viewer = props.viewer;
    DrawViewerModel.graphicManager = new GraphicManager(viewer);
    const graphicManager = DrawViewerModel.graphicManager;

    const menuAction = (menu) => {
        const graphic = ["MARKER", "POLYLINE", "POLYGON", "LABEL", "MODEL"];
        const bool = data.menuSelected[menu];
        
        // graphicManager && (graphicManager.tip.visible = false);
        if (bool) {
            setData({...data, 'menuSelected': {...data.menuSelected, menu: false}});
        } else {
            setData({...data, 'menuSelected': {...data.menuSelected, menu: true}});
        }

        let editMode = data.editMode;  
        if (graphic.includes(menu)) {
            if (data.graphicType === menu) {
                editMode = !editMode;
            } else {
                editMode = true;
            }
            setData({...data, 'graphicType': menu});
        } else {
            editMode = false;
        }
        setData({...data, 'editMode': editMode});
        // this.stopOthers(menu);
        if (/.*MODEL*/.test(data.graphicHeight)) {
          if (!["MARKER", "LABEL", "MODEL", "LAYER"].includes(menu))
            //依附模型
            //几何图形要依附于模型必须开启depthTestAgainstTerrain
            viewer.scene.globe.depthTestAgainstTerrain = true;
        } else {
          //viewer.scene.globe.depthTestAgainstTerrain = this._depthTestAgainstTerrain;
        }
        switch (menu) {
            case "MARKER":
                if (editMode) {
                    this.$refs.markerManager.pick("marker");
                } else {
                    this.$refs.markerManager.cancelMark();
                }
                break;
            case "POLYLINE":
                // this.heightList[3].name = "空间线";
                if (editMode) {
                    graphicManager.heightReference = data.graphicHeight;
                    graphicManager.material = Cesium.Color.fromCssColorString(
                        data.lineColor
                    );
                    graphicManager.createPolyline();
                } else {
                    graphicManager.destroyManager();
                }
    
                break;
            case "POLYGON":
                // this.heightList[3].name = "空间面";
                if (editMode) {
                    //   this.lineHeight=undefined
                    graphicManager.heightReference = data.graphicHeight;
                    const option = CesiumPolygon.defaultStyle;
                    option.outline = data.outline;
                    option.outlineColor = Cesium.Color.fromCssColorString(
                        data.outlineColor
                    );
                    option.outlineWidth = parseInt(data.outlineWidth);
                    // option.color = Cesium.Color.fromCssColorString(this.polygonColor);
                    graphicManager.material = Cesium.Color.fromCssColorString(
                        data.polygonColor
                    );
                    graphicManager.style = option;
                    graphicManager.createPolygon();
                } else {
                    graphicManager.destroyManager();
                }
    
                break;
            case "LABEL":
                if (editMode) {
                    this.$refs.markerManager.pick("label");
                } else {
                    this.$refs.markerManager.cancelMark();
                }
                break;
            case "MODEL":
                if (editMode) {
                    if (this.extendMarkerModel.length < 1) {
                        this.editMode = false;
                        throw new Error("没有可用的模型");
                    }
                    this.$refs.markerManager.setModel({ uri: this.selectedModel });
                    this.$refs.markerManager.pick("model");
                } else {
                    this.$refs.markerManager.cancelMark();
                }
        }
      }

    return (
        <div className={props.show ? 'panel' : 'panel panel-hidden'}>
            <div className="panel-heading">
                <h4 className="panel-title">
                标绘管理
                <span>
                    <CloseSquareOutlined onClick={props.closeMenu} />
                </span>
                </h4>
            </div>
            <div className="panel-body draw-viewer-panel">
                <Row justify="space-around">
                    <Col span={6}>
                        <span className="icon">
                            <svg t="1601272164615" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6163" width="32" height="32"><path d="M212.906667 85.333333h594.432c46.933333 0 84.906667 38.016 84.906666 84.906667v683.52a84.906667 84.906667 0 0 1-133.034666 69.973333l-250.965334-172.842666-246.741333 171.946666A84.906667 84.906667 0 0 1 128 853.205333V170.24C128 123.349333 166.016 85.333333 212.906667 85.333333z m292.437333 463.701334a17.066667 17.066667 0 0 1 13.312 0l92.672 39.168a17.066667 17.066667 0 0 0 23.637333-17.152l-8.661333-100.266667a17.066667 17.066667 0 0 1 4.138667-12.629333l65.877333-76.032a17.066667 17.066667 0 0 0-9.002667-27.776l-98.005333-22.741334a17.066667 17.066667 0 0 1-10.752-7.850666l-51.925333-86.186667a17.066667 17.066667 0 0 0-29.269334 0l-51.925333 86.186667a17.066667 17.066667 0 0 1-10.752 7.850666l-98.005333 22.741334a17.066667 17.066667 0 0 0-9.002667 27.776l65.877333 76.032a17.066667 17.066667 0 0 1 4.138667 12.629333l-8.661333 100.266667a17.066667 17.066667 0 0 0 23.637333 17.152l92.672-39.168z" p-id="6164"></path></svg>
                            标注
                        </span>
                    </Col>
                    <Col span={6}>
                        <span className="icon" onClick={()=>menuAction('POLYLINE')}>
                            <svg t="1601272039423" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4599" width="32" height="32"><path d="M901.177341 286.961652a122.925054 122.925054 0 0 0-122.79706 122.771461 122.361882 122.361882 0 0 0 36.785361 87.496426L671.454427 780.069797c-1.049548-0.20479-2.099095-0.307185-3.123044-0.460777l-93.512124-549.348533a122.848258 122.848258 0 0 0 63.561622-107.489026A122.899455 122.899455 0 0 0 515.60942 0a122.899455 122.899455 0 0 0-122.797061 122.745863c0 25.496325 7.80761 49.175141 21.144543 68.809359L168.79796 504.038798a122.336283 122.336283 0 0 0-46.0009-8.985151A122.950652 122.950652 0 0 0 0 617.825109a122.925054 122.925054 0 0 0 122.771461 122.79706 122.899455 122.899455 0 0 0 122.771462-122.79706c0-24.497975-7.244438-47.332033-19.685416-66.531074L472.040398 237.504925c9.522724 3.635018 19.634218 6.118094 30.104095 7.270036l93.153742 547.300635a122.745863 122.745863 0 0 0-66.659067 109.101745c0 67.734213 55.062847 122.771461 122.771461 122.771462s122.79706-55.037248 122.797061-122.771462a122.387481 122.387481 0 0 0-36.785361-87.522024l143.711214-282.814659a122.873856 122.873856 0 0 0 142.789661-121.107545 122.873856 122.873856 0 0 0-122.745863-122.771461zM515.60942 74.057097a48.714364 48.714364 0 0 1 0 97.40313 48.79116 48.79116 0 0 1-48.714365-48.714364c0-26.853057 21.835708-48.688766 48.714365-48.688766zM122.771461 666.539473a48.765562 48.765562 0 0 1-48.714364-48.714364c0-26.827459 21.861307-48.663167 48.714364-48.663167s48.714364 21.861307 48.714365 48.663167a48.739963 48.739963 0 0 1-48.714365 48.714364z m528.639168 283.352232a48.765562 48.765562 0 0 1-48.688765-48.714364 48.739963 48.739963 0 0 1 97.428728 0 48.79116 48.79116 0 0 1-48.739963 48.714364z m249.766712-491.469826a48.714364 48.714364 0 0 1 0-97.377531c26.853057 0 48.688766 21.861307 48.688766 48.688765s-21.835708 48.688766-48.688766 48.688766z" p-id="4600" fill="#1296db"></path></svg>
                            画线    
                        </span>
                    </Col>
                    <Col span={6}>
                        <span className="icon" onClick={()=>menuAction('POLYGON')}>
                            <svg t="1601272250825" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9535" width="32" height="32"><path d="M950.044444 750.933333l-204.8-477.866666c34.133333-5.688889 56.888889-34.133333 56.888889-73.955556 0-39.822222-34.133333-73.955556-73.955555-73.955555-34.133333 0-62.577778 22.755556-68.266667 56.888888L142.222222 290.133333c-5.688889-34.133333-34.133333-56.888889-68.266666-56.888889-39.822222 0-73.955556 28.444444-73.955556 68.266667s22.755556 68.266667 56.888889 73.955556v324.266666c-34.133333 5.688889-56.888889 34.133333-56.888889 73.955556 0 39.822222 34.133333 73.955556 73.955556 73.955555 34.133333 0 62.577778-22.755556 68.266666-56.888888l722.488889 51.2c5.688889 34.133333 34.133333 56.888889 68.266667 56.888888 28.444444 5.688889 56.888889-5.688889 73.955555-28.444444 17.066667-22.755556 17.066667-51.2 5.688889-79.644444-5.688889-22.755556-34.133333-39.822222-62.577778-39.822223zM113.777778 711.111111V364.088889l11.377778-11.377778 546.133333-102.4 11.377778 11.377778 204.8 506.311111c-5.688889 5.688889-11.377778 11.377778-11.377778 17.066667l-745.244445-56.888889-17.066666-17.066667z m0 0" p-id="9536" fill="#f4ea2a"></path></svg>
                            画面   
                        </span>
                    </Col>
                    <Col span={6}>
                        <span className="icon">
                            <svg t="1601024629115" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10892" width="32" height="32"><path d="M150 512c0 199.928 162.073 362 362 362 199.928 0 362-162.072 362-362 0-199.927-162.072-362-362-362-199.927 0-362 162.073-362 362z m551.458 194.79s-4.18 11.288-9.774 0c0 0-62.396-196.895-214.501-147.301V620.6s-2.436 35.937-32.416 12.538L295.195 498.147s-31.724-18.035 1.909-42.716l151.151-135.784s22.708-16.948 28.204 10.86l0.164 65.95S760.135 410.674 701.46 706.79z" p-id="10893" fill="#f4ea2a"></path></svg>
                            清除
                        </span>
                    </Col>
                </Row>
            </div>
        </div>
    )

}