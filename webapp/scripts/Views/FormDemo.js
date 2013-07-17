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
                    this.panelForm = Framework.Form(this.frameForm);
                    this.panelForm.setPadding(10);

                    var components = []; // This will accumumate all the components of the form

                    components.push(this.CreateExamples());
                    components.push(this.CreateTableLayout());


                    // Put all the components on the form, in a vertical layout
                    this.panelForm.addControl(Controls.CompoundVert(components));
                }



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

                    // Assemble all the controls in a vertical stack, and return the compound element
                    return Controls.CompoundVert(examples)
                        .setLegend('An sample instance of each control')    // Defines a titled box around the controls
                        .setAutoFillX(false);                               // Instruct this compound control to use only the X space required by the members, rather than the full size
                }


                that.CreateTableLayout = function() {
                    var grid = Controls.CompoundGrid();                     // Instruct this compound control to use only the X space required by the members, rather than the full size
                    grid.setAutoFillX(false);                               // Defines a titled box around the controls
                    grid.setLegend('Some controls layouted as a grid');
                    grid.setItem(0,0,Controls.Static('A static in cell(0,0)'));
                    grid.setItem(1,0,Controls.Check(null, {label:'Check in cell(1,0)', value:true }));
                    grid.setItem(0,1,Controls.Static('A static in cell(0,1)'));
                    grid.setItem(1,1,Controls.Static('A static in cell(1,1)'));
                    return grid;
                }


                return that;
            }

        };

        return FormDemoModule;
    });