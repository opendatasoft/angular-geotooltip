(function() {
    'use strict';

    angular.module('geotooltip', [])
        .provider('GeoTooltipConfig', function() {
            this.defaultConfig = {
                tiles: 'http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png',
                subdomains: '1234',
                attribution: 'Tiles <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png"> - Map data © <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a>',
                defaultDelay: 500,
                defaultWidth: 200,
                defaultHeight: 200,
                maxZoom: 16
            };

            this.setConfig = function(customConfig) {
                this.customConfig = customConfig;
            };

            this.$get = function() {
                return angular.extend({}, this.defaultConfig, this.customConfig);
            };
        })
        .directive('geotooltip', ['$timeout', 'GeoTooltipConfig', function ($timeout, GeoTooltipConfig) {
            // The container is shared between directives to avoid performance issues
            var container = angular.element('<div id="geotooltip" style="opacity: 0; transition: opacity 200ms ease-out; position: fixed; z-index: 40000; visibility: hidden;"></div>');
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
                var availableBottomSpace = jQuery(window).height()-(tippedElement.offset().top-jQuery(document).scrollTop());
                if (container.height() < availableBottomSpace) {
                    // There is enough space below: let's place the tooltip right below the element
                    container.css('top', tippedElement.height()+tippedElement.offset().top-jQuery(document).scrollTop()+5+'px');
                } else {
                    container.css('top', tippedElement.offset().top-jQuery(document).scrollTop()-5-container.height()+'px');
                }
                var availableRightSpace = jQuery(window).width()-(tippedElement.offset().left-jQuery(document).scrollLeft());
                if (container.width() < availableRightSpace) {
                    container.css('left', tippedElement.offset().left-jQuery(document).scrollLeft()+'px');
                } else {
                    container.css('left', tippedElement.offset().left-jQuery(document).scrollLeft()-container.width()+'px');
                }
                tippedElement.append(container);
                
                if (map === null) {
                    map = new L.map(container[0], {zoomControl: false});
                    var tileLayer = new L.TileLayer(GeoTooltipConfig.tiles, {minZoom: 1, maxZoom: GeoTooltipConfig.maxZoom, attribution: GeoTooltipConfig.attribution, subdomains: GeoTooltipConfig.subdomains});
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
                    if (angular.isString(coords)) {
                        coords = coords.split(',');
                    }
                    var point = new L.LatLng(coords[0], coords[1]);
                    var pointLayer = L.marker(point);
                    layerGroup.addLayer(pointLayer);
                    bounds.extend(point);
                }

                if (geoJson) {
                    if (angular.isString(geoJson)) {
                        geoJson = angular.fromJson(geoJson);
                    }
                    var geoJsonLayer = L.geoJson(geoJson);
                    layerGroup.addLayer(geoJsonLayer);
                    bounds.extend(geoJsonLayer.getBounds());
                }

                layerGroup.addTo(map);
                map.fitBounds(bounds, {reset: true});
                container.css('opacity', '1');
                container.css('visibility', 'visible');
            };

            var hideTooltip = function() {
                container.css('opacity', '0');
                $timeout(function() {
                    container.css('visibility', 'hidden');
                }, 200);
            };

            return {
                template: '<span ng-transclude style="border-bottom: 1px dotted #000000; cursor: help;" class="geotooltip"></span>',
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
                    var tooltipWidth = (attrs.width || GeoTooltipConfig.defaultWidth) + 'px';
                    var tooltipHeight = (attrs.height || GeoTooltipConfig.defaultHeight) + 'px';
                    var tooltipPop = null;
                    var delay = attrs.delay || GeoTooltipConfig.defaultDelay;

                    // Events
                    element.bind('mouseover', function() {
                        if (delay === 0) {
                            displayTooltip(element, tooltipWidth, tooltipHeight, scope.coords, scope.geojson);
                        } else {
                            tooltipPop = $timeout(function() {
                                displayTooltip(element, tooltipWidth, tooltipHeight, scope.coords, scope.geojson);
                                tooltipPop = null;
                            }, delay);
                        }
                    });
                    element.bind('click', function() {
                        displayTooltip(element, tooltipWidth, tooltipHeight, scope.coords, scope.geojson);
                        if (tooltipPop !== null) {
                            // Chances are we triggered the original timer
                            $timeout.cancel(tooltipPop);
                            tooltipPop = null;
                        }
                    });
                    element.bind('mouseleave', function() {
                        console.log('mouseout');
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
}());