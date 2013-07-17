define(["require", "DQX/Application", "DQX/Framework", "DQX/Controls", "DQX/Msg", "DQX/DocEl", "DQX/Utils", "DQX/Popup", "MetaData"],
    function (require, Application, Framework, Controls, Msg, DocEl, DQX, Popup, MetaData) {

        var FormDemoModule = {

            init: function () {
                // Instantiate the view object
                var that = Application.View(
                    'formdemo',     // View ID
                    'Form demo'     // View title
                );

                //This function is called during the initialisation. Create the frame structure of the view here
                that.createFrames = function(rootFrame) {
                    rootFrame.makeGroupHor();//Define the root frame as a horizontal layout of member frames

                    var leftGroup = rootFrame.addMemberFrame(Framework.FrameGroupVert('', 0.6));

                    rootFrame.addMemberFrame(Framework.FrameFinal('', 0.4));

                    this.frameForm = leftGroup.addMemberFrame(Framework.FrameFinal('', 0.5));

                    var tabGroup = leftGroup.addMemberFrame(Framework.FrameGroupTab('', 0.5));
                    tabGroup.addMemberFrame(Framework.FrameFinal('', 0.5)).setDisplayTitle('Tab item 1');

                    var tab2 = tabGroup.addMemberFrame(Framework.FrameGroupHor('', 0.5)).setDisplayTitle('Tab item 2');
                    tab2.addMemberFrame(Framework.FrameFinal('', 0.3));
                    tab2.addMemberFrame(Framework.FrameFinal('', 0.7));
                }



                //This function is called during the initialisation. Create the panels that will populate the frames here
                that.createPanels = function() {

                    this.panelForm = Framework.Form(this.frameForm); // Define a Form type panel, attached to the frame this.frameForm
                    this.panelForm.setPadding(10); // Defines a margin around the content of the form

                    var components = []; // This will accumulate all the components of the form

                    components.push(this.CreateExamples());
                    components.push(this.CreateTableLayout());
                    components.push(this.CreateInteractions());

                    this.panelForm.addControl(Controls.CompoundVert(components)); // Put all the components on the form, in a vertical layout
                }


                // Create an example for each type of control available
                that.CreateExamples = function() {
                    var examples = [];

                    // Static text
                    examples.push(Controls.Static('A piece of static text'));

                    // Check box
                    var chk = Controls.Check(null, {
                        label:'A checkbox',             // Label of the checkbox
                        value:true                      // Start value
                    })
                    chk.setOnChanged(function(controlID,theControl) { // Define event listener for value changes
                        Popup.create('Info','Checkbox status: '+theControl.getValue());
                    })
                    examples.push(chk);

                    // Button
                    var bt = Controls.Button(null, {
                        buttonClass: 'DQXToolButton2',              // Button css class
                        content: "A button",                        // Button text
                        bitmap:'Bitmaps/circle_blue_small.png',     // Button bitmap (optional)
                        width:120,                                  // width
                        height:25                                   // height
                    });
                    bt.setOnChanged(function() { // Define event listener for clicks
                        Popup.create('Info','Button clicked');
                    })
                    examples.push(bt);

                    // Hyperlink
                    var hl = Controls.Hyperlink(null, {
                        content:'Hyperlink-style button'            // Hyperlink content
                    });
                    hl.setOnChanged(function() { // Define event listener for clicks
                        Popup.create('Info','Hyperlink clicked');
                    })
                    examples.push(hl);

                    // Edit box
                    var edt = Controls.Edit(null, {
                        value:'Edit box',                           // Initial text
                        size:30,                                    // X size (number of characters)
                        hint:'This is a sample edit box'            // Tooltip hint
                    });
                    examples.push(edt);

                    // Combo box
                    comboStates = [ { id:'state1', name:'Combo box state 1'}, { id:'state2', name:'Combo box state 2'}, { id:'state3', name:'Combo box state 3'} ];
                    var cmb = Controls.Combo(null, {
                        label:'Combo box',                          // Text label left of the combo box
                        states: comboStates,                        // List of states
                        value:'state1',                             // Initial state
                        hint:'This is a sample combo box'           // Tooltip hint
                    });
                    cmb.setOnChanged(function(controlID, theControl) { // Define event listener for state changes
                        Popup.create('Info','Combo box status: '+theControl.getValue());
                    })
                    examples.push(cmb);


                    // Radio button group
                    radioStates = [ { id:'state1', name:'Radio button option 1'}, { id:'state2', name:'Radio button option 2'}, { id:'state3', name:'Radio button option 3'}, { id:'state4', name:'A disabled state', disabled:true} ];
                    var cmb = Controls.RadioGroup(null, {
                        label:'Radio button group',                 // Text label in a box surrounding the radio buttons
                        states: radioStates,                        // List of buttons
                        value:'state1'                              // Initial state
                    });
                    cmb.setOnChanged(function(controlID, theControl) { // Define event listener for state changes
                        Popup.create('Info','Radio button status: '+theControl.getValue());
                    })
                    examples.push(cmb);

                    examples.push(Controls.VerticalSeparator(15)); // Introduce a vertical separator

                    // List
                    var lst = Controls.List(null, {
                        width:230,                                  // Width
                        height : 180                                // Height
                    });
                    // Define the list of items
                    var listItems = [];
                    for (var i=0; i<30; i++)
                        listItems.push({ id: i, content: 'This is list item '+i });
                    lst.setItems(listItems); // Set the list on the control
                    lst.modifyValue(0); // Modify the active item
                    lst.setOnChanged(function(controlID, theControl) { // Respond to a change active item event
                        Popup.create('Info','List item selected: '+theControl.getValue());
                    })
                    examples.push(lst);

                    examples.push(Controls.VerticalSeparator(15)); // Introduce a vertical separator

                    // Checked list
                    var clst = Controls.List(null, {
                        width: 230,
                        height: 180,
                        checkList: true                             // Defines the list as having a checkbox for each item
                    });
                    // Define the list of items
                    var listItems = [];
                    for (var i=0; i<30; i++)
                        listItems.push({ id: i, content: 'This is checked list item '+i, checked:(i%2==0) });
                    clst.setItems(listItems); // Set the list on the control
                    examples.push(clst);

                    examples.push(Controls.VerticalSeparator(15)); // Introduce a vertical separator

                    // Value slider
                    var sld = Controls.ValueSlider(null, {
                        width: 350,                                 // width of the slider
                        height: 25,                                 // height of the slider
                        label: 'A value slider',                    // text label of the slider
                        minval: 0,                                  // minimum value
                        maxval: 100,                                // maximum value
                        value: 20,                                  // initial value
                        digits: 1                                   // number of decimal digits displayed
                    })
                    examples.push(sld);

                    examples.push(Controls.VerticalSeparator(15)); // Introduce a vertical separator

                    // A file upload control
                    var fu = Controls.FileUpload(null, {
                        serverUrl: MetaData.serverUrl               // Url of the server where DQXServer is running
                    });
                    fu.setOnChanged(function() { // Callback when a file is uploaded
                        alert('File uploaded to server file. Server file ID = '+fu.getValue());
                    });
                    examples.push(fu);

                    // Assemble all the controls in a vertical stack, and return the compound element
                    return Controls.CompoundVert(examples)
                        .setLegend('An sample instance of each control')    // Defines a titled box around the controls
                        .setAutoFillX(false);                               // Instruct this compound control to use only the X space required by the members, rather than the full size
                }


                // Create some controlled that are arranged on a grid
                that.CreateTableLayout = function() {
                    var grid = Controls.CompoundGrid();                     // Instruct this compound control to use only the X space required by the members, rather than the full size
                    grid.setAutoFillX(false);                               // Defines a titled box around the controls
                    grid.setLegend('Some controls arranged on a grid');
                    grid.setItem(0,0,Controls.Static('A static in cell(0,0)'));
                    grid.setItem(1,0,Controls.Check(null, {label:'Check in cell(1,0)', value:true }));
                    grid.setItem(0,1,Controls.Static('A static in cell(0,1)'));
                    grid.setItem(1,1,Controls.Static('A static in cell(1,1)'));
                    return grid;
                }


                // Create some controls that dynamically interact with each other
                that.CreateInteractions = function() {
                    var examples = [];

                    //Dynamically change the enabled / disabled state
                    var chk1 = Controls.Check(null, { label:'Enabled', value:true })
                    chk1.setOnChanged(function() {
                        edt1.modifyEnabled(chk1.getValue());
                    });
                    var edt1 = Controls.Edit(null, { value:'Edit box', size:30 });
                    examples.push(Controls.CompoundHor( [ chk1, Controls.HorizontalSeparator(10), edt1 ] ));

                    //Dynamically change the visibility
                    var chk2 = Controls.Check(null, { label:'Visible', value:true })
                    chk2.setOnChanged(function() {
                        showhideWrapper.setVisible(chk2.getValue());
                    });
                    var edt2 = Controls.Edit(null, { value:'Edit box', size:30 });
                    var showhideWrapper = Controls.ShowHide(edt2);
                    examples.push(Controls.CompoundHor( [ chk2, Controls.HorizontalSeparator(10), showhideWrapper ] ));

                    //Dynamically modify value
                    var edt3 = Controls.Edit(null, { value:'', size:10 });
                    var edt4 = Controls.Edit(null, { value:'', size:30 });
                    edt3.setOnChanged(function() { // Define event listener for content change
                        edt4.modifyValue('Copied: '+edt3.getValue()); // Modify content of the other edit control
                    })
                    examples.push(Controls.CompoundHor( [ edt3, Controls.HorizontalSeparator(10), edt4 ] ));


                    // Assemble all the controls in a vertical stack, and return the compound element
                    return Controls.CompoundVert(examples)
                        .setLegend('Some examples of interactions between controls')     // Defines a titled box around the controls
                        .setAutoFillX(false);                                            // Instruct this compound control to use only the X space required by the members, rather than the full size
                }


                return that;
            }

        };

        return FormDemoModule;
    });