//משימות לביצוע 
// 1: קבלת הערכים מתוך הטופס לתוך אובייקט אינטרפייס
//1.1 הצגת המדדים בזמן אמת 
//2: פונקציה לשליחת בקשה והחזרת מערך השחקנים התואמים לדרישה
// 3 : פונקציה שמקבלת מערך שחקנים ומציגה אותם בדף 
// 4: מערך של השחקנים שלי
//4.1 פונקציית הוספת שחקן למערך שלי
// 5: פונקציה שמציגה את השחקנים שלי בדף
const baseurl:string = "https://nbaserver-q21u.onrender.com/api/filter";


const ranges = document.querySelectorAll(`input[type="range"]`)!
let myplayers:Player[] =[] 
ranges.forEach(range => {
    range.addEventListener("change", () => {
        const label = document.querySelector(`#${range.id}-label`);
        if (label) {            
            label.textContent = range.id +": "+(range as HTMLInputElement).value;
        }
    });
});

const GetFormObject = (): FormDetails=>{
    const position1: string = (document.querySelector(".position") as HTMLSelectElement).value;
    const points1: string = (document.querySelector("#points") as HTMLInputElement).value;
    const pre3: string = (document.querySelector("#pre3") as HTMLInputElement).value;
    const pre2: string = (document.querySelector("#pre2") as HTMLInputElement).value;
    console.log(pre3);
    console.log("2 "+pre2);
    console.log(points1);
    
    
    
    return {
        position: position1,
        twoPercent: parseInt( pre2),
        threePercent:parseInt(pre3),
        points: parseInt(points1)
    };
}
const GetPlayersArr = async():Promise<FormDetails[]|void>=>{
    try {
        const data = GetFormObject()
        console.log(data);
        
        const res = await fetch(baseurl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            const newItem = await res.json();
            console.log(newItem);
            myplayers = newItem as Player[];
            displayPlayersFromSearch(myplayers)

            // displayPlayersFromSearch(newItem as Player[])
            return newItem as Player[]

        } else {
            console.error( res.statusText);
        }
    } catch (error) {
        console.error(`Error adding :`, error);
    }
    
}
const displayPlayersFromSearch = (players :Player[]):void=>{
    console.log("rdrhbz");
    
    const playerstable = document.querySelector(".search-players-table-players")!
    playerstable.innerHTML = "";
    for (const player of players) {
        const playerbox = document.createElement("tr")
        playerbox.id = player._id;
        const playerName = document.createElement("td")
        const playerPosition = document.createElement("td")                
        const playerPoints = document.createElement("td")
        const player3pre = document.createElement("td")
        const player2pre = document.createElement("td")
        const playeraction = document.createElement("td")
        const playerBtn = document.createElement("button")
        playerPosition.className = "td-pos";
        playerBtn.textContent = `add ${getFirstWord(player.playerName)} to my team`;
        playerBtn.className = "add-to-my-team"
        playerBtn.addEventListener("click",()=>addPlayerToMyTeam(player));
        playerName.id ="player-th";
        playeraction.id ="Action-th";
        playeraction.appendChild(playerBtn);
        playerName.textContent = player.playerName
        playerPosition.textContent = player.position;
        playerPoints.textContent = player.points.toString();
        player3pre.textContent = player.threePercent.toString();
        player2pre.textContent = player.twoPercent.toString();
        playerbox.appendChild(playerName);
        playerbox.appendChild(playerPosition);
        playerbox.appendChild(playerPoints);
        playerbox.appendChild(player2pre);
        playerbox.appendChild(player3pre);
        playerbox.appendChild(playeraction);
        playerstable.appendChild(playerbox);
    }
}

const addPlayerToMyTeam = (player :Player)=>{
    const playerbox1 = document.querySelector(`#${player.position}`)!;
    console.log(playerbox1);
    
    const playerbox = playerbox1.querySelector(".players-box-det")!
    console.log(playerbox);

    playerbox.innerHTML = "";
    const playerName = document.createElement("h4");
    const player3pre = document.createElement("p")
    const player2pre = document.createElement("p")
    const playerPoints = document.createElement("p")
    playerPoints.textContent = "points:"+ player.points.toString();
    player2pre.textContent = "twoPercent:"+ player.twoPercent.toString()+"%";
    player3pre.textContent = "threePercent:" + player.threePercent.toString() + "%";
    playerName.textContent = player.playerName;
    playerbox?.appendChild(playerName);
    playerbox?.appendChild(player3pre);
    playerbox?.appendChild(player2pre);
    playerbox?.appendChild(playerPoints);
}

const thPlayers = document.querySelectorAll(".th-p");
thPlayers.forEach(th=>{
    th.addEventListener("click",()=>{
        switch (th.textContent) {
            case "player":
                displayPlayersFromSearch(sortPlayersArr(myplayers,"playerName"))
                break;
                case "points":
                displayPlayersFromSearch(sortPlayersArr(myplayers,"points"))
                break
                case "FG%":
            displayPlayersFromSearch(sortPlayersArr(myplayers,"twoPercent"))
                break;
                case "3P%":
            displayPlayersFromSearch(sortPlayersArr(myplayers,"threePercent"))
                break;
            default:
                break;
        }
    })
})

document.querySelector(".search-players")?.addEventListener("click",()=>GetPlayersArr())
const sortPlayersArr = <T>(playersarr: Player[], type: keyof Player): Player[] => {
    return playersarr.sort((a, b) => {
        if (a[type] < b[type]) {
            return 1;
        }
        if (a[type] > b[type]) {
            return -1;
        }
        return 0;
    });
}
const getFirstWord = (sentence: string): string => {
    const firstWord = sentence.split(' ')[0];
    return firstWord;
};
interface FormDetails{
    position: string,
    twoPercent:Number,
    threePercent:Number,
    points:Number,
}
interface Player{
    _id:string;
    position: string;
    twoPercent:Number;
    threePercent:Number;
    points:Number;
    playerName: string;
}