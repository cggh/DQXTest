define(["require", "DQX/Application", "DQX/Framework", "DQX/HistoryManager", "DQX/Controls", "DQX/Msg", "DQX/DocEl", "DQX/Utils", "DQX/Popup", "DQX/DataFetcher/DataFetchers", "MetaData"],
    function (require, Application, Framework, HistoryManager, Controls, Msg, DocEl, DQX, Popup, DataFetchers, MetaData) {

        var SnpPopup = {
        };

        SnpPopup.init = function() {
            //Initiase the event listener
            Msg.listen('', { type: 'ShowSNPPopup' }, function (context, snpid) {
                SnpPopup.show(snpid);
            });
        }

        //This function is called by the event listener
        SnpPopup.show = function(snpid) {
            //Fetch all data for that single snp
            DataFetchers.fetchSingleRecord(
                MetaData.serverUrl,     // url of the DQXServer instance providing the data
                MetaData.database,      // name of the database
                MetaData.tableSNPInfo,   // name of the table containing the data
                'snpid',                // name of the key identifier field
                snpid,                   // key identifier
                SnpPopup._create,        // handler upon success
                function() { DQX.reportError('Unable to fetch SNP data ')}  // handler upon failure
            );
        }

        SnpPopup._create = function(data) {
            var content = '';
            //Do a simple dump of all the table columns
            $.each(data,function(key,value) {
                content+=key+'='+value+'<br/>';
            })
            //Create a popup box
            var popupID = Popup.create(
                "SNP " + data.snpid,    // Title
                content);               // Content of the popup
        }


        return SnpPopup;
    });