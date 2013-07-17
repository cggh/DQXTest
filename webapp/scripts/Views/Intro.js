define(["require", "DQX/Application", "DQX/Framework", "DQX/Controls", "DQX/Msg", "DQX/DocEl", "DQX/Utils", "MetaData"],
    function (require, Application, Framework, Controls, Msg, DocEl, DQX, MetaData) {

        var IntroModule = {

            init: function () {
                // Instantiate the view object
                var that = Application.View(
                    'start',        // View ID
                    'Start page'    // View title
                );

                //This function is called during the initialisation. Create the frame structure of the view here
                that.createFrames = function(rootFrame) {
                    rootFrame.makeFinal();//We have a single frame, no subdivisions
                    that.rootFrame=rootFrame;//Remember that frame for when we need to define the panel for it
                }

                // This function is called during the initialisation. Create the panels that will populate the frames here
                that.createPanels = function() {
                    //Create a single panel of the type 'form'. This is the start screen, and we will populate this with a number of buttons starting specific actions
                    this.panelForm = Framework.Form(this.rootFrame);
                    this.panelForm.setPadding(10);

                    var buttonRows =[]; // Each element in this array will contain a row of buttons
                    buttonRows.push(this.createViewButtons()); // Creates the row containing the buttons that will activate the different views in the app
                    buttonRows.push(this.createMiscButtons()); // Creates the row containing a misc set of other buttons
                    this.panelForm.addControl(Controls.CompoundVert(buttonRows)); // Add the rows of controls using a vertical stacker compound control
                }


                that.createViewButtons = function() {
                    var viewButtons = [];

                    viewButtons.push(
                        Application.getView('genomebrowser').createActivationButton({       // View ID
                            content: "Genome browser",                                      // Button text
                            bitmap: 'Bitmaps/circle_red_small.png'                          // Button bitmap
                        }));

                    viewButtons.push(
                        Application.getView('tableviewer').createActivationButton({
                            content: "Table viewer",
                            bitmap: 'Bitmaps/circle_red_small.png'
                        }));

                    viewButtons.push(
                        Application.getView('formdemo').createActivationButton({
                            content: "Form demo",
                            bitmap: 'Bitmaps/circle_red_small.png'
                        }));

                    viewButtons.push(
                        Application.getView('mapdemo').createActivationButton({
                            content: "Map demo",
                            bitmap: 'Bitmaps/circle_red_small.png'
                        }));

                    viewButtons.push(
                        Application.getView('clustersizes').createActivationButton({
                            content: "Cluster sizes map",
                            bitmap: 'Bitmaps/circle_red_small.png'
                        }));

                    // Return a horizontal row containing the view buttons
                    return Controls.CompoundHor(viewButtons);
                }


                that.createMiscButtons = function() {
                    var buttons = [];

                    // Add a button that creates a popup frame demo
                    var bt = Controls.Button(null, { buttonClass: 'DQXToolButton2', content: "Popup frame demo", bitmap:'Bitmaps/circle_blue_small.png', width:120, height:50 });
                    bt.setOnChanged(function() {
                        Msg.send({ type: 'ShowPopupFrameDemo' });
                    })
                    buttons.push(bt);

                    var bt = Controls.Button(null, { buttonClass: 'DQXToolButton2', content: "Post test", bitmap:'Bitmaps/circle_blue_small.png', width:120, height:50 });
                    bt.setOnChanged(function() {
                        var datastring='';
                        for (var i=0; i<1500; i++)
                            datastring+='AC01';
                        DQX.serverDataStore(MetaData.serverUrl,datastring,function(id) {
                            DQX.serverDataFetch(MetaData.serverUrl,id,function(content) {
                                alert('content length: '+content.length);
                            });
                        });
                    })
                    buttons.push(bt);

                    var fu = Controls.FileUpload(null, { serverUrl: MetaData.serverUrl  });
                    fu.setOnChanged(function() {
                        alert('File uploaded to server file '+fu.getValue());
                    });
                    buttons.push(fu);

                    // Return a horizontal row containing the buttons
                    return Controls.CompoundHor(buttons);
                }


                return that;
            }

        };

        return IntroModule;
    });