define(["require", "DQX/Application", "DQX/Framework", "DQX/HistoryManager", "DQX/Controls", "DQX/Msg", "DQX/DocEl", "DQX/Utils"],
    function (require, Application, Framework, HistoryManager, Controls, Msg, DocEl, DQX) {

        var IntroModule = {

            init: function () {
                var that = Application.View('start','Start page');

                that.createFrames = function(rootFrame) {
                    rootFrame.makeGroupHor();

                    var leftGroup = rootFrame.addMemberFrame(Framework.FrameGroupVert('', 0.5));
                    rootFrame.addMemberFrame(Framework.FrameFinal('GenomeBrowser', 0.5));

                    this.frameForm = leftGroup.addMemberFrame(Framework.FrameFinal('11', 0.5));

                    var tabGroup = leftGroup.addMemberFrame(Framework.FrameGroupTab('', 0.5));
                    tabGroup.addMemberFrame(Framework.FrameFinal('21', 0.5)).setDisplayTitle('tab item 1');
                    tabGroup.addMemberFrame(Framework.FrameFinal('21', 0.5)).setDisplayTitle('tab item 2');

                }

                that.createPanels = function() {
                    this.panelForm = Framework.Form(this.frameForm);
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

                }


                return that;
            }

        };

        return IntroModule;
    });