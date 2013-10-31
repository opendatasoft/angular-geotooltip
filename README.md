*WORK IN PROGRESS*
## geotooltip
An AngularJS directive to display cute little tooltips containing a geographical marker or shape and a map of its
surroundings.

### Dependencies
- AngularJS (assumed to work on any version)
- Leaflet (assumed to work on 0.5+)
- jQuery (assumed to work on 1.6+)

### Installation
Just add geotooltip.js in your page.

#### Configuration
You can inject a custom configuration :
```
<script language="text/javascript">
  var app = angular.module('geotooltip').config(function(GeoTooltipConfigProvider) {
    GeoTooltipConfigProvider.setConfig({});
  });
</script>
```
TODO : accepted configuration keys

### Development
If you want to contribute and develop, you can run the demo page and start from there:
- setup the build environment: `npm install`
- setup the test environment for Angular: `bower install --dev`
- run a local server: `grunt server`

To build a distribuable JS file: `grunt`
