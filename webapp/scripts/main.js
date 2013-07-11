
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






require(["jquery", "DQX/Application", "DQX/Framework", "DQX/Msg", "DQX/Utils", "DQX/DataFetcher/DataFetchers", "MetaData", "Views/Intro", "Views/GenomeBrowser", "Views/TableViewer", "Views/FormDemo", "Views/MapDemo", "InfoPopups/SnpPopup" ],
    function ($, Application, Framework, Msg, DQX, DataFetchers, MetaData, Intro, GenomeBrowser, TableViewer, FormDemo, MapDemo, SnpPopup) {
        $(function () {

            //Initialise all the popup handlers
            SnpPopup.init();

            //Initialise all the views in the application
            Intro.init();
            FormDemo.init();
            GenomeBrowser.init();
            TableViewer.init();
            MapDemo.init();

            //Define the header content (top-left of the window)
            Application.setHeader('<a href="http://www.malariagen.net" target="_blank"><img src="Bitmaps/malariagen_logo.png" alt="MalariaGEN logo" align="top" style="border:0px;margin:7px"/></a>');

            //Provide a hook to fetch some data upfront from the server. Upon completion, 'proceedFunction' should be called;
            Application.customInitFunction = function(proceedFunction) {
                //Load data here
                //Load data here
                var getter = DataFetchers.ServerDataGetter();
                getter.addTable('clustersites',['ID', 'Latitude', 'Longitude', 'Name'], 'ID' );
                getter.addTable('clustermembercount',['ID', 'MaxDist', 'ClusterSize', 'ClusterMemberCount'], 'ID' );
                getter.execute(MetaData.serverUrl, MetaData.database, function() {
                    MetaData.clustersites = getter.getTableRecords('clustersites');
                    MetaData.clustermembercount = getter.getTableRecords('clustermembercount');
                    proceedFunction();
                });
            }

            //Initialise the application
            Application.init('Test application');




        });
    });
