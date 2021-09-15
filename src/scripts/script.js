//---IMPORT---//
import Placemark, {PlacemarkUser} from './class/placemark.js';
import Map from './class/map.js';
import Basemap from './class/basemap.js';

import pwa from './pwa.js';
pwa();

//---VARIABLE---//
//Canvas
const canvas = document.querySelector('.map');
const ctx = canvas.getContext ? canvas.getContext('2d'): null;

// const cCenter = [];

//Navigation
let mouseX = null;
let mouseY = null;

let watchID = null;
// const geo_options = {
//     enableHighAccuracy: true,
//     maximumAge        : 30000,
//     timeout           : 27000
// };
const locBtn = document.querySelector(".loc-button");

//Tiles
const basemap = new Basemap();

//Map
const map = new Map(
    (basemap.tileXEnd - basemap.tileXStart) * basemap.tileSize, 
    (basemap.tileYEnd - basemap.tileYStart) * basemap.tileSize, 
    canvas.width, 
    canvas.height
);

//Placemark
const placemarks = [
    createPlacemark(2.9901, 43.6036),
    createPlacemark(2.9739, 43.6001),
    createPlacemark(2.9822, 43.606),

    createPlacemark(2.9737, 43.6104),
    createPlacemark(2.9556, 43.5995),
];

let placemarkUser = null;
// placemarkUser = createPlacemarkUser(2.962, 43.62);

// const img = createImg('./img/wmts.jpg');
// img.addEventListener('load', function() {
//     ctx.drawImage(img, 0, 0);
// }, false);


//---FUNCTION---//
/**
 * 
 * @param {string} url image path
 * @returns {HTMLImageElement}
 */
function createImg(url){
    const img = new Image();
    img.src = url;

    return img;
}

/**
 * Create and return a placemark object
 * @param {number} longitude 
 * @param {number} latitude 
 * @returns {Placemark}
 */
function createPlacemark(longitude, latitude){
    return new Placemark(
        map.longitudeToX(longitude), 
        map.latitudeToY(latitude), 
        longitude, 
        latitude
    );
};
/**
 * Create and return a placemark User object
 * @param {number} longitude 
 * @param {number} latitude 
 * @returns {PlacemarkUser}
 */
 function createPlacemarkUser(longitude, latitude){
    return new PlacemarkUser(
        map.longitudeToX(longitude), 
        map.latitudeToY(latitude), 
        longitude, 
        latitude
    );
};

/**
 * Update placemark user and create it if not exist
 * @param {number} longitude 
 * @param {number} latitude
 */
function updatePlacemarkUser(longitude, latitude){
    if(placemarkUser){
        placemarkUser.x = map.longitudeToX(longitude);
        placemarkUser.y = map.latitudeToY(latitude);
        placemarkUser.longitude = longitude;
        placemarkUser.latitude = latitude;
    }else{
        console.error("placemarkUser is null");
    }
};

function mapMove(e){
    let xMove = mouseX - e.offsetX;
    let yMove = mouseY - e.offsetY;

    map.move(xMove, yMove);

    //update mouse positions
    mouseX = e.offsetX;
    mouseY = e.offsetY;
}


function initCanvas(){
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // cCenter[0] = canvas.width/2;
    // cCenter[1] = canvas.height/2;

    map.viewWidth = canvas.width;
    map.viewHeight = canvas.height;
}

function drawTile(tile){
    const x = basemap.tileSize * tile.x + map.viewX;
    const y = basemap.tileSize * tile.y + map.viewY;

    if(x > -basemap.tileSize && y > -basemap.tileSize){
        if(x < canvas.width + basemap.tileSize && y < canvas.height + basemap.tileSize){
            ctx.drawImage(tile.img, x, y);
        }
    }
}

function drawCanvas(){
    requestAnimationFrame(drawCanvas);

    //Draw
    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = 'rgba(200,200,200)';
    ctx.fillRect(0,0,canvas.width,canvas.height);


    //Draw Basemap tiles
    basemap.tiles.forEach((tile) => {
        drawTile(tile);
    });

    //Draw Placemarks
    placemarks.forEach((placemark) => {
        Placemark.draw(
            ctx, 
            placemark.x + map.viewX, 
            placemark.y + map.viewY
        );
    });

    //Draw User placemark
    if(placemarkUser){
        PlacemarkUser.draw(
            ctx, 
            placemarkUser.x + map.viewX, 
            placemarkUser.y + map.viewY
        );
    }

    //Debug info
    // ctx.fillStyle = 'black';
    // ctx.font = '24px sans-serif';
    // ctx.fillText(`x: ${map.viewX}`, 10, 50);
    // ctx.fillText(`y: ${map.viewY}`, 10, 80);
    // ctx.fillText(`Mx: ${mouseX}`, 10, 110);
    // ctx.fillText(`My: ${mouseY}`, 10, 140);
    // let mPos = map.pxToGps(-map.viewX + mouseX, -map.viewY + mouseY);
    // ctx.fillText(`Mlong: ${mPos.longitude}`, 10, 170);
    // ctx.fillText(`Mlati: ${mPos.latitude}`, 10, 200);

}

/**
 * Update user location
 * @param {GeolocationPosition} position 
 */
function geo_success(position) {

    if(placemarkUser.longitude != position.coords.longitude
        && placemarkUser.latitude != position.coords.latitude){

        updatePlacemarkUser(position.coords.longitude, position.coords.latitude);

        if(placemarkUser.x < 0 
            || placemarkUser.x > map.width
            || placemarkUser.y < 0
            || placemarkUser.y > map.height){

            alert("Localisation hors de la carte");

            placemarkUser = null;
            unwatch();
        }else{
            ////
            // center the map view to user ?
            //
            ////
        }
    }

    if(position.coords.heading){
        placemarkUser.orientation = position.coords.heading;
    }
    // console.log(position.coords.altitude);
    // console.log(position.coords.heading);
    // console.log(position.coords.speed);
}
  
function geo_error(error){
    alert(error.message);
    unwatch();
}

function unwatch(){
    if(watchID){
        navigator.geolocation.clearWatch(watchID);
        watchID = null;
    }
    locBtn.innerHTML = "Localisation";
}

//---EVENT---//
window.addEventListener('resize', initCanvas);

canvas.addEventListener('mousedown', (e) => {
    mouseX = e.offsetX;
    mouseY = e.offsetY;

    canvas.addEventListener('mousemove', mapMove);
});
document.addEventListener('mouseup', () => {
    canvas.removeEventListener('mousemove', mapMove);
});

canvas.addEventListener('touchstart', (e) => {
    const bcr = e.target.getBoundingClientRect();
    mouseX = e.targetTouches[0].clientX - bcr.x;
    mouseY = e.targetTouches[0].clientY - bcr.y;
}, false);
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();

    const bcr = e.target.getBoundingClientRect();
    e.offsetX = e.targetTouches[0].clientX - bcr.x;
    e.offsetY = e.targetTouches[0].clientY - bcr.y;

    mapMove(e);
}, false);

locBtn.addEventListener('click', () => {
    if(watchID){
        unwatch();
    }else{
        locBtn.innerHTML = "Désactiver";

        if(!placemarkUser) placemarkUser = createPlacemarkUser(null, null);
        watchID = navigator.geolocation.watchPosition(geo_success, geo_error);
    }
});


//---MAIN---//
if(ctx){
    initCanvas();
    drawCanvas();
}else{
    console.error("canvas non compatible avec ce navigateur");
}

//load and create images objects
for (let i = basemap.tileYStart; i < basemap.tileYEnd; i++){
    for (let j = basemap.tileXStart; j < basemap.tileXEnd; j++) {
        basemap.tiles.push({
            x: j - basemap.tileXStart,
            y: i - basemap.tileYStart,
            img: createImg(`${Basemap.urlTiles}&TileMatrix=${basemap.tileMatrix}&TileCol=${j}&TileRow=${i}`)
        });
    }
}

if (!("geolocation" in navigator)){
    locBtn.style.display = 'none';
    console.error("la géolocalisation n'est pas disponible");
}
  