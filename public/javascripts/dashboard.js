Audio = {};
function Dashboard(config) {
  var pings = [], projects = [];

  $('#title').text(config.title);

  $.template("audioTag", "<audio src='${source}' id='${id}'></audio>");
  $.each(['continuingSuccess', 'success', 'failure', 'building'], function() {
    $.tmpl("audioTag", {'id':this, 'source':'sounds/' + this + '.mp3'}).appendTo('#audio');
    Audio[this] = document.getElementById(this);
  });

  $.each(config.pings, function() {
    pings.push(new Ping(this));
  });

  $.each(config.projects, function() {
    projects.push(new Project(this));
  });

  return {
    projects: projects,
    pings: pings,

    start: function() {
      this.refresh();

      var self = this;
      setInterval(function() {
        self.refresh();
      }, config.refreshInterval);
    },

    getState: function() {
      var state = true;

      $.each(this.projects, function(i, project) {
        if(project.status == 'failure') {
          state = false;
        }
      });

      $.each(this.pings, function(i, ping) {
        if(ping.status == 'failure') {
          state = false;
        }
      });

      return state;
    },

    refreshPings: function() {
      $.each(this.pings, function(i, ping) {
        ping.update();
      });
    },

    refreshProjects: function() {
      $.each(this.projects, function(i, project) {
        project.update();
      });
    },

    refresh: function() {
      this.checkForDashboardChanges();
      this.refreshProjects();
      this.refreshPings();
      this.updateFavicon();
      this.startProgressBarAnimation();
    },

    updateFavicon: function() {
      var image = (this.getState() ? 'images/success.png' : 'images/failure.png');
      $("link[rel=icon]").attr('href', image);
    },

    startProgressBarAnimation: function() {
      $('#progress').animate({ width: '100%' }, config.refreshInterval - 1000, 'linear', function() {
        $(this).css('width', 0);
      });
    },

    checkForDashboardChanges: function() {
      $.get('refresh.txt', function() {
        location.reload();
      });
    }
  };
}
