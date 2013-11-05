## geotooltip
An AngularJS directive to display cute little tooltips containing a geographical marker or shape and a map of its
surroundings.

### Examples
<strong><a href="http://opendatasoft.github.io/angular-geotooltip/demo" target="_blank">An example page is available here.</a></strong>

You can also see it live in action on <a href="http://public.opendatasoft.com/explore/dataset/grandnancy_zones_urbanisees/#?tab=table" target="_blank">OpenDataSoft's portal</a>.

### Dependencies
- AngularJS (assumed to work on any version)
- Leaflet (assumed to work on 0.5+)
- jQuery (assumed to work on 1.6+)

### Installation
Just add geotooltip.js in your page (and the dependencies if you don't have them already).

#### Usage
```html
<geotooltip geojson="geoJson" coords="pointCoordinates" delay="0" width="600" height="400">Hello, I am a tooltip!</geotooltip>
```
All attributes are optional, but you need at least one `geojson` or one `coords` attribute.
Available attributes:
- `coords`: coordinates (lat, lng) of a point to display. Can be either as a string like "48.857365,2.373387" or directly as an array like [48.857365,2.373387].
- `geojson`: a GeoJSON shape to display. Can be either directly a JS object, or a GeoJSON string.
- `width`: width (in pixels) of the tooltip
- `height`: height (in pixels) of the tooltip
- `delay`: delay (in milliseconds) before the tooltip will pop

#### Configuration
You can inject a custom configuration :
```html
<script language="text/javascript">
  var app = angular.module('geotooltip').config(function(GeoTooltipConfigProvider) {
    GeoTooltipConfigProvider.setConfig({
    	maxZoom: 14,
    	delay: 500
    });
  });
</script>
```
The available settings are:
- `tiles`: URL pattern to retrieve the map tiles from, as expected by Leaflet. Defaults to <a href="http://developer.mapquest.com/web/products/open/map" target="_blank">MapQuest OSM Tiles</a>.
- `subdomains`: Pattern for the tile server round-robin, as expected by Leaflet. Defaults to the pattern relevant to MapQuest OSM Tiles.
- `attribution`: Attribution text below the map. Defaults to the relevant attribution for MapQuest and OpenStreetMap.
- `defaultDelay`: Default delay in milliseconds to display the tooltip. Defaults to 500 milliseconds.
- `defaultWidth`: Default width (in pixels). Defaults to 200.
- `defaultHeight`: Default height (in pixels). Defaults to 200.
- `maxZoom`: Maximum zoom for tooltips (based on the Leaflet zoom system). If you see tooltips for points that you consider to be too narrow, you can reduce it. Defaults to 16 (which is the maximum).

### Development
If you want to contribute and develop, you can run the demo page and start from there:
- setup the build environment: `npm install`
- setup the test environment for Angular: `bower install --dev`
- run a local server: `grunt server`

To build a distribuable JS file: `grunt`
