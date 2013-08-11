'use strict';

describe('Directive: geotooltip', function () {
  beforeEach(module('ngGeotooltipApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<geotooltip></geotooltip>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the geotooltip directive');
  }));
});
