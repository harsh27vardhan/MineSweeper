const starter = document.querySelector(".starter");
const starterButton = document.querySelector("#starter-btn");
const minesweeper = document.querySelector(".minesweeper");
const ender = document.querySelector(".ender");
const playAgainBtn = document.querySelectorAll(".play-again");
const lost = document.querySelector(".lose"); 
const won = document.querySelector(".won"); 

function startGame() {
    ender.style.display = "none";
    lost.style.display = "none";
    won.style.display = "none";
    const levelSelect = document.querySelector(".minesweeper-level");
    levelSelect.addEventListener("change",startGame);
    const flags = document.querySelector(".minesweeper-flag-count");
    
    const restart = document.querySelector(".minesweeper-restart");
    restart.addEventListener("click",startGame)
    const gameBoard = document.querySelector(".minesweeper-board");
    gameBoard.innerHTML = "";
    let level = levelSelect.value;
    // console.log(level);

    let board = [];
    let boardSize = levelMapper[level].boardSize;
    let mineCount = levelMapper[level].mineCount;
    let mines = [];
    let flagCount = mineCount;
    let gameOver = false;
    flags.innerText = `🚩${flagCount}`;

    while(mines.length < mineCount){
        let r = Math.floor(Math.random()*boardSize);
        let c = Math.floor(Math.random()*boardSize);

        if(mines.includes(`${r}-${c}`)) continue;
        mines.push(`${r}-${c}`);
    }
    console.log(mines);

    createBoard();

    function createBoard(){
        for(let i=0;i<boardSize;i++){
            let rowArray = [];
            const row = document.createElement("div");
            row.classList.add("minesweeper-row");
            for(let j=0;j<boardSize;j++){
                const box = document.createElement("div");
                box.classList.add("box","unrevealed");
                box.addEventListener("click",revealBox);
                box.addEventListener("contextmenu",flagBox);
                box.setAttribute("id", `${i}-${j}`);
                if(window.screen.width<500){
                    box.style.height = `${300/boardSize}px`;
                    box.style.width = `${300/boardSize}px`;
                }
                else if(window.screen.width<600){
                    box.style.height = `${400/boardSize}px`;
                    box.style.width = `${400/boardSize}px`;
                }
                else{
                    box.style.height = `${500/boardSize}px`;
                    box.style.width = `${500/boardSize}px`;
                }
                row.append(box);
                rowArray.push(box);
            }
            board.push(rowArray);
            gameBoard.append(row);
        }
    }
    function flagBox(event){
        event.preventDefault();
        // console.log("Right key is clicled");
        const box = event.currentTarget;
        if(box.classList.contains("revealed"))  return;

        if(box.classList.contains("flag")){
            box.classList.remove("flag");
            flagCount++;
            flags.innerText = `🚩${flagCount}`;
        }
        else{
            box.classList.add("flag");
            flagCount--;
            flags.innerText = `🚩${flagCount}`;
        }
    }
    function revealBox(event){
        const box = event.currentTarget;
        if(box.classList.contains("flag"))  return;

        checkMine(box);

        const values = box.id.split("-");
        const r = parseInt(values[0]);
        const c = parseInt(values[1]);
        revealCount(r,c);

        box.classList.add("revealed");
        box.classList.remove("unrevealed");

        // console.log(document.querySelectorAll(".revealed").length)
        if(document.querySelectorAll(".revealed").length === (boardSize*boardSize - mineCount)){
            // alert("You Won!");
            endGame();
        }

    }
    function checkMine(box){
        if(mines.includes(box.id)){
            box.classList.add("mine");
            gameOver = true;
            revealAllMines();
            endGame();
            // alert("Game Over");
        }
        // console.log(box.id);
        // console.log(typeof(box.id));
    }
    function revealAllMines(){
        mines.forEach(coord => {
            const values = coord.split("-");
            const r = parseInt(values[0]);
            const c = parseInt(values[1]);
            board[r][c].classList.add("revealed","mine");
        })
    }
    function revealCount(r,c){

        if(r<0 || c<0 || r>=boardSize || c>=boardSize || gameOver) return;
        if(board[r][c].classList.contains("revealed"))  return;
        board[r][c].classList.add("revealed");

        let count = 0;
        for(let i=r-1;i<=r+1;i++){
            for(let j=c-1;j<=c+1;j++){
                if(i<0 || j<0 || i>=boardSize || j>=boardSize) continue;
                if(mines.includes(`${i}-${j}`)){
                    count++;
                }
            }
        }
        if(count>0){
            board[r][c].innerText = count;
        } 
        else{
            for(let i=r-1;i<=r+1;i++){
                for(let j=c-1;j<=c+1;j++){
                    if(i<0 || j<0 || i>=boardSize || j>=boardSize) continue;
                    revealCount(i,j);
                }
            }
        }
    }
    function endGame(){
        ender.style.display = "flex";
        playAgainBtn[0].addEventListener("click",startGame);
        playAgainBtn[1].addEventListener("click",startGame);
        if(document.querySelectorAll(".revealed").length === (boardSize*boardSize - mineCount)){
            won.style.display = "flex";
            lost.style.display = "none";
        }
        else{
            won.style.display = "none";
            lost.style.display = "flex";
        }
    }

}
// document.addEventListener("DOMContentLoaded", ()=>{
//     starter.style.display = "none";
//     minesweeper.style.display = "flex";
//     startGame();
// });
starterButton.addEventListener("click",()=>{
    starter.style.display = "none";
    minesweeper.style.display = "flex";
    startGame();
});

const levelMapper = {
    easy:{
        boardSize: 10,
        mineCount: 10
    },
    medium:{
        boardSize: 15,
        mineCount: 15
    },
    hard:{
        boardSize: 20,
        mineCount: 20
    }
}