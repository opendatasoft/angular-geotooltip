'use strict';

angular.module('ngGeotooltipApp')
	.directive('geotooltip', ['$timeout', '$window', function ($timeout, $window) {
		var container = angular.element('<div id="geotooltip"></div>');
		angular.element($window.document.body).append(container);
		var map = null;
		var layer = null;

		var displayTooltip = function(coords) {
			return function() {
				if (map == null) {
					map = new L.map(container[0]);
					var tilesUrl = 'http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png';
	                var attrib = 'Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png"> - Map data © <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors';
	                var tileLayer = new L.TileLayer(tilesUrl, {minZoom: 1, maxZoom: 18, attribution: attrib, subdomains: "1234"});
	                map.addLayer(tileLayer);
	            }

                var point = new L.LatLng(coords[0], coords[1]);
                map.setView(point, 12);

                if (layer !== null) {
                	map.removeLayer(layer);
                }
                layer = L.marker(point).addTo(map);
                container.css('visibility', 'visible');
                console.log(container);
			}
		};

		var hideTooltip = function() {
			console.log('bye bye')
			container.css('visibility', 'hidden');
		}

		return {
			template: '<span ng-transclude class="geotooltip-sourcetext"></span>',
			replace: true,
			restrict: 'E',
			transclude: true,
			scope: {
				'coords': '='
			},
			link: function(scope, element, attrs) {
				var tooltipPop = null;
				element.bind('mouseenter', function(e) {
					tooltipPop = $timeout(displayTooltip(scope.coords), 1000).then(function() { tooltipPop = null; });
				});
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
