define(["require", "DQX/Application", "DQX/Framework", "DQX/HistoryManager", "DQX/Controls", "DQX/Msg", "DQX/DocEl", "DQX/Utils"],
    function (require, Application, Framework, HistoryManager, Controls, Msg, DocEl, DQX) {

        var FormDemoModule = {

            create: function () {
                var that = Application.View('formdemo','Form demo');
                return that;
            }

        };

        return FormDemoModule;
    });