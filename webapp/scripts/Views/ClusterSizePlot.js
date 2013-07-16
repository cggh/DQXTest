define(["require", "DQX/Application", "DQX/Framework", "DQX/HistoryManager", "DQX/Controls", "DQX/Msg", "DQX/DocEl", "DQX/Utils", "DQX/Map", "DQX/SVG", "DQX/MapUtils", "MetaData"],
    function (require, Application, Framework, HistoryManager, Controls, Msg, DocEl, DQX, Map, SVG, MapUtils, MetaData) {

        var ClusterSizePlotModule = {

            init: function () {
                // Instantiate the view object
                var that = Application.View(
                    'clustersizes',     // View ID
                    'Cluster sizes'     // View title
                );

                //This function is called during the initialisation. Create the frame structure of the view here
                that.createFrames = function(rootFrame) {


                    rootFrame.makeGroupHor();//Define the root frame as a horizontal layout of member frames

                    var leftGroup = rootFrame.addMemberFrame(Framework.FrameGroupVert('', 0.4));
                    this.frameMap = rootFrame.addMemberFrame(Framework.FrameFinal('', 0.6));

                    leftGroup.addMemberFrame(Framework.FrameFinal('', 0.6));

/*                    var tabGroup = leftGroup.addMemberFrame(Framework.FrameGroupTab('', 0.5));
                    tabGroup.addMemberFrame(Framework.FrameFinal('', 0.5)).setDisplayTitle('tab item 1');
                    tabGroup.addMemberFrame(Framework.FrameFinal('', 0.5)).setDisplayTitle('tab item 2');*/
                }



                //This function is called during the initialisation. Create the panels that will populate the frames here
                that.createPanels = function() {

                    this.myMap = Map.GMap(this.frameMap, Map.Coord(0, 0), 2); // Create the Google Maps object that is drawn in the Map frame

                    //Create pie charts
                    var clustersites = MetaData.clustersites;
                    var clustermembers = MetaData.clustermembercount;

                    var maxdist = 1;

                    //Calculate sample count per site
                    var sitesMap = {}
                    $.each(clustersites,function(idx,clustersite) {
                        clustersite.sampleCount = 0;
                        clustersite.sizes = [];
                        sitesMap[clustersite.ID] = clustersite;
                    });
                    $.each(clustermembers,function(idx,members) {
                        if (members.MaxDist == maxdist) {
                            var site = sitesMap[members.ID];
                            site.sampleCount += members.ClusterMemberCount;
                            site.sizes.push({size:members.ClusterSize, membercount:members.ClusterMemberCount});
                        }
                    });

                    // Calculate pie chart radius for each site
                    $.each(clustersites,function(idx,clustersite) {
                        clustersite.radius = 40.0 * Math.pow(clustersite.sampleCount, 0.35);
                    });

                    // Create the object that will layout & draw the pie charts on the map
                    var piecharts = MapUtils.PieChartLayouter(
                        this.myMap,     // Map object the pie charts will be drawn to
                        0.6             // Offset for each pie chart, allowing the layouter to arrange the charts optimally (relative to average pie chart radius)
                    );

                    $.each(clustersites,function(idx,clustersite) {
                        //Create the pie chart for this site
                        var chart = SVG.PieChart();
                        chart.clustersite = clustersite; // We will use this in the click callback function

                        //Make sure the site clusters are sorted by size
                        var sizes = clustersite.sizes;
                        sizes.sort(DQX.ByProperty('size'));

                        //Add all the pies to the chart
                        $.each(sizes,function(idx,size) {
                            var fr = Math.min(1,size.size/15.0);
                            var col = DQX.Color(1,1-fr*fr,1-Math.pow(fr,0.75)); // Create a heat map color according to the cluster size
                            //Add the pie to the chart
                            chart.addPart(
                                size.membercount*1.0/clustersite.sampleCount,                   // Fraction of this pie
                                col,                                                            // Color of this pie
                                null,                                                           // Identifier (can be empty)
                                clustersite.Name+': Cluster size '+size.size+': '+size.membercount+' samples'   // Title (shown when hovering over the pie)
                            );
                        });

                        //Add the pie chart to the piechart map layouter
                        piecharts.addPieChart(
                            Map.Coord(clustersite.Longitude, clustersite.Latitude ),    // Geographical coordinates of the center
                            chart,                          // The actual pie chart
                            clustersite.radius              // The displayed radius (in km)
                        );
                    })

                }


                return that;
            }

        };

        return ClusterSizePlotModule;
    });