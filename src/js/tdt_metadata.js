
var token = 'ebf64362215c081f8317203220f133eb';
// 服务域名
// var tdtUrl = 'http://t{s}.tianditu.gov.cn/'
// 服务负载子域
var subdomains = ['0', '1', '2', '3', '4', '5', '6', '7']

//在线天地图影像服务地址(墨卡托投影)
const TDT_IMG_W = "http://t{s}.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
    "&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
    "&style=default&format=tiles&tk=" + token;
//在线天地图矢量地图服务(墨卡托投影) 
var TDT_VEC_W = "http://t{s}.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
    "&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
    "&style=default&format=tiles&tk=" + token;
//在线天地图影像中文标记服务(墨卡托投影)  
var TDT_CIA_W = "http://t{s}.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
    "&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
    "&style=default.jpg&tk=" + token
//在线天地图矢量中文标记服务(墨卡托投影)
var TDT_CVA_W = "http://t{s}.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
    "&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
    "&style=default.jpg&tk=" + token;
//在线天地图地形服务(墨卡托投影) 
var TDT_TER_C = "http://t{s}.tianditu.gov.cn/ter_c/wmts?service=wmts&request=GetTile&version=1.0.0" +
    "&LAYER=ter&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
    "&style=default.jpg&tk=" + token;

export {
    TDT_IMG_W,
    TDT_VEC_W,
    TDT_CIA_W,
    TDT_CVA_W,
    TDT_TER_C
}