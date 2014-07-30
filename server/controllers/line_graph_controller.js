var LineGraphView = require('../views/line_graph_view'),
    Database = require('../models/database');

function LineGraphController(io) {
  this.line_graph_view = new LineGraphView(io);
  this.database = new Database;
}
LineGraphController.prototype = {
  setupDatabase: function() {
    this.database.setupIndicies();
    this.database.removeDeprecatedCounts();
  },
  passTweetToDatabase: function(tweet) {
    this.database.extractHashtagsFromTweet(tweet);
  },
  passTopHashtagCountsToLineGraph: function() {
    var topFiveHashtagCounts = this.database.calculateTopFiveHashtags(this);
    this.line_graph_view.update(topFiveHashtagCounts);
  }
}

module.exports = LineGraphController;