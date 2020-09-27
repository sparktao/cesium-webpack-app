define(["exports","./when-54c2dc71","./Check-6c0211bc","./Math-fc8cecf5","./Cartesian2-bddc1162"],function(e,n,t,i,u){"use strict";function d(e){this._ellipsoid=n.defaultValue(e,u.Ellipsoid.WGS84),this._semimajorAxis=this._ellipsoid.maximumRadius,this._oneOverSemimajorAxis=1/this._semimajorAxis}Object.defineProperties(d.prototype,{ellipsoid:{get:function(){return this._ellipsoid}}}),d.mercatorAngleToGeodeticLatitude=function(e){return i.CesiumMath.PI_OVER_TWO-2*Math.atan(Math.exp(-e))},d.geodeticLatitudeToMercatorAngle=function(e){d.MaximumLatitude<e?e=d.MaximumLatitude:e<-d.MaximumLatitude&&(e=-d.MaximumLatitude);var t=Math.sin(e);return.5*Math.log((1+t)/(1-t))},d.MaximumLatitude=d.mercatorAngleToGeodeticLatitude(Math.PI),d.prototype.project=function(e,t){var i=this._semimajorAxis,o=e.longitude*i,a=d.geodeticLatitudeToMercatorAngle(e.latitude)*i,r=e.height;return n.defined(t)?(t.x=o,t.y=a,t.z=r,t):new u.Cartesian3(o,a,r)},d.prototype.unproject=function(e,t){var i=this._oneOverSemimajorAxis,o=e.x*i,a=d.mercatorAngleToGeodeticLatitude(e.y*i),r=e.z;return n.defined(t)?(t.longitude=o,t.latitude=a,t.height=r,t):new u.Cartographic(o,a,r)},e.WebMercatorProjection=d});
