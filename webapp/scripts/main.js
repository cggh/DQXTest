
//Versionstring is supposed to be defines in main.html
//It is used to differentiate different versions, preventing them from being cached
if (typeof versionString == 'undefined')
    alert('Fatal error: versionString is missing');

//Configuration of require.js
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


require(["jquery", "DQX/Application", "DQX/Framework", "DQX/Msg", "DQX/HistoryManager", "DQX/Utils", "Views/Intro", "Views/GenomeBrowser", "Views/TableViewer", "Views/FormDemo"],
    function ($, Application, Framework, Msg, HistoryManager, DQX, Intro, GenomeBrowser, TableViewer, FormDemo) {
        $(function () {

            //Initialise all the views in the application
            Intro.init();
            FormDemo.init();
            GenomeBrowser.init();
            TableViewer.init();

            Application.setHeader('Here comes the application header');

            //Provide a hook to fetch some data upfront from the server. Upon completion, 'proceedFunction' should be called;
            Application.customInitFunction = function(proceedFunction) {
                //Load data here
                proceedFunction();
            }

            //Initialise the application
            Application.init('Test application');




        });
    });
