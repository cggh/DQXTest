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
                    this.panelControls = Framework.Form(this.frameControls);

                    this.channelControls=[];//this will accumulate the check boxes that control the visibility of channels

                    this.createPanelBrowser();

                    that.panelControls.addControl(Controls.CompoundVert(this.channelControls));

                }

                that.createPanelBrowser = function() {

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






                    this.dataFetcherSNPs = new DataFetchers.Curve(MetaData.serverUrl, MetaData.database, MetaData.tableSNPInfo, 'pos');


                    var theChannel = ChannelYVals.Channel(null, { minVal: 0, maxVal: 1 });
                    theChannel.setTitle("Frequencies");
                    theChannel.setHeight(120);
                    that.panelBrowser.addChannel(theChannel, false);
                    $.each(MetaData.populations, function(idx,population) {
                        var plotcomp = theChannel.addComponent(ChannelYVals.Comp(null, that.dataFetcherSNPs, population.freqid), true);
                        plotcomp.myPlotHints.color = population.color;
                        plotcomp.myPlotHints.pointStyle = 1;
                        that.channelControls.push(theChannel.createComponentVisibilityControl(population.freqid,population.name, true));
                    });






                    this.dataFetcherProfiles = new DataFetcherSummary.Fetcher(MetaData.serverUrl, 1, 600);

                    var profid='GC300';
                    var folder='Tracks-PfPopGen2.1/GC300';
                    var config='Summ01';
                    var SummChannel = ChannelYVals.Channel(null, { minVal: 0, maxVal: 100 });
                    SummChannel.setTitle('Title');
                    SummChannel.setHeight(120, true);
                    that.panelBrowser.addChannel(SummChannel);
                    that.channelControls.push(SummChannel.createVisibilityControl());

                    var colinfo_min = this.dataFetcherProfiles.addFetchColumn(folder, config, profid + "_min");
                    var colinfo_max = this.dataFetcherProfiles.addFetchColumn(folder, config, profid + "_max");
                    SummChannel.addComponent(ChannelYVals.YRange(null, this.dataFetcherProfiles, colinfo_min.myID, colinfo_max.myID, DQX.Color(0.3, 0.3, 0.7, 0.25)), true);

                    var colinfo_avg = this.dataFetcherProfiles.addFetchColumn(folder, config, profid + "_avg");
                    var comp = SummChannel.addComponent(ChannelYVals.Comp(null, this.dataFetcherProfiles, colinfo_avg.myID), true);
                    comp.setColor(DQX.Color(0, 0, 0.5));
                    comp.myPlotHints.makeDrawLines(3000000.0); //This causes the points to be connected with lines
                    comp.myPlotHints.interruptLineAtAbsent = true;
                    comp.myPlotHints.drawPoints = false;

                }


                return that;
            }

        };

        return GenomeBrowserModule;
    });