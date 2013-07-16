
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






require(["jquery", "DQX/Application", "DQX/Framework", "DQX/Msg", "DQX/Utils", "DQX/DataFetcher/DataFetchers", "MetaData", "Views/Intro", "Views/GenomeBrowser", "Views/TableViewer", "Views/FormDemo", "Views/MapDemo", "Views/ClusterSizePlot", "InfoPopups/SnpPopup", "InfoPopups/PopupFrameDemo" ],
    function ($, Application, Framework, Msg, DQX, DataFetchers, MetaData, Intro, GenomeBrowser, TableViewer, FormDemo, MapDemo, ClusterSizePlot, SnpPopup, PopupFrameDemo) {
        $(function () {

            //Initialise all the popup handlers
            SnpPopup.init();
            PopupFrameDemo.init();

            //Initialise all the views in the application
            Intro.init();
            FormDemo.init();
            GenomeBrowser.init();
            TableViewer.init();
            MapDemo.init();
            ClusterSizePlot.init();

            //Define the header content (top-left of the window)
            Application.setHeader('<a href="http://www.malariagen.net" target="_blank"><img src="Bitmaps/malariagen_logo.png" alt="MalariaGEN logo" align="top" style="border:0px;margin:7px"/></a>');


            //Provide a hook to fetch some data upfront from the server. Upon completion, 'proceedFunction' should be called;
            Application.customInitFunction = function(proceedFunction) {
                // Here, we will fetch the full data of a couple of tables on the servers proactively
                var getter = DataFetchers.ServerDataGetter();//Instantiate the fetcher object
                // Declare a first table for fetching
                getter.addTable(
                    'clustersites',                             // Name of the database table
                    [                                           // List of table columns (can be just names, or an object specifying id:column_name, tpe: data_type
                        'ID',
                        { id: 'Latitude', tpe: 'float' },
                        { id: 'Longitude', tpe: 'float' },
                        'Name'
                    ],
                    'ID'                                        // Column used for sorting the records
                );
                // Declare a second table for fetching
                getter.addTable('clustermembercount',['ID', { id: 'MaxDist', tpe: 'int' }, { id: 'ClusterSize', tpe: 'int' }, { id: 'ClusterMemberCount', tpe: 'int' } ], 'ID' );
                // Execute the fetching
                getter.execute(
                    MetaData.serverUrl,             // Url where DQXServer is running
                    MetaData.database,              // Name of the database
                    function() {                    // Callback function that is called when all tables are fetched
                        MetaData.clustersites = getter.getTableRecords('clustersites');                     // Store the result in the metadata
                        MetaData.clustermembercount = getter.getTableRecords('clustermembercount');
                        proceedFunction();                                                                  // Proceed with the initialisation
                    }
                );
            }


            //Initialise the application
            Application.init('Test application');




        });
    });
