define(["require", "DQX/Application", "DQX/Framework", "DQX/HistoryManager", "DQX/Controls", "DQX/Msg", "DQX/DocEl", "DQX/Utils", "MetaData"],
    function (require, Application, Framework, HistoryManager, Controls, Msg, DocEl, DQX, MetaData) {

        var FormDemoModule = {

            init: function () {
                var that = Application.View('formdemo','Form demo');

                //This function is called during the initialisation. Create the frame structure of the view here
                that.createFrames = function(rootFrame) {
                    rootFrame.makeGroupHor();//Define the root frame as a horizontal layout of member frames

                    var leftGroup = rootFrame.addMemberFrame(Framework.FrameGroupVert('', 0.5));
                    rootFrame.addMemberFrame(Framework.FrameFinal('', 0.5));

                    this.frameForm = leftGroup.addMemberFrame(Framework.FrameFinal('', 0.5));

                    var tabGroup = leftGroup.addMemberFrame(Framework.FrameGroupTab('', 0.5));
                    tabGroup.addMemberFrame(Framework.FrameFinal('', 0.5)).setDisplayTitle('tab item 1');
                    tabGroup.addMemberFrame(Framework.FrameFinal('', 0.5)).setDisplayTitle('tab item 2');
                }



                //This function is called during the initialisation. Create the panels that will populate the frames here
                that.createPanels = function() {
                    this.panelForm = Framework.Form(this.frameForm);
                    this.panelForm.setPadding(10);

                }


                return that;
            }

        };

        return FormDemoModule;
    });