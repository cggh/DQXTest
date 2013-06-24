define(["require", "DQX/Application", "DQX/Framework", "DQX/HistoryManager", "DQX/Controls", "DQX/Msg", "DQX/DocEl", "DQX/Utils"],
    function (require, Application, Framework, HistoryManager, Controls, Msg, DocEl, DQX) {

        var IntroModule = {

            create: function () {
                var that = Application.View('start','Start page');

                that.createFrames = function(rootFrame) {
                    rootFrame.makeGroupHor();
                    //rootFrame.setSeparatorSize(Framework.sepSizeLarge);
                    var leftGroup = rootFrame.addMemberFrame(Framework.FrameGroupVert('GenomeBrowser1', 0.5));
                    rootFrame.addMemberFrame(Framework.FrameFinal('GenomeBrowser2', 0.5));

                    leftGroup.addMemberFrame(Framework.FrameFinal('11', 0.5)).setDisplayTitle('qqq');
                    var tabGroup = leftGroup.addMemberFrame(Framework.FrameGroupTab('12', 0.5));

                    tabGroup.addMemberFrame(Framework.FrameFinal('21', 0.5)).setDisplayTitle('tab item 1');
                    tabGroup.addMemberFrame(Framework.FrameFinal('21', 0.5)).setDisplayTitle('tab item 2');

                }

                return that;
            }

        };

        return IntroModule;
    });