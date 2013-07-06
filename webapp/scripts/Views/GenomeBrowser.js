define(["require", "DQX/Application", "DQX/Framework", "DQX/HistoryManager", "DQX/Controls", "DQX/Msg", "DQX/DocEl", "DQX/Utils", "DQX/ChannelPlot/GenomePlotter", "DQX/ChannelPlot/ChannelYVals", "DQX/ChannelPlot/ChannelSequence", "DQX/DataFetcher/DataFetchers", "DQX/DataFetcher/DataFetcherSummary", "MetaData"],
    function (require, Application, Framework, HistoryManager, Controls, Msg, DocEl, DQX, GenomePlotter, ChannelYVals, ChannelSequence, DataFetchers, DataFetcherSummary, MetaData) {

        var GenomeBrowserModule = {

            init: function () {
                var that = Application.View('genomebrowser','Genome browser');



                //This function is called during the initialisation. Create the frame structure of the view here
                that.createFrames = function(rootFrame) {
                    rootFrame.makeGroupHor();//Declare the root frame as a horizontally divided set of subframes
                    this.frameControls = rootFrame.addMemberFrame(Framework.FrameFinal('', 0.3));//Create frame that will contain the controls panel
                    this.frameBrowser = rootFrame.addMemberFrame(Framework.FrameFinal('', 0.7));//Create frame that will contain the genome browser panel
                }



                //This function is called during the initialisation. Create the panels that will populate the frames here
                that.createPanels = function() {
                    this.panelControls = Framework.Form(this.frameControls);//This panel will contain controls for switching on/off channels on the genome browser
                    this.channelControls=[];//this will accumulate the check boxes that control the visibility of channels
                    this.createPanelBrowser();
                    that.panelControls.addControl(Controls.CompoundVert(this.channelControls));//Add the controls to the form, as a vertical stack
                };


                that.createPanelBrowser = function() {

                    //Browser configuration settings
                    var browserConfig = {
                        serverURL: MetaData.serverUrl,              //Url of the DQXServer instance used
                        database: MetaData.database,                //Database name
                        annotTableName: MetaData.tableAnnotation,   //Name of the table containing the annotation
                        chromnrfield: 'chrom',                      //Specifies that chromosomes are identifier by *numbers* in the field 'chrom'
                                                                    //*NOTE*: chromosome identifiers can be used by specifying chromoIdField: 'chromid'
                        viewID: '',
                        canZoomVert: true                           //Viewer contains buttons to alter the vertical size of the channels
                    };
                    //Initialise a genome browser panel
                    this.panelBrowser = GenomePlotter.Panel(this.frameBrowser, browserConfig);

                    //Define chromosomes
                    $.each(MetaData.chromosomes,function(idx,chromosome) {
                        that.panelBrowser.addChromosome(chromosome.id, chromosome.id, chromosome.len);//provide identifier, name, and size in megabases
                    });

                    that.createFrequencyChannels();
                    that.createSummaryChannels();
                };


                //Creates the channel in the browser that displays allele frequencies
                that.createFrequencyChannels = function() {
                    //Create the data fetcher that will get the frequency values from the server
                    this.dataFetcherSNPs = new DataFetchers.Curve(
                        MetaData.serverUrl,     //url of the DQXServer instance providing the data
                        MetaData.database,      //name of the database
                        MetaData.tableSNPInfo   //name of the table containing the data
                    );

                    //add snpid column to the datafetcher, not plotted but needed for the tooltip & click actions
                    this.dataFetcherSNPs.addFetchColumnActive("snpid", "String");

                    //Create the channel in the browser that will contain the frequency values
                    var theChannel = ChannelYVals.Channel(null, { minVal: 0, maxVal: 1 });
                    theChannel
                        .setTitle("Frequencies")        //sets the title of the channel
                        .setHeight(120)                 //sets the height of the channel, in pixels
                        .setMaxViewportSizeX(5.0e5)     //if more than 5e5 bases are in the viewport, this channel is not shown
                        .setChangeYScale(false,true);   //makes the scale adjustable by dragging it
                    that.panelBrowser.addChannel(theChannel, false);//Add the channel to the browser

                    //Iterate over all frequencies, and add a component to the channel
                    $.each(MetaData.populations, function(idx,population) {
                        var plotcomp = theChannel.addComponent(ChannelYVals.Comp(null, that.dataFetcherSNPs, population.freqid), true);//Create the component
                        plotcomp.myPlotHints.color = population.color;//define the color of the component
                        plotcomp.myPlotHints.pointStyle = 1;//chose a sensible way of plotting the points
                        that.channelControls.push(theChannel.createComponentVisibilityControl(population.freqid, population.name, true));//Create a visibility checkbox for the component, and add to the list of controls
                    });

                    //Define the tooltip shown when a user hovers the mouse over a point in the channel
                    theChannel.getToolTipContent = function(compID, pointIndex) {
                        var snpid = that.dataFetcherSNPs.getColumnPoint(pointIndex, "snpid");
                        var value = that.dataFetcherSNPs.getColumnPoint(pointIndex, compID);
                        return snpid+'<br/>'+compID+'= '+value.toFixed(3);
                    };

                    //Define the action when a user clicks on a point in the channel
                    theChannel.handlePointClicked = function(compID, pointIndex) {
                        var snpid = that.dataFetcherSNPs.getColumnPoint(pointIndex, "snpid");
                        alert('SNP id: '+snpid);
                        //Msg.send({ type: 'ShowSNPPopup' }, snpid);
                    };
                }




                //Creates channels in the browser that displaying various summary properties
                that.createSummaryChannels = function() {
                    //Create the data fetcher that will get the summary values from the server
                    this.dataFetcherProfiles = new DataFetcherSummary.Fetcher(
                        MetaData.serverUrl,     //url of the DQXServer instance providing the data
                        1,                      //minimum block size of the finest grained block
                        800                     //desired number of data points filling the viewport
                    );

                    //Iterate over all summary profiles shown by the app
                    $.each(MetaData.summaryProfiles,function(idx,profile) {
                        var folder=MetaData.summaryFolder+'/'+profile.id;//The server folder where to find the info, relative to the DQXServer base path
                        var SummChannel = ChannelYVals.Channel(null, { minVal: 0, maxVal: 100 });//Create the channel
                        SummChannel
                            .setTitle(profile.name).setHeight(120, true)
                            .setChangeYScale(true,true);//makes the scale adjustable by dragging it
                        that.panelBrowser.addChannel(SummChannel);//Add the channel to the browser
                        that.channelControls.push(SummChannel.createVisibilityControl());//Create a visibility checkbox for the component, and add to the list of controls

                        //Create the min-max range
                        var colinfo_min = that.dataFetcherProfiles.addFetchColumn(folder, MetaData.summaryConfig, profile.id + "_min");//get the min value from the fetcher
                        var colinfo_max = that.dataFetcherProfiles.addFetchColumn(folder, MetaData.summaryConfig, profile.id + "_max");//get the max value from the fetcher
                        SummChannel.addComponent(ChannelYVals.YRange(null, that.dataFetcherProfiles, colinfo_min.myID, colinfo_max.myID, DQX.Color(0.3, 0.3, 0.7, 0.35)), true);//Define the range component

                        //Create the average value profile
                        var colinfo_avg = that.dataFetcherProfiles.addFetchColumn(folder, MetaData.summaryConfig, profile.id + "_avg");//get the avg value from the fetcher
                        var comp = SummChannel.addComponent(ChannelYVals.Comp(null, that.dataFetcherProfiles, colinfo_avg.myID), true);//Add the profile to the channel
                        comp.setColor(DQX.Color(0, 0, 0.5));
                        comp.myPlotHints.makeDrawLines(3000000.0); //that causes the points to be connected with lines
                        comp.myPlotHints.interruptLineAtAbsent = true;
                        comp.myPlotHints.drawPoints = false;

                    })

                }


                return that;
            }

        };

        return GenomeBrowserModule;
    });