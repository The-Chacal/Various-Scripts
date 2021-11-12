//==============================
//  Gather the Episode Environnements v1.1
//==============================

//  Functions gathering the psd files of the listed environnement for the requested episode.
//  Requires a json file listing the assets.
createUI();
/**
 * Creates the UI
 */
function createUI(){

    var UI = new Window( "dialog" , "Gathering of the BG Confos for an Episode." );
    UI.global = UI.add( "Panel" , undefined , "Where is the JSON file ?" );
    UI.global.alignChildren = [ "Fill" , "Center" ];
        UI.global.row1 = UI.global.add( "Group");
        UI.global.row1.spacing = 0 ;
            var path = UI.global.row1.add( "EditText" , undefined , undefined );
            path.characters = 7 ;
            var locate = UI.global.row1.add( "Button" , undefined , "Search" );
            locate.size = [ 75 , 25 ];
        UI.global.row2 = UI.global.add( "Group");
        UI.global.row2.spacing = 0 ;
            var Go = UI.global.row2.add( "Button" , undefined , "OK");
            Go.size = [ 75 , 25 ];
            var Stop = UI.global.row2.add( "Button" , undefined , "Annuler");
            Stop.size = [ 75 , 25 ];

    //UI Events.
    locate.onClick = function(){ path.text = File.openDialog( "Get your JSON file!" , "JSON:*.json" , false ).fsName ; }
    Go.onClick = function(){  UI.close() ; gatherEnvironnementAssets( path.text ) ; }
    Stop.onClick = function(){ UI.close() ; }
    //UI Parameters.
    UI.defaultElement = Go ;
    UI.cancelElement = Stop ;
    //Showing UI.
    UI.show();

}

/**
 * Parse the JSON file and search for the matchin assets.
 * @param { string } JSONpath 
 */
function gatherEnvironnementAssets( JSONpath){
    var JSONfile = new File( JSONpath );
    var episode = JSONfile.name.slice( 5 , 7 );
    //Creating the Array with all Assets per Shot.
    JSONfile.open( "r" );
    var assetListString = JSONfile.read();
    JSONfile.close();
    var assetList = JSON.parse( assetListString );
    //Checking if the Episode Folder Exists.
    var episodesFolder = new Folder( "//peps/studioPEP/IV2/03_EPISODES" );
    var episodeFolderList = episodesFolder.getFiles( "IV2_*" );
    for( var i = 0 ; i < episodeFolderList.length ; i ++ ){
        if( episodeFolderList[i].name.search( "IV2_" + episode ) >= 0 ){
            var episodeFolder = episodeFolderList[i];
            break ;
        } else if( i+1 >= episodeFolderList.length ){
            alertDlg( "Episode not Found." , "Error : " , "   Your episode does not exists on the PEPS server." );
            return;
        }
    }
    //Checking if there is any double use of an Asset and doing so, generating the list of files to copy.
    var AssetsToCopy = new Array();
    for( var i = 0 ; i < assetList.length ; i++ ){
        if( assetList[i].AssetsEnvironment != "" ){
            var nameStored = false ;
            for( var j = 0 ; j <= AssetsToCopy.length ; j++ ){
                if( assetList[i].AssetsEnvironment == AssetsToCopy[j] ){
                    nameStored = true ;
                    break ;
                }
            }
            if( !nameStored ){
                AssetsToCopy.push( assetList[i].AssetsEnvironment );
            }
        }
    }
    //Setting the needed Folders.
    var assetNotFound = [];
    var destinationFolder = new Folder( "//peps/studioPEP/IV2/11_COMPO/IV2_Ep1" + episode + "/01_Assets/04_Environment" );
    if( !destinationFolder.exists ){ destinationFolder.create(); }
    var filesToCopyFolder = new Folder( episodeFolder.fsName + "/05_BG COLOR/04_CONFO" );
    //Copying the Files
    if( filesToCopyFolder.exists )
    {
        var confoFiles = filesToCopyFolder.getFiles( "*.psd" );
        for( i = 0 ; i < AssetsToCopy.length ; i++ ){
            for( j = 0 ; j < confoFiles.length ; j++ ){
                if( confoFiles[j].name.search( new RegExp( "_" + AssetsToCopy[i] + "_" , "gi" ) ) >= 0 ){
                    var TestFile = new File( destinationFolder.fsName + "/" + confoFiles[j].name );
                    if( !TestFile.exists || TestFile.modified <= confoFiles[i].modified )
                    {
                        confoFiles[j].copy( destinationFolder.fsName + "/" + confoFiles[j].name );
                    }
                    break ;
                } else if( j+1 >= confoFiles.length ){
                    assetNotFound.push( AssetsToCopy[i] );
                }
            }
        }
    }
    if( assetNotFound.lenght > 0 ){
        printLostAssets( assetNotFound );
    } else {
        alertDlg( "Finished" , "Yeah : " , "I'm Done here." );
    }

}
/**
 * Opens a dialog with a message for the user.
 * @param { string } Title Name of the Dialog.
 * @param { string } Content Message to display. 
 */
function alertDlg( Title , Content ){
    
    var CTerrorDlg = new Window( "dialog" , Title );
        CTerrorDlg.global = CTerrorDlg.add( "Panel" , undefined );
        CTerrorDlg.global.preferredSize = [ 200 , -1 ];
        CTerrorDlg.global.msg = CTerrorDlg.global.add( "statictext" , undefined , Content, { multiline: true } );
        CTerrorDlg.global.msg.alignment = "Center" ;
        CTerrorDlg.global.add( "Button" , undefined , "Ok" );
    CTerrorDlg.show();
      
}
/**
 * Opens a Palette Dialog with the list of assets that have not been found.
 * @param { array } List array with the list of assets not found.
 */
function printLostAssets( List ){

    var LostAssetsList = List.join( "\n" );
    var LostAssetsDlg = new Window( "palette" , "Lost Assets" , undefined , { borderless: true , resizeable: true } );
    LostAssetsDlg.spacing = 2 ;
    var ListPanel = LostAssetsDlg.add( "Panel" , undefined , "Missing Assets : " )
    ListPanel.alignment = "Fill" ;
    ListPanel.margins = [ 2 , 10 , 2 , 2 ] ;
    var PropList = ListPanel.add( "edittext" , undefined , LostAssetsList , { multiline: true , scrolling: true } );
    PropList.preferredSize = [ 200  , 100 ];
    var Btn = LostAssetsDlg.add( "button" , undefined , "Exit" );
    Btn.size = [ 75 , 25 ];
    Btn.alignment = "Center";
    LostAssetsDlg.onResizing = function(){ LostAssetsDlg.layout.resize(); }
    Btn.onClick = function(){ LostAssetsDlg.close(); }
    LostAssetsDlg.show();

}