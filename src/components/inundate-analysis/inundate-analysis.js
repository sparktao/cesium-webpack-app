import React, {useState, useEffect} from 'react'
import {CloseSquareOutlined} from '@ant-design/icons'
import {Row, Col, Button, Form, Input} from 'antd'
import './inundate-analysis.css'
import SubmergenceAnalysis from './SubmergenceAnalysis'
import WaterShader from './water-shader'
import {CesiumPolygon} from '../shared/Graphic'
import GraphicManager from '../shared/GraphicManager'


var ia_graphicManager = null;

export default function InnudateAnalysis(props) {
    const [panelVisibility, SetPanelVisibility] = useState(false);
    const [extraPanelVisibility, SetExtraPanelVisibility] = useState(false);
    const [waterShader, SetWaterShader] = useState(null);    
    const viewer = props.viewer;
    ia_graphicManager = new GraphicManager(viewer);
    ia_graphicManager.floodArea = {
        id: undefined,
        pts: []
    };
    ia_graphicManager.sa = null;
    
    useEffect(()=>{
        document.addEventListener("addEvent", function(e) {
            ia_graphicManager.floodArea = {id: e.detail.gvid, pts: []};            
        });
        document.addEventListener("stopEdit", function() {
            // 设置为地形影响
            // viewer.scene.globe.depthTestAgainstTerrain = true;
            console.log(ia_graphicManager.floodArea)
            ia_graphicManager.floodArea = {
                id: ia_graphicManager.floodArea.id, 
                pts: ia_graphicManager.get(ia_graphicManager.floodArea.id).coordinates()[0]
            };
        });
    },[]);
    
    const toggleDownPanelVisibility = () => {
        SetPanelVisibility(!panelVisibility);
    }

    const closePanel = () => {
        SetPanelVisibility(false);
    }

    const initAnalysis = () => {
        viewer.camera.flyTo({
            //scene.camera.setView({
                // 摄像头的位置
                destination: Cesium.Cartesian3.fromDegrees(108.9, 34, 5000.0),
                orientation: {
                    heading: Cesium.Math.toRadians(0.0),//默认朝北0度，顺时针方向，东是90度
                    pitch: Cesium.Math.toRadians(-20),//默认朝下看-90,0为水平看，
                    roll: Cesium.Math.toRadians(0)//默认0
                }
        });
        viewer.skyAtmosphere = false
        SetExtraPanelVisibility(true)
    }

    const beginAnalysis = (values) => {
        console.log(values)        
        var tempArray = [];
        ia_graphicManager.floodArea.pts.forEach((pt) => {
            tempArray = [...tempArray, pt[0], pt[1]];
        });
        ia_graphicManager.removeAll();
        // 设置淹没区域多边形受地形影响
        viewer.scene.globe.depthTestAgainstTerrain = true;
        ia_graphicManager.sa = 
            new SubmergenceAnalysis(viewer, true, values.maxHeight, values.minHeight, values.step, true, tempArray, values.speed);
        ia_graphicManager.sa.start();
    }

    /**
     * 开始绘制洪水范围，多边形方式
     */ 
    const drawFloodArea = () => {
        // 设置多边形不受地形影响
        viewer.scene.globe.depthTestAgainstTerrain = false;
        ia_graphicManager.heightReference = 3;
        const option = CesiumPolygon.defaultStyle;
        ia_graphicManager.material = Cesium.Color.fromCssColorString(
            '#67ADDF'
        );
        ia_graphicManager.style = option;
        ia_graphicManager.createPolygon();
    }
    /**
     * 清除淹没效果
     */
    const clearFloodArea = () => {
        ia_graphicManager.removeAll();
        if(ia_graphicManager.sa !== null) {
            ia_graphicManager.sa.remove();
        }
    }

    function drawShape(position, drawMode) {
        console.log(position)
        const entity = drawMode=='line'?
          viewer.entities.add({
            polyline:{
              positions:position,
              width:3,
              material: new Cesium.ColorMaterialProperty(Cesium.Color.RED.withAlpha(0.8)),
              clampToGround: true
    
            }
          }):
          viewer.entities.add({
            polygon:{
              hierarchy:position,
              material: new Cesium.ColorMaterialProperty(Cesium.Color.RED.withAlpha(0.3)),
              //material: new Cesium.ColorMaterialProperty(new Cesium.Color(205, 139, 14, 1)),
              outline: true,
              outlineColor: Cesium.Color.BLACK,
              outlineWidth:3
            }
          })
          viewer.entities.add(entity)
        return entity
        //viewer.entities.add(entity)
    }

    //绘制水面波浪效果
    const drawWater =  () => {
        if(waterShader === null) {
            let tempWaterShader = new WaterShader(viewer);           
            tempWaterShader.clearAll(false);
            tempWaterShader.drawWater();

            SetWaterShader(tempWaterShader);  
        } else {
            waterShader.clearAll(false);
            waterShader.drawWater();
        }      
    }

    // 清除水面波浪效果
    const clearAll = () => {
        if(waterShader) {
            waterShader.clearAll()
        }

        SetExtraPanelVisibility(false)
    }
  

    return (
        <>
            <button className="cesium-toolbar-button cesium-button" onClick={toggleDownPanelVisibility}>
                <svg t="1601017114611" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3163" width="32" height="32"><path d="M609.28 789.504c23.04 0 46.08 7.68 64 21.504l35.84 27.136c11.776 9.216 29.184 9.216 40.96 0l35.84-27.136c18.432-13.824 40.96-21.504 64.512-21.504s45.568 7.68 64.512 21.504l36.352 27.136c15.872 12.288 18.944 34.816 6.656 50.688-12.288 15.872-34.816 18.944-50.688 7.168l-35.84-27.136c-11.264-9.216-28.672-9.216-40.96 0l-35.84 27.136c-18.432 13.824-40.96 21.504-64.512 21.504-23.04 0-45.568-7.68-64.512-21.504l-35.84-27.136c-12.288-9.216-28.672-9.216-40.96 0l-35.84 27.136c-18.432 14.336-41.472 21.504-64.512 21.504s-46.08-7.68-64.512-21.504l-35.84-27.136c-11.264-9.216-29.184-9.216-40.96 0l-35.84 27.136c-18.432 13.824-40.96 21.504-64.512 21.504-23.04 0-45.568-7.68-64.512-21.504l-35.84-27.136c-12.288-9.216-28.672-9.216-40.96 0l-47.104 35.84c-15.36 11.776-38.912 8.704-50.688-7.168a38.4 38.4 0 0 1-7.168-26.624c1.024-9.728 6.144-17.92 13.824-24.064l47.104-35.84c18.432-13.824 40.96-21.504 64.512-21.504s45.568 7.68 64.512 21.504l35.84 27.136c11.776 8.704 29.184 8.704 40.96 0l35.84-27.136c18.432-13.824 40.96-21.504 64-21.504s46.08 7.68 64.512 21.504l35.84 27.136c11.264 8.704 29.184 9.216 40.96 0l35.84-27.136c19.456-13.824 41.984-21.504 65.024-21.504zM463.872 69.12l5.632 2.048 553.472 203.776-2.048 5.12-128 356.352c13.312 3.584 24.576 9.216 33.792 16.384l35.84 27.136c7.68 5.632 12.8 14.848 13.824 24.064 1.024 9.216-1.536 18.944-7.168 26.624-12.288 15.872-34.816 18.944-50.688 7.168l-35.84-27.136c-12.288-8.704-28.672-8.704-40.96 0l-35.84 27.136c-18.432 13.824-40.96 21.504-64.512 21.504-23.04 0-45.568-7.68-64.512-21.504l-35.84-27.136c-12.288-8.704-28.672-8.704-40.96 0l-35.84 27.136c-18.432 14.336-41.472 21.504-64.512 21.504s-46.08-7.68-64.512-21.504l-35.84-27.136c-12.288-9.216-28.672-9.216-40.96 0l-35.84 27.136c-18.432 13.824-40.96 21.504-64.512 21.504-23.04 0-45.568-7.68-64.512-21.504l-35.84-27.136c-12.288-9.216-28.672-9.216-40.96 0l-47.104 35.84c-15.872 12.288-38.912 8.704-50.688-7.168-5.632-7.68-8.192-17.408-7.168-27.136 1.024-9.728 6.144-17.92 13.824-24.064l47.104-35.328c37.376-28.16 91.136-28.16 128.512 0l35.84 27.136c5.632 4.608 13.312 6.656 20.48 6.656 1.024 0 2.56 0 3.584-0.512L463.872 69.12z m43.52 92.672l-148.992 471.04c7.168-1.536 14.336-2.56 20.992-2.56 23.04 0 46.08 7.68 64.512 21.504l35.84 27.136c11.264 8.704 29.184 8.704 40.96 0l35.84-27.136c37.888-28.672 90.624-28.672 128.512 0l35.84 27.136c11.776 9.216 29.184 9.216 40.96 0l35.84-27.136c2.56-2.048 5.12-3.072 7.68-4.096 0.512-0.512 1.536-1.024 2.048-1.024L929.792 317.44 507.392 161.792z m177.664 377.856l94.72 34.816-25.088 68.608-94.72-34.816 25.088-68.608z m-179.2-60.928l94.72 34.816-25.088 68.608-94.72-34.816 25.088-68.608z m224.256-48.128l94.72 34.816-25.088 68.608-94.72-34.816 25.088-68.608z m-179.2-66.048L645.12 399.36l-25.088 68.608-94.72-34.816 25.6-68.608z m216.576-59.392l94.72 34.816-25.088 68.608-95.232-34.816 25.6-68.608z m-179.712-66.048l94.72 34.816-25.088 68.608-94.72-34.816 25.088-68.608z" p-id="3164"></path></svg>
            </button>
            <div className={panelVisibility ? 'panel' : 'panel panel-hidden'}>
                <div className="panel-heading">
                    <h4 className="panel-title">
                    淹没分析
                    <span>
                        <CloseSquareOutlined onClick={closePanel} />
                    </span>
                    </h4>
                </div>
                <div className="panel-body inundate-panel">
                    <Row justify="space-around">
                        <Col span={6}>
                            <span className="icon" onClick={drawWater}>
                            <svg t="1601024246060" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8108" width="48" height="48"><path d="M504.604444 48.355556a426.666667 426.666667 0 1 0 426.666667 426.666666 426.666667 426.666667 0 0 0-426.666667-426.666666z m0 202.524444a577.422222 577.422222 0 0 1 69.973334 154.168889 69.973333 69.973333 0 1 1-139.946667 0 577.422222 577.422222 0 0 1 70.542222-154.168889z m-227.555555 273.066667a155.875556 155.875556 0 0 1 56.888889-21.048889c27.875556 0 56.888889 27.875556 84.195555 27.875555s56.888889-27.875556 83.626667-27.875555 56.888889 27.875556 84.195556 27.875555 56.888889-27.875556 84.195555-27.875555a149.617778 149.617778 0 0 1 56.888889 21.048889v56.888889a158.72 158.72 0 0 0-56.888889-20.48c-27.875556 0-56.888889 27.875556-84.195555 27.875555s-56.888889-27.875556-84.195556-27.875555-56.888889 27.875556-83.626667 27.875555-56.888889-27.875556-84.195555-27.875555a165.546667 165.546667 0 0 0-56.888889 20.48z m448.853333 167.822222a167.253333 167.253333 0 0 0-56.888889-21.048889c-27.875556 0-56.888889 28.444444-84.195555 28.444444s-56.888889-28.444444-83.626667-28.444444-56.888889 28.444444-84.195555 28.444444-56.888889-28.444444-84.195556-28.444444a159.857778 159.857778 0 0 0-56.888889 21.048889v-56.888889a149.617778 149.617778 0 0 1 56.888889-21.048889c27.875556 0 56.888889 27.875556 84.195556 27.875556s56.888889-27.875556 84.195555-27.875556 56.888889 27.875556 83.626667 27.875556 56.888889-27.875556 84.195555-27.875556a155.875556 155.875556 0 0 1 56.888889 21.048889z" p-id="8109" fill="#1296db"></path></svg>
                                水面效果
                            </span>
                        </Col>
                        <Col span={6}>
                            <span className="icon" onClick={initAnalysis}>
                                <svg t="1601024296445" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9195" width="48" height="48"><path d="M716.8 921.6H307.2c-112.896 0-204.8-91.904-204.8-204.8V307.2c0-112.896 91.904-204.8 204.8-204.8h409.6c112.896 0 204.8 91.904 204.8 204.8v409.6c0 112.896-91.904 204.8-204.8 204.8zM307.2 176.896A130.4576 130.4576 0 0 0 176.896 307.2v409.6A130.4576 130.4576 0 0 0 307.2 847.104h409.6A130.4576 130.4576 0 0 0 847.104 716.8V307.2A130.4576 130.4576 0 0 0 716.8 176.896H307.2z m217.344 316.5184l119.5008-123.4432c13.4656-13.9264 36.5568-13.4656 48.384 1.8432 30.6176 39.5776 47.5648 88.2176 47.5648 138.6496 0 125.44-104.7552 228.608-231.936 228.608-103.936 0-194.048-68.8128-222.5664-164.5056a32.768 32.768 0 0 1 27.4944-42.1376l171.52-19.3536c15.2064-1.7408 29.3376-8.704 40.0384-19.6608z m-16.2816-28.16c-12.6464 12.4928-29.2352 20.3776-46.9504 22.3744l-163.2768 18.2272a15.872 15.872 0 0 1-17.6128-15.36l-0.0512-5.888c0-112.64 94.0032-205.312 208.2816-205.312 49.3568 0 97.024 17.408 134.5024 48.64a15.872 15.872 0 0 1 0.8192 23.3472l-115.712 113.9712z" p-id="9196" fill="#1afa29"></path></svg>
                                洪水分析    
                            </span>
                        </Col>
                        <Col span={6}>
                            <span className="icon" onClick={beginAnalysis}>
                                <svg t="1601024296445" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9195" width="48" height="48"><path d="M716.8 921.6H307.2c-112.896 0-204.8-91.904-204.8-204.8V307.2c0-112.896 91.904-204.8 204.8-204.8h409.6c112.896 0 204.8 91.904 204.8 204.8v409.6c0 112.896-91.904 204.8-204.8 204.8zM307.2 176.896A130.4576 130.4576 0 0 0 176.896 307.2v409.6A130.4576 130.4576 0 0 0 307.2 847.104h409.6A130.4576 130.4576 0 0 0 847.104 716.8V307.2A130.4576 130.4576 0 0 0 716.8 176.896H307.2z m217.344 316.5184l119.5008-123.4432c13.4656-13.9264 36.5568-13.4656 48.384 1.8432 30.6176 39.5776 47.5648 88.2176 47.5648 138.6496 0 125.44-104.7552 228.608-231.936 228.608-103.936 0-194.048-68.8128-222.5664-164.5056a32.768 32.768 0 0 1 27.4944-42.1376l171.52-19.3536c15.2064-1.7408 29.3376-8.704 40.0384-19.6608z m-16.2816-28.16c-12.6464 12.4928-29.2352 20.3776-46.9504 22.3744l-163.2768 18.2272a15.872 15.872 0 0 1-17.6128-15.36l-0.0512-5.888c0-112.64 94.0032-205.312 208.2816-205.312 49.3568 0 97.024 17.408 134.5024 48.64a15.872 15.872 0 0 1 0.8192 23.3472l-115.712 113.9712z" p-id="9196" fill="#1afa29"></path></svg>
                                洪水分析1   
                            </span>
                        </Col>
                        <Col span={6}>
                            <span className="icon" onClick={clearAll}>
                            <svg t="1601024629115" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10892" width="48" height="48"><path d="M150 512c0 199.928 162.073 362 362 362 199.928 0 362-162.072 362-362 0-199.927-162.072-362-362-362-199.927 0-362 162.073-362 362z m551.458 194.79s-4.18 11.288-9.774 0c0 0-62.396-196.895-214.501-147.301V620.6s-2.436 35.937-32.416 12.538L295.195 498.147s-31.724-18.035 1.909-42.716l151.151-135.784s22.708-16.948 28.204 10.86l0.164 65.95S760.135 410.674 701.46 706.79z" p-id="10893" fill="#f4ea2a"></path></svg>
                                清除所有
                            </span>
                        </Col>
                    </Row>
                </div>
                <div className={extraPanelVisibility ? 'extra-panel-body' : 'extra-panel-body panel-hidden'}>
                    <Row gutter={24} className="header">
                        <Col span={12}>
                            <Button type="primary" onClick={drawFloodArea}>绘制淹没范围</Button>
                        </Col>
                        <Col span={12}>
                            <Button type="primary" danger onClick={clearFloodArea}>清除淹没效果</Button>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form                    
                            name="basic"
                            initialValues={{
                                maxHeight: 800,
                                minHeight: 320,
                                step: 1,
                                speed: 0.05
                            }}
                            onFinish={beginAnalysis}>
                                <Row gutter={24}>
                                    <Col span={12}>  
                                        <Form.Item label="最大高度" name="maxHeight">
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="最小高度" name="minHeight">
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row> 
                                <Row gutter={24}>
                                    <Col span={12}>    
                                        <Form.Item label="上涨间隔" name="step">
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>  
                                        <Form.Item label="淹没速度" name="speed">
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col span={12}>
                                        <Button type="primary" htmlType="submit">开始</Button>
                                    </Col>
                                    <Col span={12}>
                                        {/* {graphicManager?.tip} */}
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>                    
                </div>
            </div>
            
        
        </>
    );
}