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

                //This function is called during the initialisation. Create the panels that will populate the frames here
                that.createPanels = function() {
                    this.panelForm = Framework.Form(this.rootFrame);//Create a panel of the type 'form'
                    this.panelForm.setPadding(10);

                    //Create start buttons for the views
                    this.panelForm.addControl(
                        Application.getView('genomebrowser').createActivationButton({       //View ID
                            content: "Genome browser",                                      // Button text
                            bitmap:DQX.BMP('arrow4down.png')                                // Button bitmap
                        }));

                    this.panelForm.addControl(
                        Application.getView('tableviewer').createActivationButton({
                            content: "Table viewer",
                            bitmap:DQX.BMP('arrow4down.png')
                        }));

                    this.panelForm.addControl(
                        Application.getView('formdemo').createActivationButton({
                            content: "Form demo",
                            bitmap:DQX.BMP('arrow4down.png')
                        }));

                    this.panelForm.addControl(
                        Application.getView('mapdemo').createActivationButton({
                            content: "Map demo",
                            bitmap:DQX.BMP('arrow4down.png')
                        }));

                    this.panelForm.addControl(
                        Application.getView('clustersizes').createActivationButton({
                            content: "Cluster sizes map",
                            bitmap:DQX.BMP('arrow4down.png')
                        }));


                    var fu = Controls.FileUpload(null, { serverUrl: MetaData.serverUrl  });
                    fu.setOnChanged(function() {
                        alert('File uploaded to server file '+fu.getValue());
                    });
                    this.panelForm.addControl(fu);


                    var bt = Controls.Button(null, { buttonClass: 'DQXToolButton2', content: "Post test", bitmap:DQX.BMP('arrow4down.png'), width:120, height:50 });
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
                    this.panelForm.addControl(bt);


                }


                return that;
            }

        };

        return IntroModule;
    });