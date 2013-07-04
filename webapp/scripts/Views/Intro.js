define(["require", "DQX/Application", "DQX/Framework", "DQX/HistoryManager", "DQX/Controls", "DQX/Msg", "DQX/DocEl", "DQX/Utils", "MetaData"],
    function (require, Application, Framework, HistoryManager, Controls, Msg, DocEl, DQX, MetaData) {

        var IntroModule = {

            init: function () {
                var that = Application.View('start','Start page');

                that.createFrames = function(rootFrame) {
                    rootFrame.makeGroupHor();

                    var leftGroup = rootFrame.addMemberFrame(Framework.FrameGroupVert('', 0.5));
                    rootFrame.addMemberFrame(Framework.FrameFinal('', 0.5));

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

                    //Based on http://blog.new-bamboo.co.uk/2010/07/30/html5-powered-ajax-file-uploads and https://github.com/newbamboo/example-ajax-upload


                    var fu = Controls.FileUpload(null, { serverUrl: MetaData.serverUrl  });
/*                    bt.setOnChanged(function() {
                        Application.activateView('formdemo');
                    })*/
                    this.panelForm.addControl(fu);

/*
                    var st='<p/>';
                    st += '<input id="fileupload" type="file" name="filedata" onchange="alert(\'changed\')"/>';
                    this.panelForm.addControl(Controls.Label(st));

                    var obj=$('#fileupload');


                    var bt = Controls.Button(null, { buttonClass: 'DQXToolButton2', content: "Upload", bitmap:DQX.BMP('arrow4down.png'), width:120, height:50 });
                    bt.setOnChanged(function() {


                        var fileInput = document.getElementById('fileupload');
                        var file = fileInput.files[0];
                        var formData = new FormData();
                        formData.append('filedata', file);


                        var xhr = new XMLHttpRequest();

                        var onprogressHandler = function(evt) {
                            var percent = evt.loaded/evt.total*100;
                            console.log('Upload progress: ' + percent + '%');
                        }
                        xhr.upload.addEventListener('progress', onprogressHandler, false);
//                        xhr.upload.addEventListener('onload', function() { alert('completed...');}, false);

                        // Add any event handlers here...
                        xhr.onreadystatechange = function() {
                            if (xhr.readyState == 4)
                                alert('file uploaded: '+xhr.responseText);
                        }
                        xhr.open('POST', MetaData.serverUrl+'?datatype=uploadfile', true);
                        //xhr.send(formData);
                        xhr.send(file);
                    })
                    this.panelForm.addControl(bt);
  */

                }


                return that;
            }

        };

        return IntroModule;
    });