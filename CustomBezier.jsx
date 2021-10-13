//==============================
//  Custom Bezier Effect v1.0
//==============================

/**
 * Function applying a bezier effet on the selected layer and adding expressions to the points.
 */
if ( app.project.activeItem.selectedLayers.length > 0 ){
    for( var i = 0 ; i < app.project.activeItem.selectedLayers.length ; i++){
        var layerToTreat = app.project.activeItem.selectedLayers[i];
        var bezierEffect = layerToTreat.property("ADBE Effect Parade").addProperty("ADBE BEZMESH");
        bezierEffect.name = "CustomBezier"
        bezierEffect.property( 2 ).setValue( [ 0 , 0 ] );
        bezierEffect.property( 2 ).expression = "var A = effect('CustomBezier')( 1 );\
var B = effect('CustomBezier')( 4 );\
value + ( 1 / 3 * ( B - A ) + A ) ;"
        bezierEffect.property( 3 ).setValue( [ 0 , 0 ] );
        bezierEffect.property( 3 ).expression = "var A = effect('CustomBezier')( 1 );\
var B = effect('CustomBezier')( 4 );\
value + ( 2 / 3 * ( B - A ) + A ) ;"
        bezierEffect.property( 5 ).setValue( [ 0 , 0 ] );
        bezierEffect.property( 5 ).expression = "var A = effect('CustomBezier')( 7 );\
var B = effect('CustomBezier')( 4 );\
value + ( 2 / 3 * ( B - A ) + A ) ;"
        bezierEffect.property( 6 ).setValue( [ 0 , 0 ] );
        bezierEffect.property( 6 ).expression = "var A = effect('CustomBezier')( 7 );\
var B = effect('CustomBezier')( 4 );\
value + ( 1 / 3 * ( B - A ) + A ) ;"
        bezierEffect.property( 8 ).setValue( [ 0 , 0 ] );
        bezierEffect.property( 8 ).expression = "var A = effect('CustomBezier')( 7 );\
var B = effect('CustomBezier')( 10 );\
value + ( 1 / 3 * ( B - A ) + A ) ;"
        bezierEffect.property( 9 ).setValue( [ 0 , 0 ] );
        bezierEffect.property( 9 ).expression ="var A = effect('CustomBezier')( 7 );\
var B = effect('CustomBezier')( 10 );\
value + ( 2 / 3 * ( B - A ) + A ) ;"
        bezierEffect.property( 11 ).setValue( [ 0 , 0 ] );
        bezierEffect.property( 11 ).expression = "var A = effect('CustomBezier')( 1 );\
var B = effect('CustomBezier')( 10 );\
value + ( 2 / 3 * ( B - A ) + A ) ;"
        bezierEffect.property( 12 ).setValue( [ 0 , 0 ] );
        bezierEffect.property( 12 ).expression = "var A = effect('CustomBezier')( 1 );\
var B = effect('CustomBezier')( 10 );\
value + ( 1 / 3 * ( B - A ) + A ) ;"
    }
}