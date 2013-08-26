'use strict';

angular.module('ng-geotooltip', [])
    .directive('geotooltip', ['$timeout', function ($timeout) {
        // The container is shared between directives to avoid performance issues
        var container = angular.element('<div id="geotooltip" style="visibility: hidden; position: absolute;"></div>');
        var map = null;
        var layerGroup = null;
        
        var displayTooltip = function(tippedElement, width, height, coords, geoJson) {
            // Make the container the right size
            var resized = false;
            if (width !== container.css('width') || height !== container.css('height')) {
                resized = true;
            }
            container.css('width', width);
            container.css('height', height);

            // Position it at the right place
            container.css('top', tippedElement.prop('offsetHeight')+'px');
            container.css('left', tippedElement.prop('offsetWidth')+'px');
            tippedElement.append(container);
            
            if (map === null) {
                map = new L.map(container[0]);
                var tilesUrl = 'http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png';
                var attrib = 'Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png"> - Map data © <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors';
                var tileLayer = new L.TileLayer(tilesUrl, {minZoom: 1, maxZoom: 18, attribution: attrib, subdomains: '1234'});
                map.addLayer(tileLayer);
            } else if (resized) {
                map.invalidateSize();
            }

            if (layerGroup !== null) {
                map.removeLayer(layerGroup);
            }
            layerGroup = L.layerGroup();
            var bounds = new L.LatLngBounds();

            if (coords) {
                var point = new L.LatLng(coords[0], coords[1]);
                var pointLayer = L.marker(point);
                layerGroup.addLayer(pointLayer);
                bounds.extend(point);
            }

            if (geoJson) {
                var geoJsonLayer = L.geoJson(geoJson);
                layerGroup.addLayer(geoJsonLayer);
                bounds.extend(geoJsonLayer.getBounds());
            }
            //map.setView(point, 12);
            layerGroup.addTo(map);
            map.fitBounds(bounds);
            container.css('visibility', 'visible');
        };

        var hideTooltip = function() {
            container.css('visibility', 'hidden');
        };

        return {
            template: '<span ng-transclude style="border-bottom: 1px dotted #000000; cursor: help; position: relative;" class="geotooltip"></span>',
            replace: true,
            restrict: 'E',
            transclude: true,
            scope: {
                'coords': '=',
                'width': '@',
                'height': '@',
                'delay': '@',
                'geojson': '='
            },
            link: function(scope, element, attrs) {
                var tooltipWidth = '200px';
                var tooltipHeight = '200px';
                var tooltipPop = null;

                var delay = attrs.delay || 1000;
                if (attrs.height) {
                    tooltipHeight = attrs.height+'px';
                }
                if (attrs.width) {
                    tooltipWidth = attrs.width+'px';
                }

                // Events
                element.bind('mouseover', function() {
                    tooltipPop = $timeout(function() {
                        displayTooltip(element, tooltipWidth, tooltipHeight, scope.coords, scope.geojson);
                        tooltipPop = null;
                    }, delay);
                });
                element.bind('click', function() {
                    displayTooltip(element, tooltipWidth, tooltipHeight, scope.coords, scope.geojson);
                    if (tooltipPop !== null) {
                        // Chances are we triggered the original timer
                        $timeout.cancel(tooltipPop);
                        tooltipPop = null;
                    }
                });
                element.bind('mouseout', function() {
                    hideTooltip();
                    if (tooltipPop !== null) {
                        // We are currently counting down until the tooltip appearance, let's forget it
                        $timeout.cancel(tooltipPop);
                        tooltipPop = null;
                    }
                    
                });
            }
        };
    }]);
