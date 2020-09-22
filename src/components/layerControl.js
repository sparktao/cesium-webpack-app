import * as Cesium from 'cesium/Cesium'

/**
 * 删除指定ID的图层
 */
function deleteServerTypeMap(cesiumViewer, layerDatas, id){
    var layers = cesiumViewer.scene.imageryLayers;
    for(var i=0; i<layerDatas.length && layerDatas.length > 0; i++){
        if(layerDatas[i].id === id){
            layers.remove(layerDatas[i].layer);
        }
    }    

    // switch(typeof(id))
    // {
    //     case "number":            
    //         for(var i=0;i<layerDatas.length && layerDatas.length > 0;i++){
    //             if(cesium.layer3DList[i].id == id){
    //                 layers.remove(cesium.layer3DList[i].layer);
    //             }
    //         }            
    //         break;
    //     case "string":
    //         var len = cesium.cesiumViewer.dataSources.length;
    //         if(len>0){
    //             for(var i=0;i<len;i++){
    //                 var dataSource = cesium.cesiumViewer.dataSources.get(i);
    //                 if(dataSource._name && dataSource._name == id){
    //                     cesiumViewer.dataSources.remove(dataSource);
    //                 }
    //             }
    //         }
    //         break;
    //     case "undefined":
    //         break;
    // }
}

/**
 * 加载不同类型地图服务的底图
 @ id 图层的id标识
    @ servertype 地图服务类型(0代表ArcGisMapServerImageryProvider;1代表createOpenStreetMapImageryProvider;
    2代表WebMapTileServiceImageryProvider;3代表createTileMapServiceImageryProvider;
    4 代表UrlTemplateImageryProvider;5 代表WebMapServiceImageryProviderr(WMS))
    @ url 地图服务的url
    @ layerid 地图图层的id
    @ proxyUrl 代理请求url
    @ tilingScheme 地图坐标系,WebMercatorTilingScheme(摩卡托投影坐标系3857);GeographicTilingScheme(世界地理坐标系4326)
    */
function loadServerTypeMap(cesiumViewer, id, servertype, url, layerid, proxyUrl,IsWebMercatorTilingScheme, other){
    var ilayers = cesiumViewer.imageryLayers;
    var layer = null;
    switch (servertype) {
        case 0://WebMapTileServiceImageryProvider 天地图
            var curlayer = ilayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({   //调用影响中文服务
                url: url,//url地址
                layer: layerid,	//WMTS请求的层名称
                style: "default",//WMTS请求的样式名称
                format: "tiles",//MIME类型，用于从服务器检索图像
                tileMatrixSetID: "GoogleMapsCompatible",//	用于WMTS请求的TileMatrixSet的标识符
                subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'], //天地图8个服务器
                minimumLevel: 0,//最小层级
                maximumLevel: 18,//最大层级
            }));
            layer = {layer: curlayer, id: id};
            break;
        case 1://OpenStreetMapImageryProvider
            var curlayer = ilayers.addImageryProvider(Cesium.createOpenStreetMapImageryProvider({
                url : url
            }));
            layer = {layer: curlayer, id: id};
            break;
        case 2://WebMapTileServiceImageryProvider
            break;
        case 3://createTileMapServiceImageryProvider
            break;
        case 4://UrlTemplateImageryProvider
            break;
        case 5://WebMapServiceImageryProvider
            var m_tilingScheme = new Cesium.GeographicTilingScheme();
            if(IsWebMercatorTilingScheme){
                m_tilingScheme = new Cesium.WebMercatorTilingScheme();
            }
            var curlayer = ilayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
                url: url,
                layers: layerid,
                //tilingScheme:tilingScheme,
                tilingScheme:m_tilingScheme,
                parameters : {
                    service:"WMS",
                    version:"1.1.1",
                    request:"GetMap",
                    transparent : true,
                    format : 'image/png'
                },
                show: false
            }));
            layer = {layer:curlayer,id:id};
            break;
        case 6://kml,kmz
            var options = {
                camera : cesium.cesiumViewer.scene.camera,
                canvas : cesium.cesiumViewer.scene.canvas
            };
            cesium.cesiumViewer.dataSources.add(Cesium.KmlDataSource.load(url, options)).then(function(dataSource){
                cesium.cesiumViewer.camera.flyHome();
            });
            break;
        case 7://geoJson
            /*var options = {
                camera : cesium.cesiumViewer.scene.camera,
                canvas : cesium.cesiumViewer.scene.canvas
            };
            cesium.cesiumViewer.dataSources.add(Cesium.KmlDataSource.load(url, options)).then(function(dataSource){
                cesium.cesiumViewer.camera.flyHome();
            });*/
            /*var dataSource = Cesium.GeoJsonDataSource.load('../../../../Apps/SampleData/simplestyles.geojson');
            viewer.dataSources.add(dataSource);
            viewer.zoomTo(dataSource);*/
            cesium.cesiumViewer.dataSources.add(Cesium.GeoJsonDataSource.load(url)).then(function(dataSource){
                cesium.cesiumViewer.zoomTo(dataSource);
            });
            break;
        case 8:
            var curlayer = ilayers.addImageryProvider(new Cesium.SingleTileImageryProvider({
                url : url,
                rectangle : Cesium.Rectangle.fromDegrees(94.0107, -8.81, 147.105, 29.332)
            }));
            layer = {layer: curlayer, id: id};
            break;
        default://ArcGisMapServerImageryProvider
            var curlayer = ilayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
                proxy : new Cesium.DefaultProxy(proxyUrl),
                url : url,
                layers: layerid,
                enablePickFeatures : false
            }));
            layer = {layer:curlayer,id:id};
            break;
    }   
    return layer; 
}


export {
    loadServerTypeMap,
    deleteServerTypeMap
}