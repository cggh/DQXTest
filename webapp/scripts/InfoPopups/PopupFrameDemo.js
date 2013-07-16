define(["require", "DQX/Application", "DQX/Framework", "DQX/HistoryManager", "DQX/Controls", "DQX/Msg", "DQX/DocEl", "DQX/Utils", "DQX/PopupFrame", "DQX/DataFetcher/DataFetchers", "MetaData"],
    function (require, Application, Framework, HistoryManager, Controls, Msg, DocEl, DQX, PopupFrame, DataFetchers, MetaData) {

        var PopupFrameDemo = {
        };

        PopupFrameDemo.init = function() {
            //Initiase the event listener
            Msg.listen('', { type: 'ShowPopupFrameDemo' }, function (context, snpid) {
                PopupFrameDemo.create();
            });
        }

        //This function is called by the event listener
        PopupFrameDemo.create = function() {

            // Instantiate the PopupFrame object
            var that = PopupFrame.PopupFrame('PopupFrameDemo', { title: 'Popup frame demo', sizeX: 700, sizeY: 400 });

            //This function is called during the initialisation. Create the frame structure of the view here
            that.createFrames = function(frameRoot) {
                frameRoot.makeGroupTab();

                this.frame1 = frameRoot.addMemberFrame(Framework.FrameFinal('', 0.5)).setDisplayTitle('Tab 1');

                var tab2 = frameRoot.addMemberFrame(Framework.FrameGroupHor('', 0.5)).setDisplayTitle('Tab 2');

                tab2.addMemberFrame(Framework.FrameFinal('', 0.5)).setDisplayTitle('Tab 2 comp 1');
                tab2.addMemberFrame(Framework.FrameFinal('', 0.5)).setDisplayTitle('Tab 2 comp 2');
            }

            //This function is called during the initialisation. Create the panels that will populate the frames here
            that.createPanels = function() {
                this.panelForm = Framework.Form(this.frame1);
                this.panelForm.setPadding(10);

                // Add a button that creates a popup frame demo
                var bt = Controls.Button(null, { buttonClass: 'DQXToolButton2', content: "Popup frame demo", bitmap:'Bitmaps/circle_blue_small.png', width:150, height:50 });
                bt.setOnChanged(function() {
                    Msg.send({ type: 'ShowPopupFrameDemo' });
                })
                this.panelForm.addControl(bt);
            }

            // Call this function to actually create & render the popup frame
            that.create();

        }

        return PopupFrameDemo;
    });