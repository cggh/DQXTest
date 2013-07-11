define(["require", "DQX/Application", "DQX/Framework", "DQX/HistoryManager", "DQX/Controls", "DQX/Msg", "DQX/DocEl", "DQX/Utils", "DQX/Map", "DQX/SVG", "MetaData"],
    function (require, Application, Framework, HistoryManager, Controls, Msg, DocEl, DQX, Map, SVG, MetaData) {

        var MapDemoModule = {

            init: function () {
                // Instantiate the view object
                var that = Application.View(
                    'mapdemo',     // View ID
                    'Map demo'     // View title
                );

                //This function is called during the initialisation. Create the frame structure of the view here
                that.createFrames = function(rootFrame) {
                    rootFrame.makeGroupHor();//Define the root frame as a horizontal layout of member frames

                    var leftGroup = rootFrame.addMemberFrame(Framework.FrameGroupVert('', 0.4));
                    this.frameMap = rootFrame.addMemberFrame(Framework.FrameFinal('', 0.6));

                    leftGroup.addMemberFrame(Framework.FrameFinal('', 0.6));

                    var tabGroup = leftGroup.addMemberFrame(Framework.FrameGroupTab('', 0.5));
                    tabGroup.addMemberFrame(Framework.FrameFinal('', 0.5)).setDisplayTitle('tab item 1');
                    tabGroup.addMemberFrame(Framework.FrameFinal('', 0.5)).setDisplayTitle('tab item 2');
                }



                //This function is called during the initialisation. Create the panels that will populate the frames here
                that.createPanels = function() {
                    this.myMap = Map.GMap(this.frameMap, Map.Coord(0, 0), 2);
/*
                    var pointset = Map.PointSet('ResistMapSiteMapPointsInactive', this.myMap, 0, "Bitmaps/circle_blue_small.png");
                    var pts = [];
                    for (var i = 0; i < 100; i++)
                        pts.push({
                            id: toString(i),
                            longit: Math.random()*180 - 90,
                            lattit: Math.random()*60 - 30,
                            labelName: 'Label '+ toString(i)
                        });
                    pointset.setPoints(pts);
*/

                    //Create pie charts
                    var graphics = Map.MapItemLayouter(this.myMap, 'resistinfo');
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
                        if (parseInt(members.MaxDist) == maxdist) {
                            var site = sitesMap[members.ID];
                            site.sampleCount += parseInt(members.ClusterMemberCount);
                            site.sizes.push({size:parseInt(members.ClusterSize), membercount:parseInt(members.ClusterMemberCount)});
                        }
                    });

                    $.each(clustersites,function(idx,clustersite) {
                        clustersite.radius = 20.0 * Math.pow(clustersite.sampleCount, 0.35);
                    });


                    $.each(clustersites,function(idx,clustersite) {
                        graphics.addItem(parseFloat(clustersite.Longitude), parseFloat(clustersite.Latitude), clustersite.radius);
                    })

                    graphics.calculatePositions();

                    $.each(clustersites,function(idx,clustersite) {

                        var chart = SVG.PieChart();

                        var sizes = clustersite.sizes;
                        sizes.sort(DQX.ByProperty('size'));

                        $.each(sizes,function(idx,size) {
                            var fr = size.size/15.0;
                            fr=Math.min(fr,1);
                            var col = DQX.Color(
                                1,
                                1-fr*fr,
                                1-Math.pow(fr,0.75)
                                );
                            chart.addPart(size.membercount*1.0/clustersite.sampleCount, col, 'id', 'title');
                        });



                        var pie = Map.Overlay.PieChart(that.myMap, "MarkerFreq_" + clustersite.ID,
                            Map.Coord(graphics.items[idx].longit2, graphics.items[idx].lattit2),
                            clustersite.radius, chart);
                        pie.setOrigCoord(Map.Coord(parseFloat(clustersite.Longitude), parseFloat(clustersite.Latitude) ));
/*                        pie.name = item.Name;
                        pie.onClick = $.proxy(that._createPopup, that);*/

                    })

                }


                return that;
            }

        };

        return MapDemoModule;
    });