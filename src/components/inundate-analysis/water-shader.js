export default class WaterShader {

    constructor(viewer) {
        this.viewer = viewer;
        this.waterPrimitive = null;
    }

    //绘制水面波浪效果
    drawWater(fly2View=true){
        // 绘制水面波浪效果需要设置为false
        // 淹没效果需要将其设置为 true
        this.viewer.scene.globe.depthTestAgainstTerrain = false;
        var waterFace=[
          130.0, 30.0, 0,
          150.0, 30.0, 0,
          150.0, 10.0, 0,
          130.0, 10.0, 0];
        this.waterPrimitive = new Cesium.Primitive({
            show:true,// 默认隐藏
            allowPicking:false,
            geometryInstances : new Cesium.GeometryInstance({
                geometry : new Cesium.PolygonGeometry({
                polygonHierarchy : new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights(waterFace)),
                //extrudedHeight: 0,//注释掉此属性可以只显示水面
                //perPositionHeight : true//注释掉此属性水面就贴地了
                })
            }),
            // 可以设置内置的水面shader
            appearance : new Cesium.EllipsoidSurfaceAppearance({
                material : new Cesium.Material({
                    fabric : {
                        type : 'Water',
                        uniforms : {
                        //baseWaterColor:new Cesium.Color(0.0, 0.0, 1.0, 0.5),
                        //blendColor: new Cesium.Color(0.0, 0.0, 1.0, 0.5),
                        //specularMap: 'gray.jpg',
                        //normalMap: '../assets/waterNormals.jpg',
                        normalMap: '../../Assets/myApp/Images/waterNormals.jpg',
                        frequency: 1000.0,
                        animationSpeed: 0.01,
                        amplitude: 10.0
                        }
                    }
                }),
//             fragmentShaderSource:'varying vec3 v_positionMC;\nvarying vec3 v_positionEC;\nvarying vec2 v_st;\nvoid main()\n{\nczm_materialInput materialInput;\nvec3 normalEC = normalize(czm_normal3D * czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0)));\n#ifdef FACE_FORWARD\nnormalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);\n#endif\nmaterialInput.s = v_st.s;\nmaterialInput.st = v_st;\nmaterialInput.str = vec3(v_st, 0.0);\nmaterialInput.normalEC = normalEC;\nmaterialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);\nvec3 positionToEyeEC = -v_positionEC;\nmaterialInput.positionToEyeEC = positionToEyeEC;\nczm_material material = czm_getMaterial(materialInput);\n#ifdef FLAT\ngl_FragColor = vec4(material.diffuse + material.emission, material.alpha);\n#else\ngl_FragColor = czm_phong(normalize(positionToEyeEC), material);\
//   gl_FragColor.a=0.5;\n#endif\n}\n'//重写shader，修改水面的透明度
          })
        });
        this.viewer.scene.primitives.add(this.waterPrimitive);
        if(fly2View) {
            this.viewer.camera.flyTo({
                destination : Cesium.Cartesian3.fromDegrees(140, 20, 6000000.0),
                orientation : {
                    heading: Cesium.Math.toRadians(0.0), //默认朝北0度，顺时针方向，东是90度
                    pitch: Cesium.Math.toRadians(-90), //默认朝下看-90,0为水平看，
                    roll: Cesium.Math.toRadians(0) //默认0
                }
            });
        }  
    }

    clearAll(fly2View=true) {
        // 清楚水面的效果
        if(this.waterPrimitive !== null 
            && this.viewer.scene.primitives.contains(this.waterPrimitive)) {
            if(this.viewer.scene.primitives.remove(this.waterPrimitive)) {
                this.waterPrimitive = null;
            }
        }
        if(fly2View) {
            this.viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(103.84, 31.15, 17850000), //中国区域
                orientation: {
                    heading: Cesium.Math.toRadians(348.4202942851978),
                    pitch: Cesium.Math.toRadians(-89.74026687972041),
                    roll: Cesium.Math.toRadians(0),
                }
            });
        }        
    }


}