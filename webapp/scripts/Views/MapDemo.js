define(["require", "DQX/Application", "DQX/Framework", "DQX/Controls", "DQX/Msg", "DQX/DocEl", "DQX/Utils", "DQX/Map", "DQX/SVG", "DQX/MapUtils", "DQX/Popup", "MetaData"],
    function (require, Application, Framework, Controls, Msg, DocEl, DQX, Map, SVG, MapUtils, Popup, MetaData) {

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

                    // Create the Google Maps object that is drawn in the Map frame
                    this.myMap = Map.GMap(
                        this.frameMap,      // Frame this map should be placed in
                        Map.Coord(0, 0),    // Central point of the initial view
                        4                   // Google Maps zoom level number of the initial view
                    );

                    that.createSamplePointSet1();
                    that.createSamplePointSet2();
                    that.createSamplePieCharts();
                }

                that.createSamplePointSet1 = function() {
                    // This creates a set of points indicated with a bitmap icon, without labels

                    // Instantiate a point set object
                    var pointset = Map.PointSet(
                        'Sample_Points1',                   // Identifier for this object on the map
                        this.myMap,                         // Map object this should be drawn on
                        0,                                  // Minimum Google Maps zoom level. Below this level, the points will not be drawn
                        "Bitmaps/circle_blue_small.png"     // Bitmap to draw for each point
                    );
                    // Create a vector containing the point data
                    var pts = [];
                    for (var i = 0; i < 500; i++)
                        pts.push({
                            id: i,                                                                              // Unique identifier for the point
                            longit: Math.random()*360 - 180,                                                    // Longitude
                            lattit: ( 0.75 * Math.pow(Math.random()*2-1,3) + 0.25*(Math.random()*2-1) ) * 85    // Lattitude
                        });
                    // Attach the point data vector
                    pointset.setPoints(pts);
                    // Define a callback function for when a user clicks a point
                    pointset.setPointClickCallBack(function(id) {
                        Popup.create('Info','Point clicked on set 1: '+id);
                    });

                }


                that.createSamplePointSet2 = function() {
                    // This creates a set of points indicated with a bitmap icon, and with labels

                    // Instantiate a point set object
                    var pointset = Map.PointSet(
                        'Sample_Points2',                   // Identifier for this object on the map
                        this.myMap,                         // Map object this should be drawn on
                        0,                                  // Minimum Google Maps zoom level. Below this level, the points will not be drawn
                        "Bitmaps/circle_red_small.png",     // Bitmap to draw for each point
                        {
                            showMarkers: true,              // Show marker points
                            showLabels: true,               // Show labels
                            labelScaleFactor: 1.5           // Label relative size factor
                        }
                    );
                    // Create a vector containing the point data
                    var pts = [];
                    for (var i = 0; i < 40; i++)
                        pts.push({
                            id: i,                                                                              // Unique identifier for the point
                            longit: Math.random()*360 - 180,                                                    // Longitude
                            lattit: ( 0.75 * Math.pow(Math.random()*2-1,3) + 0.25*(Math.random()*2-1) ) * 85,   // Lattitude
                            labelName: 'Label '+ i.toString()                                                   // Label of the point
                        });
                    // Attach the point data vector
                    pointset.setPoints(pts);
                    // Define a callback function for when a user clicks a point
                    pointset.setPointClickCallBack(function(id) {
                        Popup.create('Info','Point clicked on set 2: '+id);
                    });

                }

                that.createSamplePieCharts = function() {

                    // Create some fictitious data for the pie charts
                    var piechartData = [
                        { location:Map.Coord(10,5), radius: 200, fractions:[0.2,0.4,0.4] },
                        { location:Map.Coord(11,0), radius: 300, fractions:[0.6,0.3,0.1] },
                        { location:Map.Coord(10,2), radius: 350, fractions:[0.1,0.9,0.1] },
                        { location:Map.Coord(12,2), radius: 450, fractions:[0.2,0.2,0.6] }
                    ];

                    // Colors that will be used to draw the charts
                    var colors=[ DQX.Color(1,0,0), DQX.Color(0,0,1), DQX.Color(0,0.7,0.4) ];

                    // Create the object that will layout & draw the pie charts on the map
                    var piecharts = MapUtils.PieChartLayouter(
                        this.myMap,     // Map object the pie charts will be drawn to
                        0.6             // Offset for each pie chart, allowing the layouter to arrange the charts optimally (relative to average pie chart radius)
                    );

                    // Create all the pie charts
                    $.each(piechartData, function(idx, chartData) {
                        var chart = SVG.PieChart(); //Create the pie chart for this site
                        chart.nr = idx; // we will use this in the click handler
                        $.each(chartData.fractions,function(idx2,frac) {
                            chart.addPart(  // Add a pie to the chart
                                frac,                                   // Fraction of this pie
                                colors[idx2],                           // Color of this pie
                                null,                                   // Identifier (can be empty)
                                'Chart '+(idx+1)+', Part '+(idx2+1)     // Title (shown when hovering over the pie)
                            );
                        })

                        // Add the pie chart to the piechart map layouter
                        piecharts.addPieChart(
                            chartData.location,             // Geographical coordinates of the center
                            chart,                          // The actual pie chart
                            chartData.radius               // The displayed radius (in km)
                        );
                    })

                    // Define a handler for when a user clicks a pie chart
                    piecharts.setOnClickCallBack(function(theChart,thePieNr) {
                        Popup.create('Info','You clicked on chart {chart}, pie {pie}, having fraction {fr}'.DQXformat( {
                            chart: (theChart.nr+1),
                            pie: (thePieNr+1),
                            fr: piechartData[theChart.nr].fractions[thePieNr]
                        } ));
                    });

                }


                return that;
            }

        };

        return MapDemoModule;
    });