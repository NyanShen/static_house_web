Modernizr.load([{
    'complete':function() {

        (function() {
            //搜索附近的地图
            //option
            //地图id mapid
            //地图坐标 point
            function CircleMap(option){
                if(!(this instanceof CircleMap)) return new CircleMap(option);
                var map = new BMap.Map(option.mapid,{minZoom:13});
                var point = new BMap.Point(option.point[0], option.point[1]);
                map.centerAndZoom(point, 15);
                map.enableScrollWheelZoom(true);
                var root = this;
                var circleoption = {
                    onSearchComplete:function(results) {
                        root._map.clearOverlays();
                        root._map.addOverlay(root._circle);
                        var marker = root._createMarker(root._point);
                        var info = root._createInfoWindow({title:option.otitle, address:option.oaddress});
                        //创建中心点
                        root._bindMarkerInfo(marker, info);

                        var arr = [];
                        for(var i=0;i<results.getCurrentNumPois();i++){
                            var poi = results.getPoi(i);

                            //添加标注点
                            var marker = root._createMarker(poi.point, 12);
                            //添加信息窗
                            var infowindow = root._createInfoWindow({title:poi.title, address:poi.address});
                            (function(infowindow, point) {
                                 marker.addEventListener('click', function() {
                                    root._map.openInfoWindow(infowindow,point);
                                });
                            })(infowindow, poi.point)


                            arr.push({
                                title:poi.title,
                                address:poi.address,
                                distance:root._getDistance(poi.point, root._point),
                                point:[poi.point.lat,poi.point.lng],
                                _infowindow : infowindow,
                                _point:poi.point
                            });

                        }
                        root.onSuccess(arr);
                    }
                };

                var circle = new BMap.Circle(point, this._range, {fillColor:"blue", strokeWeight: 1 ,fillOpacity: 0.1, strokeOpacity: 0.1});
                map.addOverlay(circle);

                var local = new BMap.LocalSearch(map, circleoption);
                local.disableFirstResultSelection();

                this._circle = circle;
                this._map = map;
                this._point = point;
                this._local = local;
                this.onSuccess = option.onSuccess ? option.onSuccess : this.onSuccess;

                return this;
            };



            CircleMap.prototype = {
                constructor:CircleMap,
                _range:2000,
                constructor:CircleMap,
                searchNearBy:function(add) {
                    var localSearch = this._local;
                    var range = this._range;
                    var point = this._point;
                    localSearch.searchNearby(add, point,range);
                },
                onSuccess:function() {
                    return this;
                },
                _createInfoWindow:function(marker){
                    var content = '<div class="map-info"><div class="map-info-title">' + marker.title + '</div><div class="map-info-address">' + marker.address + '</div></div>';
                    var infow = new BMap.InfoWindow(content,{offset:new BMap.Size(0, -10)});
                    return infow;
                },
                openInfoWindow:function(infowindow,point) {
                    this._map.openInfoWindow(infowindow, point);
                    return this;
                },
                _getDistance:function(p1, p2) {
                    return this._map.getDistance(p1, p2).toFixed(0) + '米';
                },
                _bindMarkerInfo:function(marker, infowindow) {
                    var root = this;
                    marker.addEventListener('click', function() {
                        root.openInfoWindow(infowindow,marker.getPosition());
                        return false;
                    });
                    root.openInfoWindow(infowindow,marker.getPosition());
                },
                _createMarker:function(point,index) {
                      index = index || 11;
                      var myIcon = new BMap.Icon(basedir + 'markers.png', new BMap.Size(23,25),{
                          offset:new BMap.Size(10, 25),
                          imageOffset:new BMap.Size(0, 0-index*25)
                      });
                      var marker = new BMap.Marker(point,{icon:myIcon});
                      this._map.addOverlay(marker);
                      return marker;
                }
            }

            window.hj.CircleMap = CircleMap;

            //界面层
            (function CircleMapView(){
                /* 地图部分S */
                var mapid = 'ui-map-box';
                var $mapbox = $('#' + mapid).parent();
                var lng = $mapbox.data('lng');
                var lat = $mapbox.data('lat');
                var zoom = $mapbox.data('zoom');
                var plot_name = $mapbox.data('plot-name');
                var plot_addr = $mapbox.data('plot-addr');

                var point = [lng, lat];
                var option = {
                    mapid : mapid,
                    point :point,
                    otitle:plot_name,
                    oaddress:plot_addr,
                    onSuccess:function(results) {
                        var htmls = [];
                        for(var i=0,len=results.length;i<len;i++){
                            var index = i;
                            var address = results[i].address;
                            var title = results[i].title;
                            var distance = results[i].distance;
                            var marker = results[i]._marker;
                            var infowindow = results[i]._infowindow;


                            var tmp =
                            ["<li data-id="+index+">",
        "                        <span class=\"digit\">"+(index+1)+".</span>",
        "                        <span class=\"text\" title=\""+title +"\">"+ title +"</span>",
        "                        <span class=\"distance\">"+distance+"</span>",
        "                    </li>"].join("");
                            htmls.push(tmp);
                        };
                        (function(results) {
                            $results_box.html(htmls.join('')).find('li').click(function() {
                                var i = $(this).attr('data-id');
                                circlemap._map.openInfoWindow(results[i]._infowindow,results[i]._point);
                                circlemap._map.centerAndZoom(results[i]._point,16);
                                return false;
                            });
                        })(results);
                        $result_count.html('(' + results.length + ')');
                    }
                };

                if($('#' + mapid).length === 0) return;
                var circlemap = CircleMap(option);

                /* 地图部分E */

                /* 界面部分S */
                var $map = $('.map');
                var $assort = $map.find('.assort-distance');
                var $labels = $map.find('.map-label a');
                circlemap.searchNearBy($($labels[0]).find('i').data('name'));
                var $results_box = $assort.find('ul');
                var $bmp_keyword = $('#bmap-keyword');
                var $result_count =$('#result-count');
                //默认打开状态
                $assort.removeClass('fixed-side');
                $labels.click(function() {
                    var $ele = $(this).find('i');
                    var cssflag = $ele.attr('search-flag');
                    var searchTxt = $ele.data('name');
                    circlemap.searchNearBy(searchTxt);
                    $bmp_keyword.text($ele.text());

                    return false;
                });

                $assort.find('.close-assort').click(function() {
                    $assort.removeClass('fixed-side');
                })
                .end().find('.close').click(function() {
                    $assort.addClass('fixed-side');
                });
            })();
        })();

        (function() {
            //传入坐标标注地图
            //@option
            // points 点集合 array
            // @title
            // @point
            // mapcontainer dom容器
            function ShortMap(option){
                if(!(this instanceof arguments.callee)) return new arguments.callee(option);

                var points = option.points;
                var mapcontainer = option.mapcontainer;


                this._points = points;
                this._mapcontainer = option.mapcontainer;
                this._init();
                return this;
            }

            //创建marker
            ShortMap.prototype = {
                constructor:ShortMap,
                _init:function() {
                    var map = new BMap.Map(this._mapcontainer);
                    var root = this;
                    var points = this._points;
                    this._map = map;

                    for(var i=0,len=points.length;i<len;i++){
                        var p = points[i];
                        var loc = p.point;
                        var title = p.title;
                        root._createMarkerAndInfoWindow(loc, title);
                    }
                    this._map.centerAndZoom(new BMap.Point(points[0]['point'][0],points[0]['point'][1]),17);
                    return this;
                },
                _createMarkerAndInfoWindow:function(point, title) {
                    var marker = new BMap.Marker(new BMap.Point(point[0],point[1]));
                    var content = '<div class="shortmap-content">' + title + '</div>';
                    var infow = new BMap.InfoWindow(content,{offset:new BMap.Size(0, -10)});
                    var root = this;
                    marker.addEventListener('click', function() {
                        root._map.openInfoWindow(infow, marker.getPosition());
                    });

                    this._map.addOverlay(marker);
                    return this;
                }
            }
            //界面
            function ShortMapView(){
                var schoolmaps = $('.school-map');
                schoolmaps.each(function() {
                    var $school = $(this);
                    var dom_school = $school.get(0);
                    var point = [119.89581200000000000000,31.80711400000000000000];
                    var title = '三井实验小学';
                    var obj = {
                        mapcontainer : dom_school,
                        points:[{
                            point : point,
                            title : title
                        }]
                    };
                    ShortMap(obj);
                });
            };
            //ShortMapView();
        })();
    }
}]);
