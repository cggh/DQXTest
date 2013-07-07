define(["require", "DQX/Application", "DQX/Framework", "DQX/HistoryManager", "DQX/Controls", "DQX/Msg", "DQX/DocEl", "DQX/Utils", "DQX/SQL", "DQX/QueryTable", "DQX/QueryBuilder", "DQX/DataFetcher/DataFetchers", "MetaData"],
    function (require, Application, Framework, HistoryManager, Controls, Msg, DocEl, DQX, SQL, QueryTable, QueryBuilder, DataFetchers, MetaData) {

        //A helper function, turning a fraction into a 3 digit text string
        var funcFraction2Text = function(vl) {
            if (vl==null)
                return '-'
            else
                return vl.toFixed(3);
        }

        //A helper function, turning a fraction into a color string
        var funcFraction2Color = function (vl) {
            if (vl == null)
                return "white";
            else {
                var vl = Math.abs(vl);
                vl = Math.min(1, vl);
                if (vl > 0) vl = 0.05 + vl * 0.95;
                vl = Math.sqrt(vl);
                var b = 255 ;//* (1 - 0.3 * vl * vl * vl * vl);
                var g = 255 * (1 - 0.3*vl * vl);
                var r = 255 * (1 - 0.6*vl);
                return "rgb(" + parseInt(r) + "," + parseInt(g) + "," + parseInt(b) + ")";
            }
        };




        var TableViewerModule = {

            init: function () {
                var that = Application.View('tableviewer','Table viewer');



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

                    this.theTableFetcher = DataFetchers.Table(
                        MetaData.serverUrl,     //url of the DQXServer instance providing the data
                        MetaData.database,      //name of the database
                        MetaData.tableSNPInfo   //name of the table containing the data
                    );
                    this.theTableFetcher.showDownload=true; //Allows the user to download the data in the table
                    this.panelTable = QueryTable.Panel(
                        this.frameTable,
                        this.theTableFetcher,
                        {
                            leftfraction: 50
                        }
                    );

                    //Define a startup sort option, by combined chrom & pos
                    this.theTableFetcher.setSortOption(SQL.TableSort(['chrom', 'pos']),false);

                    var mytable = this.panelTable.getTable();
                    //Msg.listen("",{ type: "HighlightRowModified", id: mytable.myBaseID }, $.proxy(this._onHighlightRowModified,this));


                    //Add a column containing the position on chromosome
                    mytable.createTableColumn(
                        QueryTable.Column(
                            "Position",          // Display name of the column
                            "pos",               // Identifier of the field
                            0),                  // Table part (0=left, nonscrolling, 1=right, scrolling)
                        "IntB64"                 // Transfer encoding, see DataFetchers.CurveColumn for possible choices
                    );

                    mytable.createTableColumn(QueryTable.Column("Chrom", "chrom", 0), "IntB64");

                    mytable.createTableColumn(QueryTable.Column("ID", "snpid", 1), "String", true);

                    //var msgIDClickHeader={ type: 'ClickHeader', id: mytable.myBaseID };

                    //Create a column for each population frequency
                    $.each(MetaData.populations,function(idx,pop) {
                        var col = mytable.createTableColumn(
                            QueryTable.Column(
                                pop.freqid,       //Name of the column
                                pop.freqid,       //Id of the column in the database table
                                1),               //Table part (1=right, scrolling)
                            "Float3",              //Transfer encoding: float encoded in 3 base64 characters
                            true                  // Column is sortable
                        );
                        col.setToolTip(pop.name);//Provide a tool tip for the column
                        //Define a callback when the user clicks on a column
                        col.setHeaderClickHandler(function(id) {
                            alert('column clicked '+id);
                        })
                        //col.makeHyperlinkHeader(msgIDClickHeader,'Column information');
                        col.CellToText = funcFraction2Text//Show the frequency value with a fixed 3 digit format
                        col.CellToColor = funcFraction2Color;//Create a background color that reflects the value
                    })



                    //we start by defining a query that returns everything
                    mytable.queryAll();

                };



                return that;
            }

        };

        return TableViewerModule;
    });