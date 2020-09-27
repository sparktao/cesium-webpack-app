import React, {useState, useEffect} from 'react'
import './Toolbar.css'
import LayerManager from './layermanager/layer-manager'
import InnudateAnalysis from './inundate-analysis/inundate-analysis';

export default function Toolbar(props) {
    const viewer = props.viewer;    
    
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
    return (        
        <div className="app-toolbar">
            <button className="cesium-toolbar-button cesium-button" onClick={fly2HomeView}>
                <svg className="cesium-svgPath-svg" width="28" height="28" viewBox="0 0 28 28"><path d="M14,4l-10,8.75h20l-4.25-3.7188v-4.6562h-2.812v2.1875l-2.938-2.5625zm-7.0938,9.906v10.094h14.094v-10.094h-14.094zm2.1876,2.313h3.3122v4.25h-3.3122v-4.25zm5.8442,1.281h3.406v6.438h-3.406v-6.438z"></path></svg>
            </button>
            <LayerManager viewer={viewer}></LayerManager>
            <InnudateAnalysis viewer={viewer}></InnudateAnalysis>
        </div>
    );
}