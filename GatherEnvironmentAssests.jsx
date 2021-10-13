createUI();

//Creates the UI
function createUI(){

    var UI = new Window( "dialog" , "Gathering of the BG Confos for an Episode." );
    UI.global = UI.add( "Panel" , undefined , "Where is the JSON file ?" );
    UI.global.alignChildren = [ "Fill" , "Center" ];
        UI.global.row1 = UI.global.add( "Group");
        UI.global.row1.spacing = 0 ;
            var path = UI.global.row1.add( "EditText" , undefined , undefined );
            path.characters = 7 ;
            var Locate = UI.global.row1.add( "Button" , undefined , "Search" );
            Locate.size = [ 75 , 25 ];
        UI.global.row2 = UI.global.add( "Group");
        UI.global.row2.spacing = 0 ;
            var Go = UI.global.row2.add( "Button" , undefined , "OK");
            Go.size = [ 75 , 25 ];
            var Stop = UI.global.row2.add( "Button" , undefined , "Annuler");
            Stop.size = [ 75 , 25 ];
    
Locate.onClick = function(){ path.text = File.openDialog( "Get your JSON file!" , "JSON:*.json" , false ).fsName ; }
Go.onClick = function(){  UI.close() ; gatherEnvironnementAssets( path.text ) ; }
Stop.onClick = function(){ UI.close() ; }
UI.defaultElement = Go ;
UI.cancelElement = Stop ;

UI.show();

}

//Copy all the Assets listed in the given JSON File to the Comp Folder.
function gatherEnvironnementAssets( JSONpath){

    var JSONfile = new File( JSONpath );
    var Episode = JSONfile.name.slice( 5 , 7 );
    //Creating the Array with all Assets per Shot.
    JSONfile.open( "r" );
    var AssetListString = JSONfile.read();
    JSONfile.close();
    var AssetList = JSON.parse( AssetListString );
    //Checking if the Episode Folder Exists.
    var EpisodesFolder = new Folder( "//peps/studioPEP/IV2/03_EPISODES" );
    var EpisodeFolderList = EpisodesFolder.getFiles( "IV2_*")
    for( var i = 0 ; i < EpisodeFolderList.length ; i ++ )
    {
        if( EpisodeFolderList[i].name.search( "IV2_" + Episode ) >= 0 )
        {
            var EpisodeFolder = EpisodeFolderList[i];
            break ;
        } else if( i+1 >= EpisodeFolderList.length )
        {
            alertDlg( "Episode not Found." , "Error : " , "   Your episode does not exists on the PEPS server." );
            return;
        }
    }
    //Checking if there is any double use of an Asset and doing so, generating the list of files to copy.
    var AssetsToCopy = new Array();
    for( var i = 0 ; i < AssetList.length ; i++ )
    {
        if( AssetList[i].AssetsEnvironment != "" )
        {
            var NameStored = false ;
            for( var j = 0 ; j <= AssetsToCopy.length ; j++ )
            {
                if( AssetList[i].AssetsEnvironment == AssetsToCopy[j] )
                {
                    NameStored = true ;
                    break ;
                }
            }
            if( !NameStored )
            {
                AssetsToCopy.push( AssetList[i].AssetsEnvironment );
            }
        }
    }
    //Setting the needed Folders.
    var AssetNotFound = [];
    var DestinationFolder = new Folder( "//peps/studioPEP/IV2/11_COMPO/IV2_Ep1" + Episode + "/01_Assets/04_Environment" );
    if( !DestinationFolder.exists ){ DestinationFolder.create(); }
    var FilesToCopyFolder = new Folder( EpisodeFolder.fsName + "/05_BG COLOR/04_CONFO" );
    if( FilesToCopyFolder.exists )
    {
        //Creating a progress bar
        var ProgressDlg = new Window( "palette" , "Progress :" , undefined , { borderless: true } );
        ProgressDlg.spacing = 2 ;
        var ProgressBar = ProgressDlg.add( "progressbar" , undefined , 0 , AssetsToCopy.length );
        ProgressBar.size = [ 250 , 15 ];
        ProgressDlg.Text = ProgressDlg.add( "Group" );
        ProgressDlg.Text.orientation = "Row" ;
        ProgressDlg.Text.alignChildren = [ "Center" , "Center" ];
        ProgressDlg.Text.spacing = 0 ;
        var ProgressCurrentValue = ProgressDlg.Text.add( "statictext" , undefined , 0 );
        ProgressCurrentValue.characters = 3 ;
        ProgressDlg.Text.add( "statictext{ text: ' / ' , characters: 2 }" );
        var ProgressTotalValue = ProgressDlg.Text.add( "statictext" , undefined , 0 );
        ProgressTotalValue.characters = 3 ;
        ProgressDlg.center();
        ProgressDlg.show();
        //Copying the Files
        var ConfoFiles = FilesToCopyFolder.getFiles( "*.psd" );
        for( i = 0 ; i < AssetsToCopy.length ; i++ )
        {
            ProgressBar.value = i + 1 ;
            ProgressCurrentValue.text = i + 1 ;
            ProgressTotalValue.text = AssetsToCopy.length ;
            for( j = 0 ; j < ConfoFiles.length ; j++ )
            {
                if( ConfoFiles[j].name.search( new RegExp( "_" + AssetsToCopy[i] + "_" , "gi" ) ) >= 0 )
                {
                    var TestFile = new File( DestinationFolder.fsName + "/" + ConfoFiles[j].name );
                    if( !TestFile.exists || TestFile.modified <= ConfoFiles[i].modified )
                    {
                        ConfoFiles[j].copy( DestinationFolder.fsName + "/" + ConfoFiles[j].name );
                    }
                    break ;
                } else if( j+1 >= ConfoFiles.length )
                {
                    AssetNotFound.push( AssetsToCopy[i] );
                }
            }
        }
    }
    if( AssetNotFound.lenght > 0 )
    {
        printLostAssets( AssetNotFound );
    } else {
        alertDlg( "Finished" , "Yeah : " , "I'm Done here." );
    }

}
//Opens a dialog with a message for the user.
//Title = String - Name of the Dialog | Content = String - Message displayed
//Return = Ø
function alertDlg( Title , PanelName , Content ){
    
    var CTerrorDlg = new Window( "dialog" , Title );
        CTerrorDlg.global = CTerrorDlg.add( "Panel" , undefined , PanelName );
        CTerrorDlg.global.preferredSize = [ 200 , -1 ];
        CTerrorDlg.global.msg = CTerrorDlg.global.add( "statictext" , undefined , Content, { multiline: true } );
        CTerrorDlg.global.msg.alignment = "Center" ;
        CTerrorDlg.global.add( "Button" , undefined , "Ok" );
    
    CTerrorDlg.show();
      
}
//Opens a palette with the list of assets that have not been found.
//List = Array - List of the unfound Assets?
//Return = Ø
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