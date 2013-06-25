define(["require", "DQX/Application", "DQX/Framework", "DQX/HistoryManager", "DQX/Controls", "DQX/Msg", "DQX/DocEl", "DQX/Utils"],
    function (require, Application, Framework, HistoryManager, Controls, Msg, DocEl, DQX) {

        var GenomeBrowserModule = {

            init: function () {
                var that = Application.View('genomebrowser','Genome browser');

                that.createFrames = function(rootFrame) {
                }

                that.createPanels = function() {
                }


                return that;
            }

        };

        return GenomeBrowserModule;
    });