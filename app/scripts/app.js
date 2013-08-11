'use strict';

angular.module('ngGeotooltipApp', [])
  .controller('RootController', ['$scope', function($scope) {
    $scope.pointCoordinates = [48.857365, 2.373387];
  }]);