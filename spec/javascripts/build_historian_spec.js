describe("BuildHistorian", function() {
  var buildHistorian;

  beforeEach(function() {
    loadFixtures('spec/javascripts/fixtures/build_history.html');
    buildHistorian = new BuildHistorian('.project');
  });

  describe("#render", function() {
    it("inserts a build history list", function() {
      buildHistorian.render();
      expect($('.history')).toExist();
    });
  });

  describe("#removeOldestBuildResult", function() {
    beforeEach(function() {
      buildHistorian.render();
      buildHistorian.addState('success');
    });

    it("drops the oldest build state", function() {
      expect($('.status').length).toEqual(1);
      buildHistorian.removeOldestBuildState();
      expect($('.status').length).toEqual(0);
    });
  });

	describe("#continuingSuccess", function() {
		beforeEach(function() {
			buildHistorian.render();
		});

		describe("when there has not been 5 past builds", function() {
			it("returns false", function() {
				expect(buildHistorian.continuingSuccess()).toBeFalsy();
			});
		});
		
		describe("when there has been 5 past builds that were not success", function () {
			beforeEach(function() {
				$.each([1,2,3,4,5], function() {
					buildHistorian.addState('failure');
				});
			});

			it("returns false", function() {
				expect(buildHistorian.continuingSuccess()).toBeFalsy();
			});
		});

		describe("when there has been 5 past build that were all successful", function() {
			beforeEach(function() {
				$.each([1,2,3,4,5], function() {
					buildHistorian.addState("success");
				});				
			});

			it("returns true", function() {
				expect(buildHistorian.continuingSuccess()).toBeTruthy();
			});
		});
	});

  describe("#addState", function() {
    beforeEach(function() {
      buildHistorian.render();
      buildHistorian.addState('success');
    });

    it("adds the passed state as a class on the state element", function() {
      expect($('.status').hasClass('success')).toBeTruthy();
    });

    it("prepends a new state element", function() {
      expect($('.status').length).toEqual(1)
    });
  });
});
