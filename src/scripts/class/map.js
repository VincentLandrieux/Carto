export default class Map{

    stepX = (2.9901 - 2.9739) / (1065 - 688);
    stepY = (43.6036 - 43.6001) / (790 - 904);
    startX = (2.9901 / this.stepX) - 1065;
    startY = (43.6036 / this.stepY) - 790;

    viewX = 0;
    viewY = 0;

    /**
     * 
     * @param {number} width    width of the map
     * @param {number} height   height of the map
     * @param {number} viewWidth    width of the view
     * @param {number} viewHeight   height of the view
     */
    constructor(width, height, viewWidth, viewHeight){
        this.width = width;
        this.height = height;
        this.viewWidth = viewWidth;
        this.viewHeight = viewHeight;
    }

    /**
     * move map view
     * @param {number} xMove 
     * @param {number} yMove 
     */
    move(xMove, yMove){
        this.viewX -= xMove;
        this.viewY -= yMove;

        //Calc limit x and y
        const xMax = this.width - this.viewWidth;
        const yMax = this.height - this.viewHeight;

        if(-this.viewX < 0){
            this.viewX = 0;
        }
        if(-this.viewY < 0){
            this.viewY = 0;
        }
        if(-this.viewX > xMax){
            this.viewX = -xMax;
        }
        if(-this.viewY > yMax){
            this.viewY = -yMax;
        }
    }

    /**
     * convert longitude to x position
     * @param {number} longitude
     * @returns {number}
     */
    longitudeToX(longitude){
        const x = (longitude / this.stepX) - this.startX;
    
        return x;
    }
    /**
     * convert latitude to y position
     * @param {number} latitude
     * @returns {number}
     */
    latitudeToY(latitude){
        const y = (latitude / this.stepY) - this.startY;
    
        return y;
    }

    /**
     * convert gps coordinates to px position
     * @param {number} longitude 
     * @param {number} latitude 
     * @returns {Object} {x, y}
     */
    gpsToPx(longitude, latitude){
        const position = {
            x: this.longitudeToX(longitude),
            y: this.latitudeToY(latitude)
        }
    
        return position;
    }

    /**
    * convert px position to gps coordinates
    * @param {number} x 
    * @param {number} y 
    * @returns {Object} {x, y}
    */
    pxToGps(x, y){
        const position = {
            longitude: Math.trunc(((x + this.startX) * this.stepX) * 1000) / 1000,
            latitude: Math.trunc(((y + this.startY) * this.stepY) * 1000) / 1000
        }

        return position;
    }
}