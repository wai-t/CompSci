//
// in this program, we will simulate two algorithms playing rock-paper-scissors
// against each other. 
// 
// The function robo_play() implements our opponent robo's algorithm
// The function ny_play() implements our algorithm
//
// when the program is run it will play NUM_GAMES between the two algorithms. For
// each game we win we get a point, and we lose a point for each loss.
// 
// To support possible strategies we might want to try, the array robo_plays[]
// maintains all the plays that robo has played up to the last game. Obviously
// it can't contain information about future games.
//
// To run the games, you can use a Terminal and type:
//   node rock_paper_scissors.js
// 
const NUM_GAMES = 1000;

const ROCK = "ROCK";
const PAPER = "PAPER";
const SCISSORS = "SCISSORS";

const plays = [ROCK, PAPER, SCISSORS]

let robo_plays = [NUM_GAMES];

function get_result(my_play, robo_play) {
    switch ([my_play, robo_play].toString()) {
        case [PAPER, ROCK].toString():
        case [SCISSORS, PAPER].toString():
        case [ROCK, SCISSORS].toString():
            return 1;
        case [ROCK, PAPER].toString():
        case [PAPER, SCISSORS].toString():
        case [SCISSORS, ROCK].toString():
            return -1;
        default:
            return 0;
    }
}

//
// Robo's game playing strategy. If you study the code in here, you
// will see that he's trying to do something that isn't random
// in an attempt to beat you. 
//
function robo_play(game_num)
{
    if (Math.random() < 0.25 && game_num > 0) {
        robo_plays[game_num] = robo_plays[game_num-1];
    }
    else {
        let rand = Math.floor( Math.random() * 3 ) ;
        robo_plays[game_num] = plays[rand];
    }
    return robo_plays[game_num];
}

//
// This function is your game strategy
// 
// returns one of ROCK, PAPER, SCISSORS
// game_num: the game number
//
// The global array robo_plays[] contains all the plays that robo
// has played so far. e.g. robo_plays[game_num-1] will give you
// what he played on the previous go to this one
//
function my_play(game_num)
{
    // TODO
    // At the moment your strategy is to play SCISSORS every time.
    // Your challenge is to replace the statement below with a strategy that will beat
    // robo consistently
    //
    //return SCISSORS;

    if (game_num) {
        if (robo_plays[game_num-1]===ROCK) return PAPER;
        if (robo_plays[game_num-1]===PAPER) return SCISSORS;
        if (robo_plays[game_num-1]===SCISSORS) return ROCK;
    }
    else {
        return SCISSORS;
    }
}

let score = 0;
for (let game = 0; game<NUM_GAMES; game++) {
    let mine = my_play(game);
    let robo = robo_play(game);
    
    let result = get_result(mine, robo);
    score += result;
    console.log(game + ": I played " + mine + ", robo played " + robo +". " + ((result==0) ? "draw. " : (result>0 ? "I win. " : "I lose. ")) + "score=" + score);
}

console.log("Final score " + score + " from " + NUM_GAMES + " games");
let stddev = Math.sqrt(NUM_GAMES);
console.log("You need to score consistently above " + stddev + " to show that you have a winning algorithm");