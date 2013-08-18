describe("E2E: Testing geotooltip directive in demo page", function() {

	beforeEach(function() {
		browser().navigateTo('/demo/');
	});

	it('should have properly replaced the directive with its template', function() {
		expect(element('span.geotooltip').count()).toBe(5);
	});

	it('should change the style of the tooltipped text', function() {
		
	});

	it('should make a tooltip appear instantly in the bottom-right corner of the directive if there is a 0 delay', function() {

	});

	it('should make a tooltip appear after one second by default', function() {

	});

	it('should make a tooltip appear after half a second', function() {

	});
});