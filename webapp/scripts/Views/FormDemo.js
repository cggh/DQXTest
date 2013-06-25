define(["require", "DQX/Application", "DQX/Framework", "DQX/HistoryManager", "DQX/Controls", "DQX/Msg", "DQX/DocEl", "DQX/Utils"],
    function (require, Application, Framework, HistoryManager, Controls, Msg, DocEl, DQX) {

        var FormDemoModule = {

            init: function () {
                var that = Application.View('formdemo','Form demo');

                that.createFrames = function(rootFrame) {
                }

                that.createPanels = function() {
                }


                return that;
            }

        };

        return FormDemoModule;
    });