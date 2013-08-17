'use strict';

angular.module('ngGeotooltipApp')
	.directive('geotooltip', ['$timeout', '$window', function ($timeout, $window) {
		// The container is shared between directives to avoid performance issues
		var container = angular.element('<div id="geotooltip" style="visibility: hidden; position: absolute;"></div>');
		var map = null;
		var layer = null;
		var displayed = false;

		var displayTooltip = function(tippedElement, coords, width, height) {
			if (!displayed) {
				displayed = true;

				// Make the container the right size
				var resized = false;
				if (width !== container.css('width') || height !== container.css('height')) {
					resized = true;
				}
				container.css('width', width);
				container.css('height', height);

				// Position it at the right place
				container.css('top', tippedElement.prop('offsetTop')+tippedElement.prop('offsetHeight')+'px');
				container.css('left', tippedElement.prop('offsetLeft')+tippedElement.prop('offsetWidth')+'px');
				tippedElement.after(container);
				
				if (map == null) {
					map = new L.map(container[0]);
					var tilesUrl = 'http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png';
	                var attrib = 'Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png"> - Map data © <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors';
	                var tileLayer = new L.TileLayer(tilesUrl, {minZoom: 1, maxZoom: 18, attribution: attrib, subdomains: "1234"});
	                map.addLayer(tileLayer);
	            } else if (resized) {
	            	map.invalidateSize();
	            }

                var point = new L.LatLng(coords[0], coords[1]);
                map.setView(point, 12);

                if (layer !== null) {
                	map.removeLayer(layer);
                }
                layer = L.marker(point).addTo(map);
                container.css('visibility', 'visible');
            }
		};

		var hideTooltip = function() {
			displayed = false;
			container.css('visibility', 'hidden');
		}

		return {
			template: '<span ng-transclude style="border-bottom: 1px dotted #000000; cursor: help;"></span>',
			replace: true,
			restrict: 'E',
			transclude: true,
			scope: {
				'coords': '=',
				'width': '@',
				'height': '@'
			},
			link: function(scope, element, attrs) {
				var tooltipPop = null;
				var tooltipWidth = '200px';
				var tooltipHeight = '200px';
				if (attrs.height) {
					tooltipHeight = attrs.height+'px';
				}
				if (attrs.width) {
					tooltipWidth = attrs.width+'px';
				}

				// Events
				element.bind('mouseenter', function(e) {
					tooltipPop = $timeout(function() {
						displayTooltip(element, scope.coords, tooltipWidth, tooltipHeight);
					}, 1000).then(function() { tooltipPop = null; });
				});
				element.bind('click', function(e) {
					displayTooltip(element, scope.coords, tooltipWidth, tooltipHeight);
					if (tooltipPop !== null) {
						// Chances are we triggered the original timer
						$timeout.cancel(tooltipPop);
					}
				})
				element.bind('mouseleave', function(e) {
					if (tooltipPop === null) {
						hideTooltip();
					} else {
						// We are currently counting down until the tooltip appearance, let's forget it
						$timeout.cancel(tooltipPop);
					}
					
				});
			}
		};
	}]);
