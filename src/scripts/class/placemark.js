
export default class Placemark{

    static width = 40;
    static height = 40;
    static img = new Image();
    static imgInit = (() => {
        this.img.src = "./images/placemark.png";
        return true;
    })();

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} longitude 
     * @param {number} latitude 
     */
    constructor(x, y, longitude, latitude){
        this.x = x;
        this.y = y;
        this.longitude = longitude;
        this.latitude = latitude;
    }

    /**
     * Draw the placemark img
     * @param {CanvasRenderingContext2D} ctx canvas context
     * @param {number} x px
     * @param {number} y px
     */
    static draw(ctx, x, y){
        ctx.drawImage(Placemark.img, x - (Placemark.width/2), y - Placemark.height, Placemark.width, Placemark.height);
    }
}

export class PlacemarkUser extends Placemark{

    static img = new Image();
    static _imgInit = (() => {
        this.img.src = "./images/user_placemark.png";
        return true;
    })();

    orientation = 0;

    /**
     * Draw the placemark user img
     * @param {CanvasRenderingContext2D} ctx canvas context
     * @param {number} x px
     * @param {number} y px
     * @param {number} angle deg
     */
    static draw(ctx, x, y, angle = 0){
        ctx.save();

        ctx.translate(x, y);
        ctx.rotate(angle * Math.PI / 180);

        ctx.drawImage(
            PlacemarkUser.img, 
            -PlacemarkUser.width / 2, 
            -PlacemarkUser.height / 2, 
            PlacemarkUser.width, 
            PlacemarkUser.height
        );

        ctx.restore();
    }
}