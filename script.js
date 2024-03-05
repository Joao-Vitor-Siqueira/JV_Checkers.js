import { Square, Piece } from "./classes.js"

const squareDivs = [...document.getElementsByClassName("square")];
const pieceDivs = [];

const board = [];
const whitePieces = [];
const blackPieces = [];

let turn = 0;
let selectedPiece;
let captureRoutes = [];


function initBoard(){
    //add css and fill board array
    let colors = ["white","grey"]
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let color = (i * 8 + j) % 2 == 0? colors[0] : colors[1];
            squareDivs[i * 8 + j].classList.add(color);
            board.push(new Square(`${(i * 8 + j)}`,color))
        }
    colors = colors.reverse();
    }

    
    //connect nodes
    for (let i = 0; i < 8; i++) {
        let j = i % 2 === 0? 1 : 0;
        let k = j + 7;
        
        while(j < k){
            
            if(i == 0){ // if first row
                
                board[i * 8 + j].bottomLeft = board[(i + 1) * 8 + (j - 1)];   
                if(j + 1 < 7) // if not last col
                    board[i * 8 + j].bottomRight = board[(i + 1) * 8 + (j + 1)];
            }
            
            else if(i == 7){ // if last row
                
                board[i * 8 + j].topRight = board[(i - 1) * 8 + (j + 1)];
                if(j > 0) // if not first col
                    board[i * 8 + j].topLeft = board[(i - 1) * 8 + (j - 1)];  
            }
            
            else{ // middle rows 
                if(i % 2 == 0){ //even rows
                    
                    board[i * 8 + j].topLeft = board[(i - 1) * 8 + (j - 1)]; 
                    board[i * 8 + j].bottomLeft = board[(i + 1) * 8 + (j - 1)]; 

                    if(j + 1 < 7){ //if not last col
                        board[i * 8 + j].topRight = board[(i - 1) * 8 + (j + 1)];
                        board[i * 8 + j].bottomRight = board[(i + 1) * 8 + (j + 1)];
                    }
                }

                else{ // odd rows
                    board[i * 8 + j].topRight = board[(i - 1) * 8 + (j + 1)];
                    board[i * 8 + j].bottomRight = board[(i + 1) * 8 + (j + 1)]; 

                    if(j > 0){ //if not first col
                        board[i * 8 + j].topLeft = board[(i - 1) * 8 + (j - 1)]; 
                        board[i * 8 + j].bottomLeft = board[(i + 1) * 8 + (j - 1)];
                    }
                }
            }

            j += 2;
        }  
    }

    //Add pieces to squares
    for (let i = 0; i < 3; i++) {
        if(i % 2 == 0){
            for (let j = 1; j < 8; j+= 2) {
                
                let whitePiece = new Piece("white",i * 8 + j);
                whitePieces.push(whitePiece);  
                board[i * 8 + j].resident = whitePiece;   
                
                let whitePieceDiv = document.createElement("div");
                whitePieceDiv.className = "piece white";
                whitePieceDiv.id = `w${whitePieces.length - 1}`
                squareDivs[i * 8 + j].appendChild(whitePieceDiv);
                pieceDivs.push(whitePieceDiv);
                
                let blackPiece = new Piece("black",(7 - i) * 8 + (j - 1));
                blackPieces.push(blackPiece);
                board[(7 - i) * 8 + (j - 1)].resident = blackPiece;
                
                
                let blackPieceDiv = document.createElement("div");
                blackPieceDiv.className = "piece black";
                blackPieceDiv.id = `b${blackPieces.length - 1}`
                squareDivs[(7 - i) * 8 + (j - 1)].appendChild(blackPieceDiv);
                pieceDivs.push(blackPieceDiv);
            }
        }
        else{
            for (let j = 0; j < 8; j+= 2) {
                let whitePiece = new Piece("white",8 + j); 
                whitePieces.push(whitePiece);
                board[8 + j].resident = whitePiece;
                
                let whitePieceDiv = document.createElement("div");
                whitePieceDiv.className = "piece white";
                whitePieceDiv.id = `w${whitePieces.length - 1}`
                squareDivs[8 + j].appendChild(whitePieceDiv);
                pieceDivs.push(whitePieceDiv);
                
                let blackPiece = new Piece("black",(6 * 8) + (j + 1))
                blackPieces.push(blackPiece);
                board[(6 * 8) + (j + 1)].resident = blackPiece;
                
                let blackPieceDiv = document.createElement("div");
                blackPieceDiv.className = "piece black";       
                blackPieceDiv.id = `b${blackPieces.length - 1}`         
                squareDivs[(6 * 8) + (j + 1)].appendChild(blackPieceDiv);
                pieceDivs.push(blackPieceDiv);
            }
        }  
    }

    //select piece event
    pieceDivs.forEach((piece => {
        piece.addEventListener('click', () => {
            selectPiece(piece)
        })   
    }))

    //add movement event to squares
    squareDivs.forEach((square) => {
        square.addEventListener("click", (e) => {
            if(square.classList.contains("valid")){
                movePiece(e.target);
            }
            if(square.classList.contains("red")){
                capturePiece();
            }
        })
    })


}

function selectPiece(piece){
    if(piece === selectedPiece) return;
    let pieceObj = getPiece(piece.id);
    
    if(captureRoutes.length && !captureRoutes.includes(pieceObj)){
        return;
    }

    removeSquaresSelection();

    if(piece.classList.contains("black") && turn % 2 == 0)
        return;
    if(piece.classList.contains("white") && turn % 2 != 0)
        return;
    
    if(selectedPiece)
        selectedPiece.classList.remove("selected");

    selectedPiece = piece;
    piece.classList.add("selected");

    if(captureRoutes.length)
        return showCaptureRoutes(getPiece(selectedPiece.id));
    
    showValidSquares();
}

function showValidSquares(){
    if(selectedPiece.classList.contains("white")){
       let pos = whitePieces[selectedPiece.id.slice(1)].pos;
       let left = board[pos].bottomLeft;
       let right = board[pos].bottomRight;

       if(left && left.isEmpty())
            squareDivs[left.pos].classList.add("valid");
       if(right && right.isEmpty())
            squareDivs[right.pos].classList.add("valid");
    }
    else{
        let pos = blackPieces[selectedPiece.id.slice(1)].pos;
        let left = board[pos].topLeft;
        let right = board[pos].topRight;

        if(left && left.isEmpty())
                squareDivs[left.pos].classList.add("valid");
        if(right && right.isEmpty())
                squareDivs[right.pos].classList.add("valid");
    }
}

function movePiece(element){
    selectedPiece.style.opacity = "0";

    if(selectedPiece.classList.contains("white")){
        let currentPos = whitePieces[selectedPiece.id.slice(1)].pos;
        
        squareDivs[currentPos].removeChild(selectedPiece);
        element.appendChild(selectedPiece);
        
        board[currentPos].resident = null; // clear square
        board[element.id].resident = whitePieces[selectedPiece.id.slice(1)]; // set new square
        whitePieces[selectedPiece.id.slice(1)].pos = element.id; // update pos
    }
    else{
        let currentPos = blackPieces[selectedPiece.id.slice(1)].pos;
        
        squareDivs[currentPos].removeChild(selectedPiece);
        element.appendChild(selectedPiece);
        
        board[currentPos].resident = null; // clear square
        board[element.id].resident = blackPieces[selectedPiece.id.slice(1)]; // set new square
        blackPieces[selectedPiece.id.slice(1)].pos = element.id; // update pos
    }

    removeSquaresSelection();
    selectedPiece.classList.remove("selected");
    setTimeout(() =>{
        selectedPiece.style.opacity = "1";
        selectedPiece = null;
    },200);
    turn ++;
}

function checkCapture(){
    let pieces = turn % 2 == 0? whitePieces : blackPieces;
    let maxLen = 0;

    pieces.forEach(piece => {
        let pos = board[piece.pos];
        let routes = [];
        
        getCaptureRoutes(piece, [] , [pos], routes);
        
        
        maxLen = routes.reduce((acc,item) => {
            acc = item.length > acc? item.length : acc;
            return acc;
        },0);

        piece.setRoutes(routes.filter(path => path.length == maxLen),maxLen)

        board.forEach(square => square.resetEntryPoints());
    })
    
    maxLen = pieces.reduce((acc,piece) => {
        acc = piece.pathLen > acc ? piece.pathLen : acc;
        return acc;
    },3);

    pieces = pieces.filter(piece => piece.pathLen == maxLen)
    
    captureRoutes = pieces;
}

function getCaptureRoutes(piece,path,squares,routes){ 
    path.push(...squares);    
    
    let pos = squares.pop();
    
    if(pos.topRight?.resident?.isEnemy?.(piece) && pos.topRight.topRight?.isEmpty?.(piece) && pos.topRight?.topRight?.entryPoints.bottomLeft){
        pos.topRight.topRight.entryPoints.bottomLeft = false;
        pos.entryPoints.topRight = false;
        getCaptureRoutes(piece,[...path],[pos.topRight,pos.topRight.topRight],routes);
    }
    
    if(pos.topLeft?.resident?.isEnemy?.(piece) && pos.topLeft.topLeft?.isEmpty?.(piece) && pos.topLeft?.topLeft?.entryPoints.bottomRight){
        pos.topLeft.topLeft.entryPoints.bottomRight = false;
        pos.entryPoints.topLeft = false;
        getCaptureRoutes(piece,[...path],[pos.topLeft,pos.topLeft.topLeft],routes);
    }
    
    if(pos.bottomRight?.resident?.isEnemy?.(piece) && pos.bottomRight.bottomRight?.isEmpty?.(piece) && pos.bottomRight?.bottomRight?.entryPoints.topLeft){
        pos.bottomRight.bottomRight.entryPoints.topLeft = false;
        pos.entryPoints.bottomRight = false;
        getCaptureRoutes(piece,[...path],[pos.bottomRight,pos.bottomRight.bottomRight],routes);
    }
    
    if(pos.bottomLeft?.resident?.isEnemy?.(piece) && pos.bottomLeft.bottomLeft?.isEmpty?.(piece) && pos.bottomLeft?.bottomLeft?.entryPoints.topRight){
        pos.bottomLeft.bottomLeft.topRight = false;
        pos.entryPoints.bottomLeft = false;
        getCaptureRoutes(piece,[...path],[pos.bottomLeft,pos.bottomLeft.bottomLeft],routes);
    }
    routes.push(path);
}

function showCaptureRoutes(piece){
    piece.routes.forEach((route) => {
        for (let i = 2; i < route.length; i += 2) {
            let htmlSquare = document.getElementById(`${route[i].pos}`)
            htmlSquare.classList.add('red');    
        }
    })
}


function removeSquaresSelection(){
    squareDivs.forEach(square => {
        if(square.classList.contains("grey"))
            square.className = "square grey";
    })
}

function darkenSquares(){
    squareDivs.forEach(square => {
        if(square.classList.contains("white"))
            square.classList.add("darken");
    })
}

function getPiece(id){
    if(id[0] === 'w'){
        return whitePieces[id.slice(1)];
    }
    return blackPieces[id.slice(1)];
}

initBoard();



document.addEventListener('keydown', () => {
    checkCapture();
    console.log(captureRoutes);
})

