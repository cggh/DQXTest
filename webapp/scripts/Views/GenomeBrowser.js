define(["require", "DQX/Application", "DQX/Framework", "DQX/HistoryManager", "DQX/Controls", "DQX/Msg", "DQX/DocEl", "DQX/Utils"],
    function (require, Application, Framework, HistoryManager, Controls, Msg, DocEl, DQX) {

        var GenomeBrowserModule = {

            create: function () {
                var that = Application.View('genomebrowser','Genome browser');
                return that;
            }

        };

        return GenomeBrowserModule;
    });