define(["require", "DQX/Application", "DQX/Framework", "DQX/HistoryManager", "DQX/Controls", "DQX/Msg", "DQX/DocEl", "DQX/Utils", "DQX/SQL", "DQX/QueryTable", "DQX/QueryBuilder", "DQX/DataFetcher/DataFetchers", "MetaData"],
    function (require, Application, Framework, HistoryManager, Controls, Msg, DocEl, DQX, SQL, QueryTable, QueryBuilder, DataFetchers, MetaData) {

        //A helper function, turning a fraction into a 3 digit text string
        var funcFraction2Text = function(vl) {
            if (vl==null)
                return '-'
            else
                return parseFloat(vl).toFixed(3);
        }

        //A helper function, turning a fraction into a color string
        var funcFraction2Color = function (vl) {
            if (vl == null)
                return "white";
            else {
                vl=parseFloat(vl);
                var vl = Math.abs(vl);
                vl = Math.min(1, vl);
                if (vl > 0) vl = 0.05 + vl * 0.95;
                vl = Math.sqrt(vl);
                var b = 255 ;
                var g = 255 * (1 - 0.3*vl * vl);
                var r = 255 * (1 - 0.6*vl);
                return "rgb(" + parseInt(r) + "," + parseInt(g) + "," + parseInt(b) + ")";
            }
        };




        var TableViewerModule = {

            init: function () {
                // Instantiate the view object
                var that = Application.View(
                    'tableviewer',  // View ID
                    'Table viewer'  // View title
                );

                //This function is called during the initialisation. Create the frame structure of the view here
                that.createFrames = function(rootFrame) {
                    rootFrame.makeGroupHor();//Declare the root frame as a horizontally divided set of subframes
                    this.frameControls = rootFrame.addMemberFrame(Framework.FrameFinal('', 0.3));//Create frame that will contain the controls panel
                    this.frameTable = rootFrame.addMemberFrame(Framework.FrameFinal('', 0.7))//Create frame that will contain the table viewer
                        .setAllowScrollBars(false,true);
                }



                //This function is called during the initialisation. Create the panels that will populate the frames here
                that.createPanels = function() {
                    this.createPanelTableViewer();
                };

                that.createPanelTableViewer = function () {

                    //Initialise the data fetcher that will download the data for the table
                    this.theTableFetcher = DataFetchers.Table(
                        MetaData.serverUrl,     //url of the DQXServer instance providing the data
                        MetaData.database,      //name of the database
                        MetaData.tableSNPInfo   //name of the table containing the data
                    );
                    this.theTableFetcher.showDownload=true; //Allows the user to download the data in the table
                    //Initialise the panel that will contain the table
                    this.panelTable = QueryTable.Panel(
                        this.frameTable,        // Frame this panel should be located in
                        this.theTableFetcher,   // Datafetcher that downloads the table info
                        {
                            leftfraction: 50    // Max size (in %) of the left, non-scrolling component of the table
                        }
                    );

                    var mytable = this.panelTable.getTable();// A shortcut variable

                    // Add a column with the chromosome nr & position
                    // NOTE: The follow code contains some specialised actions, because it combines both the chromosome number & position in a single table column
                    this.theTableFetcher.addFetchColumnInt("chrom"); // Fetch the chromosome, but don't make a table column for it
                    var comp = mytable.createTableColumn(QueryTable.Column("Position", "pos", 0), "IntB64", false); // Create a table column for the position
                    comp.customTextCreator = function(fetcher,downloadrownr) { // Define a custom function for creating the text of this column, combining both data sets
                        return fetcher.getColumnPoint(downloadrownr, 'chrom')+':'+fetcher.getColumnPoint(downloadrownr, 'pos');
                    }
                    comp.setToolTip('Chromosome number and position on the chromosome, in base pairs'); // Define a hover tooltip
                    mytable.addSortOption("Position", SQL.TableSort(['chrom', 'pos'])); // Define a joint sort action on both columns


                    // Add a column for the SNP identifier
                    // NOTE: this is a more standard way of adding a table column
                    var comp = mytable.createTableColumn(
                        QueryTable.Column(
                            "SNP ID",       // Display name of the column
                            "snpid",        // ID (=Column name in the database table
                            1),             //Table part (1=right, scrolling)
                        "String",           //Transfer encoding: general string (see DataFetchers.CurveColumn for possible choices)
                        true                // Column is sortable
                    );
                    comp.setToolTip('SNP identifier');  // Hover tooltip


                    //Create a column for each population frequency
                    $.each(MetaData.populations,function(idx,pop) {
                        var col = mytable.createTableColumn(
                            QueryTable.Column(
                                pop.freqid,       //Name of the column
                                pop.freqid,       //Id of the column in the database table
                                1),               //Table part (1=right, scrolling)
                            "Float3",             //Transfer encoding: float encoded in 3 base64 characters
                            true                  // Column is sortable
                        );
                        col.setToolTip(pop.name); //Provide a tool tip for the column
                        //Define a callback when the user clicks on a column
                        col.setHeaderClickHandler(function(id) {
                            alert('column clicked '+id);
                        })
                        col.CellToText = funcFraction2Text //Show the frequency value with a fixed 3 digit format
                        col.CellToColor = funcFraction2Color; //Create a background color that reflects the value
                    })



                    //we start by defining a query that returns everything
                    mytable.queryAll();

                };



                return that;
            }

        };

        return TableViewerModule;
    });