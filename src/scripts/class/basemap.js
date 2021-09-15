export default class Basemap{

    static urlTiles = "https://wxs.ign.fr/an7nvfzojv5wa96dsga5nk8w/geoportail/wmts?layer=GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN25TOUR.CV&style=normal&tilematrixset=PM&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg";

    tileXStart = 16652;
    tileYStart = 11962;
    tileXEnd = 16659;
    tileYEnd = 11969;

    tileMatrix = 15;
    tileSize = 256;

    tiles = [];
}