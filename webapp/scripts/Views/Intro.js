define(["require", "DQX/Application", "DQX/Framework", "DQX/HistoryManager", "DQX/Controls", "DQX/Msg", "DQX/DocEl", "DQX/Utils", "MetaData"],
    function (require, Application, Framework, HistoryManager, Controls, Msg, DocEl, DQX, MetaData) {

        var IntroModule = {

            init: function () {
                var that = Application.View('start','Start page');

                //This function is called during the initialisation. Create the frame structure of the view here
                that.createFrames = function(rootFrame) {
                    rootFrame.makeFinal();//We have a single frame, no subdivisions
                    that.rootFrame=rootFrame;//Remember that frame for when we need to define the panel for it
                }

                //This function is called during the initialisation. Create the panels that will populate the frames here
                that.createPanels = function() {
                    this.panelForm = Framework.Form(this.rootFrame);//Create a panel of the type 'form'
                    this.panelForm.setPadding(10);

                    var bt = Controls.Button(null, { buttonClass: 'DQXToolButton2', content: "Genome browser", bitmap:DQX.BMP('arrow4down.png'), width:120, height:50 });
                    bt.setOnChanged(function() {
                        Application.activateView('genomebrowser');
                    })
                    this.panelForm.addControl(bt);

                    var bt = Controls.Button(null, { buttonClass: 'DQXToolButton2', content: "Form demo", bitmap:DQX.BMP('arrow4down.png'), width:120, height:50 });
                    bt.setOnChanged(function() {
                        Application.activateView('formdemo');
                    })
                    this.panelForm.addControl(bt);

                    var fu = Controls.FileUpload(null, { serverUrl: MetaData.serverUrl  });
                    fu.setOnChanged(function() {
                        alert('File uploaded to server file '+fu.getValue());
                    });
                    this.panelForm.addControl(fu);


                }


                return that;
            }

        };

        return IntroModule;
    });