//==============================
//  Get the Properties List v1.0
//==============================

//  Functions allowing the user to get the list of all the properties of a layer.
PrintPropertiesList();
/**
 * Function creating a palette dialog in which the properties list is displayed.
 */
function PrintPropertiesList(){

    if( app.project.activeItem != undefined && app.project.activeItem.selectedLayers.length > 0 )
    {
        var layerSelection = app.project.activeItem.selectedLayers ;
        var propertiesList = "" ;
        //Creating the UI.
        var propertiesList = new Window( "palette" , { en: "Properties" , fr: "Propriétés" } , undefined , { resizeable: true } );
        printPropertiesListDlg.spacing = 2 ;
        for( var i = 0 ; i < layerSelection.length ; i++ ){
            var layerPanel = printPropertiesListDlg.add( "Panel" , undefined , layerSelection[i].name + " : " )
            layerPanel.alignment = "Fill" ;
            layerPanel.orientation = "Row" ;
            propertiesList = GetPropertiesList( layerSelection[i] , propertiesList , "" , "" );
            var propList = layerPanel.add( "edittext" , undefined , propertiesList , { multiline: true , scrolling: true } );
            propList.preferredSize = [ 350 , 150 ];
        }
        var Btn = printPropertiesListDlg.add( "button" , undefined , "Exit" );
        Btn.alignment = "Center";
        //UI Events.
        printPropertiesListDlg.onResizing = function(){ printPropertiesListDlg.layout.resize(); };
        Btn.onClick = function(){ printPropertiesListDlg.close(); };
        //Showing UI.
        printPropertiesListDlg.show();
    }

}
/**
 * Recursive functions parsing all the properties a layer to get all names and indexes.
 * @param { object } Layer The Layer to analyse
 * @param { string } PropertiesNames The String containing all the names and indexes of properties.
 * @param { string } Indent String indenting the line of the property name. 
 * @param { string } Space String spacing the line of the property name.
 * @returns { string } 
 */
function GetPropertiesList( Layer , PropertiesNames , Indent , Space ){

    for ( var i = 1 ; i <= Layer.numProperties ; i++ ){
        if ( i < 10 ){
            var NumProp = "0" + i ;
        } else {
            var NumProp = i ;
        }
        PropertiesNames = PropertiesNames + Space + Indent + NumProp + " - " + Layer.name + "." + Layer.property(i).name + "\r\n" ;
        if ( Layer.property(i).numProperties > 0 ){
            Indent = Indent + NumProp + "." ;
            Space = "   " + Space ;
            PropertiesNames = GetPropertiesList( Layer.property(i) , PropertiesNames , Indent , Space );
            Indent = Indent.slice ( 0 , Indent.length - 3 );
            Space = Space.slice( 3 , Space.length )
        }
    }
    return PropertiesNames;

}