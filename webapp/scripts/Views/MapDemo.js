define(["require", "DQX/Application", "DQX/Framework", "DQX/HistoryManager", "DQX/Controls", "DQX/Msg", "DQX/DocEl", "DQX/Utils", "DQX/Map", "MetaData"],
    function (require, Application, Framework, HistoryManager, Controls, Msg, DocEl, DQX, Map, MetaData) {

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

                }


                return that;
            }

        };

        return MapDemoModule;
    });