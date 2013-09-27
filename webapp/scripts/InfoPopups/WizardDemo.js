define(["require", "DQX/Application", "DQX/Framework", "DQX/HistoryManager", "DQX/Controls", "DQX/Msg", "DQX/DocEl", "DQX/Utils", "DQX/Wizard", "DQX/Popup", "DQX/DataFetcher/DataFetchers", "DQX/Map", "MetaData"],
    function (require, Application, Framework, HistoryManager, Controls, Msg, DocEl, DQX, Wizard, Popup, DataFetchers, Map, MetaData) {

        var WizardDemo = {
        };

        // Initialise the wizard
        WizardDemo.init = function() {
            //Create the wizard instance
            WizardDemo.theWizard = e(
                "WizardDemo",                         // ID of the wizard
                {
                    title: "Wizard demo",             // Wizard title
                    sizeX: 400,                       // X dimension
                    sizeY: 400                        // Y dimension
                }
            );

            // Create the pages
            WizardDemo.createPage1();
            WizardDemo.createPage2();

            //Initialise the event listener
            Msg.listen('', { type: 'ShowWizardDemo' }, function () {
                WizardDemo.execute();
            });
        }

        WizardDemo.createPage1 = function() {
            // Create the controls on this page
            WizardDemo.check1 = Controls.Check('check1', { label: 'Checkbox 1'});
            WizardDemo.check2 = Controls.Check('check2', { label: 'Checkbox 2'});
            // Assemble them into a single compound control
            var theControls = Controls.CompoundVert([
                WizardDemo.check1,
                WizardDemo.check2
            ]);

            WizardDemo.theWizard.addPage({
                id: 'page1',                            // ID of this page
                helpUrl: 'Doc/Help/WizardDemo.html',    // Document url containing a help page for this wizard (optional)
                form: theControls                       // Compound control that defines the form on this page
            });

        }

        WizardDemo.createPage2 = function() {
            // Create the controls on this page
            // Radio button group
            radioStates = [ { id:'state1', name:'Radio button option 1'}, { id:'state2', name:'Radio button option 2'}, { id:'state3', name:'Radio button option 3'} ];
            WizardDemo.radio1 = Controls.RadioGroup('radio1', { label:'Radio button group', states: radioStates, value:'state1' });
            // Edit box
            WizardDemo.edit1 = Controls.Edit('edit1', { value:'', size:30 });
            // Assemble them into a single compound control
            var theControls = Controls.CompoundVert([
                WizardDemo.radio1,
                Controls.VerticalSeparator(10),
                Controls.Static('Please enter some information:'),
                WizardDemo.edit1
            ])

            WizardDemo.theWizard.addPage({
                id: 'page2',                            // ID of this page
                helpUrl: 'Doc/Help/WizardDemo.html',    // Document url containing a help page for this wizard
                form: theControls                       // Compound control that defines the form on this page
            });

        }

        // Calling this function runs the wizard
        WizardDemo.execute = function() {
            WizardDemo.theWizard.run(function () { // Callback function executed when the wizard is completed
                var resultText = '';
                resultText += 'Checkbox 1: ' + WizardDemo.theWizard.getResultValue('check1') + '<br>';
                resultText += 'Checkbox 2: ' + WizardDemo.theWizard.getResultValue('check2') + '<br>';
                resultText += 'Radio buttons: ' + WizardDemo.theWizard.getResultValue('radio1') + '<br>';
                resultText += 'Edit box: ' + WizardDemo.theWizard.getResultValue('edit1') + '<br>';
                Popup.create('Wizard result',resultText);
            });

        }


        return WizardDemo;
    });