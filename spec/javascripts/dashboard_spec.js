describe("Dashboard", function() {
  var dashboard;

  beforeEach(function() {
    loadFixtures('spec/javascripts/fixtures/configurable_elements.html');
    dashboard = new Dashboard(config);
  });

  describe("#initialize", function() {
    it("sets the h1 title to the title in the config", function() {
      expect($('#title')).toHaveText(config.title);
    });

    it("sets the continuing success audio tag's src to the continuing success sound path from the config", function() {
      expect($('#continuing_success').attr('src')).toEqual(config.sounds.continuingSuccess);
    });

    it("sets the success audio tag's src to the success sound path from the config", function() {
      expect($('#success').attr('src')).toEqual(config.sounds.success);
    });

    it("sets the building audio tag's src to the building sound path from the config", function() {
      expect($('#building').attr('src')).toEqual(config.sounds.building);
    });

    it("sets the failure audio tag's src to the failure sound path from the config", function() {
      expect($('#failure').attr('src')).toEqual(config.sounds.failure);
    });

    it("stores the initialized pings", function() {
      expect(dashboard.pings.length > 0).toBeTruthy();
    });

    it("stores the initialized projects", function() {
      expect(dashboard.projects.length > 0).toBeTruthy();
    });
  });

  describe("#start", function() {
    it("calls refresh", function() {
      var refreshSpy = spyOn(dashboard, 'refresh');
      dashboard.start();
      expect(refreshSpy).toHaveBeenCalled();
    });

    it("sets a refresh interval", function() {
      var setIntervalSpy = spyOn(window, 'setInterval');
      dashboard.start();
      expect(setIntervalSpy.argsForCall[0][0]).toBeTruthy();
      expect(setIntervalSpy.argsForCall[0][1]).toEqual(config.refreshInterval);
    });
  });

  describe("#getState", function() {
    describe("when everything is passing", function() {
      it("returns true", function() {
        dashboard.projects[0].status = 'success';
        dashboard.pings[0].status = 'success';
        expect(dashboard.getState()).toEqual(true);
      });
    });

    describe("when a project is failing", function() {
      it("returns false", function() {
        dashboard.projects[0].status = 'failure';
        dashboard.pings[0].status = 'success';
        expect(dashboard.getState()).toEqual(false);
      });
    });

    describe("when a ping is failing", function() {
      it("returns false", function() {
        dashboard.projects[0].status = 'success';
        dashboard.pings[0].status = 'failure';
        expect(dashboard.getState()).toEqual(false);
      });
    });
  });

  describe("#startProgressBarAnimation", function() {
    it("animates the progres bar", function() {
      var animateSpy = spyOn($.fn, 'animate');
      dashboard.startProgressBarAnimation();
      expect(animateSpy).toHaveBeenCalled();
    });
  });

  describe("#refresh", function() {
    it("calls to startProgressBarAnimation", function() {
      var startProgressBarAnimationSpy = spyOn(dashboard, 'startProgressBarAnimation');
      dashboard.refresh();
      expect(startProgressBarAnimationSpy).toHaveBeenCalled();
    });

    it("calls to refreshProjects", function() {
      var refreshProjectsSpy = spyOn(dashboard, 'refreshProjects');
      dashboard.refresh();
      expect(refreshProjectsSpy).toHaveBeenCalled();
    });

    it("calls to refreshPings", function() {
      var refreshPingsSpy = spyOn(dashboard, 'refreshPings');
      dashboard.refresh();
      expect(refreshPingsSpy).toHaveBeenCalled();
    });

    it("calls to checkForDashboardChanges", function() {
      var checkForDashboardChangesSpy = spyOn(dashboard, 'checkForDashboardChanges');
      dashboard.refresh();
      expect(checkForDashboardChangesSpy).toHaveBeenCalled();
    });

    it("calls to updateFavicon", function() {
      var updateFaviconSpy = spyOn(dashboard, 'updateFavicon');
      dashboard.refresh();
      expect(updateFaviconSpy).toHaveBeenCalled();
    });
  });

  describe("#updateFavicon", function() {
    beforeEach(function() {
      loadFixtures('spec/javascripts/fixtures/header.html');
    });

    describe("when the state is passing", function() {
      it("sets the favicon to passing image", function() {
        spyOn(dashboard, 'getState').andReturn(true);
        dashboard.updateFavicon();
        expect($("link[rel=icon]").attr('href')).toEqual('images/success.png');
      });
    });

    describe("when the state is failure", function() {
      it("sets the favicon to failure image", function() {
        spyOn(dashboard, 'getState').andReturn(false);
        dashboard.updateFavicon();
        expect($("link[rel=icon]").attr('href')).toEqual('images/failure.png');
      });
    });
  });

  describe("#checkForDashboardChanges", function() {
    it("makes a request for the refresh asset", function() {
      var getSpy = spyOn($, 'get');
      dashboard.checkForDashboardChanges();
      expect(getSpy.mostRecentCall.args[0]).toEqual('refresh.txt');
    });
  });
});
