
if (typeof versionString == 'undefined')
    alert('Fatal error: versionString is missing');
require.config({
    baseUrl: "scripts",
    paths: {
        jquery: "DQX/Externals/jquery",
        d3: "DQX/Externals/d3",
        handlebars: "DQX/Externals/handlebars",
        markdown: "DQX/Externals/markdown",
        DQX: "DQX"
    },
    shim: {
        d3: {
            exports: 'd3'
        },
        handlebars: {
            exports: 'Handlebars'
        }
    },
    waitSeconds: 15,
    urlArgs: "version="+versionString
});

require(["jquery", "DQX/Application", "DQX/Framework", "DQX/Msg", "DQX/HistoryManager", "DQX/Utils", "Views/Intro", "Views/GenomeBrowser", "Views/FormDemo"],
    function ($, Application, Framework, Msg, HistoryManager, DQX, Intro, GenomeBrowser, FormDemo) {
        $(function () {

            //Check the the browser supports the features we need
            if ((!Modernizr.canvas) || (!Modernizr.canvastext) || (!Modernizr.svg)) {
                $('#Div1').html($('#OldBrowser').html());//If not, set an error message
                return;
            }



            Intro.create();
            FormDemo.create();
            GenomeBrowser.create();

            Application.customInitFunction = function(proceedFunction) {
                //alert('fetching data...');
                proceedFunction();
            }

            Application.init('Test application');

            //Global initialisation of utilities



        });
    });
