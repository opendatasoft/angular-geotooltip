describe("E2E: Testing geotooltip directive in demo page", function() {

	beforeEach(function() {
		browser().navigateTo('/demo/');
	});

	it('should have properly replaced the directive with its template', function() {
		expect(element('span.geotooltip').count()).toBe(5);
	});

	it('should change the style of the tooltipped text', function() {
		expect(element('span.geotooltip').css('cursor')).toBe('help');
		expect(element('span.geotooltip').css('border-bottom-style')).toBe('dotted');
	});

	it('should appear instantly if there is a delay but I click on the text, and be located in the bottom-right corner of the directive', function() {
		element('#case1').click();
		// Is the tooltip in the DOM?
		expect(element('#geotooltip').count()).toBe(1);
		// Is the tooltip visible?
		expect(element('#geotooltip:visible').count()).toBe(1);
	})

	// it('should make a tooltip appear instantly if there is a 0 delay', function() {
		
	// });

	// it('should make a tooltip appear after one second by default', function() {

	// });

	// it('should make a tooltip appear after half a second', function() {

	// });

	// it('should not make the tooltip appear if I move my mouse outside before the delay', function() {

	// });
});