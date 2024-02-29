export class Square {
    constructor(pos,type,topLeft,topRight,bottomLeft,bottomRight,resident) {
        this.pos = pos;
        this.type = type;
        this.topLeft = topLeft === undefined ? null : topLeft;
        this.topRight = topRight === undefined ? null : topRight;
        this.bottomLeft = bottomLeft === undefined ? null : bottomLeft;
        this.bottomRight = bottomRight === undefined ? null : bottomRight;
        this.resident = resident === undefined ? null : resident;
        this.entryPoints = {
            topRight : true,
            topLeft : true,
            bottomRight : true,
            bottomLeft : true
        }
    }

    isEmpty(piece){
        return this.resident === null || this.resident === piece;
    }

    resetEntryPoints(){
        this.entryPoints = {
            topRight : true,
            topLeft : true,
            bottomRight : true,
            bottomLeft : true
        };
    }
}

export class Piece{
    constructor(color,pos){
        this.color = color;
        this.pos = pos;
        this.isDead = false;
        this.routes = null;
        this.pathLen = 0;
    }

    isEnemy(piece){
        return this.color != piece.color;
    }

    setRoutes(routes,len){
        this.routes = routes;
        this.pathLen = len;
    }

    clearRoutes(){
        this.routes = null;
        this.pathLen = 0;
    }

}



