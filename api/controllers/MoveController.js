/**
 * MoveController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    
  
    guard: function (req, res) {
        Move.find({}, function (err, moves) {
            var names = ["guard", "hit", "ch"];
            _.each(moves, function (move) {
                _.each(names, function (name) {
                    var guardFrames = move[name].match(/〜|~/g);
                    if (guardFrames !== null && guardFrames.length !== 0) {
                        var frames = move[name].match(/(\+|-|)?[0-9]+/g),
                            max,
                            min;
                        if (frames[0] < frames[1]) {
                            max = frames[1];
                            min = frames[0];
                        } else {
                            max = frames[0];
                            min = frames[1];
                        }
                        move["_" + name + "_min"] = min;
                        move["_" + name + "_max"] = max;
                    } else {
                        var frame = move[name].match(/(\+|-|)?[0-9]+/g);
                        if (frame !== null && frame.length !== 0) {
                            frame = frame[0];
                        } else {
                            frame = null;                            
                        }
                        move["_" + name + "_min"] = frame;
                        move["_" + name + "_max"] = frame;
                    }
                });
                move.save(function() {});
            });
        });
    },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to MoveController)
   */
  _config: {}

  
};
