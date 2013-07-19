define(["require", "DQX/Application", "DQX/Framework", "DQX/HistoryManager", "DQX/Controls", "DQX/Msg", "DQX/DocEl", "DQX/Utils", "DQX/PopupFrame", "DQX/Popup", "DQX/DataFetcher/DataFetchers", "DQX/Map", "MetaData"],
    function (require, Application, Framework, HistoryManager, Controls, Msg, DocEl, DQX, PopupFrame, Popup, DataFetchers, Map, MetaData) {

        var PopupFrameDemo = {
        };

        PopupFrameDemo.init = function() {
            //Initialise the event listener
            Msg.listen('',
                {
                    type: 'ShowPopupFrameDemo' // ID of the event
                },
                function () { // Function executed when the message was received
                    var theFrame = PopupFrameDemo.Frame(); // Instantiate the popupframe object
                    theFrame.create(); // Create the popup and renders it to the DOM tree
                }
            );
        }

        //The Popup frame object
        PopupFrameDemo.Frame = function() {

            // Instantiate the PopupFrame object
            var that = PopupFrame.PopupFrame(
                'PopupFrameDemo',               // ID of this popup type. This will be used to remember position, size and other state information
                {
                    title: 'Popup frame demo',  // Title of the popup
                    sizeX: 700, sizeY: 400      // Default dimensions of the popup
                });

            //This function is called during the initialisation. Create the frame structure of the view here
            that.createFrames = function(frameRoot) {
                frameRoot.makeGroupTab(); // Define the top-level frame to be a tabbed environment

                this.frame1 = frameRoot.addMemberFrame(Framework.FrameFinal('', 0.5)).setDisplayTitle('A form');

                var tab2 = frameRoot.addMemberFrame(Framework.FrameGroupHor('', 0.5)).setDisplayTitle('A split panel');

                tab2.addMemberFrame(Framework.FrameFinal('', 0.5)).setDisplayTitle('Component 1');
                tab2.addMemberFrame(Framework.FrameFinal('', 0.5)).setDisplayTitle('Component 2');

                that.frameMap = frameRoot.addMemberFrame(Framework.FrameFinal('', 0.5)).setDisplayTitle('A map');
            }

            //This function is called during the initialisation. Create the panels that will populate the frames here
            that.createPanels = function() {
                that.createPanelForm();
                that.createPanelMap();
            }

            that.createPanelForm = function() {
                // Create a form-type panel and attach it to the frame this.frame1
                this.panelForm = Framework.Form(this.frame1);
                this.panelForm.setPadding(10);

                // Add some stuff to the form

                var st = Controls.Static('This is some static text in a form');

                var bt = Controls.Button(null, { buttonClass: 'DQXToolButton2', content: "A button", bitmap:'Bitmaps/circle_blue_small.png', width:150, height:50 });
                bt.setOnChanged(function() {
                    Popup.create('Info','The button was clicked');
                })


                this.panelForm.addControl(Controls.CompoundVert([st,bt]));
            }


            that.createPanelMap = function() {
                // Create the Google Maps object that is drawn in the Map frame
                this.myMap = Map.GMap(
                    this.frameMap,      // Frame this map should be placed in
                    Map.Coord(0, 0),    // Central point of the initial view
                    4                   // Google Maps zoom level number of the initial view
                );
            }

            return that;
        }

        return PopupFrameDemo;
    });