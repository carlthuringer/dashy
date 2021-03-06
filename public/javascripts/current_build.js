function CurrentBuild(projectSelector, projectName) {
  var currentBuildSelector = projectSelector + ' .current_build',
      buildDurationSelector = projectSelector + ' .current_build .time',
      buildMessageSelector = projectSelector + ' .current_build .message';

  function convertDurationToSeconds(duration) {
    return Math.round(parseInt(duration, 10) / 1000);
  }

  $.template("currentBuild", "<div class='current_build'><h3 class='name'>${projectName}</h3><p class='time'></p><div class='clear'></div><div class='message'></div></div>");
  $.tmpl('currentBuild', {projectName: projectName}).appendTo(projectSelector);

  return {
    ticketReferencer: new TicketReferencer(currentBuildSelector),

    refresh: function(parsedResults) {
      this.setStatus(parsedResults.status);
      this.setDuration(parsedResults.duration);
      this.setCommitMessage(parsedResults.commitMessage);
    },

    setStatus: function(newStatus) {
      $(currentBuildSelector).removeClass('failure building success');
      $(currentBuildSelector).addClass(newStatus);
    },

    setDuration: function(duration) {
      duration = convertDurationToSeconds(duration);
      var durationText = (duration > 0 ? duration + ' sec' : '');
      $(buildDurationSelector).text(durationText);
    },

    setCommitMessage: function(commitMessage) {
      if(typeof(commitMessage) === 'undefined') {
        return false;
      } else {
        $(buildMessageSelector).html(convert(commitMessage));
        this.ticketReferencer.findAndInsert(commitMessage);
      }
    }
  };
}
