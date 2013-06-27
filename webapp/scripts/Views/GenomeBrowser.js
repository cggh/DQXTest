define(["require", "DQX/Application", "DQX/Framework", "DQX/HistoryManager", "DQX/Controls", "DQX/Msg", "DQX/DocEl", "DQX/Utils", "DQX/ChannelPlot/GenomePlotter", "DQX/ChannelPlot/ChannelYVals", "DQX/ChannelPlot/ChannelSequence", "DQX/DataFetcher/DataFetchers", "DQX/DataFetcher/DataFetcherSummary", "MetaData"],
    function (require, Application, Framework, HistoryManager, Controls, Msg, DocEl, DQX, GenomePlotter, ChannelYVals, ChannelSequence, DataFetchers, DataFetcherSummary, MetaData) {

        var GenomeBrowserModule = {

            init: function () {
                var that = Application.View('genomebrowser','Genome browser');

                that.createFrames = function(rootFrame) {
                    rootFrame.makeGroupHor();

                    this.frameControls = rootFrame.addMemberFrame(Framework.FrameFinal('', 0.3));
                    this.frameBrowser = rootFrame.addMemberFrame(Framework.FrameFinal('GenomeBrowser', 0.7));
                }

                that.createPanels = function() {
                    var browserConfig = {
                        database: MetaData.database,
                        serverURL: MetaData.serverUrl,
                        annotTableName: MetaData.tableAnnotation,
                        chromnrfield: 'chrom',
                        viewID: '',
                        canZoomVert: true
                    };
                    this.panelBrowser = GenomePlotter.Panel(this.frameBrowser, browserConfig);

                    //Define chromosomes
                    $.each(MetaData.chromosomes,function(idx,chromosome) {
                        that.panelBrowser.addChromosome(chromosome.id, chromosome.id, chromosome.len);
                    });

               }


                return that;
            }

        };

        return GenomeBrowserModule;
    });