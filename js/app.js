"use strict";
var _a;
//משימות לביצוע 
// 1: קבלת הערכים מתוך הטופס לתוך אובייקט אינטרפייס
//1.1 הצגת המדדים בזמן אמת 
//2: פונקציה לשליחת בקשה והחזרת מערך השחקנים התואמים לדרישה
// 3 : פונקציה שמקבלת מערך שחקנים ומציגה אותם בדף 
// 4: מערך של השחקנים שלי
//4.1 פונקציית הוספת שחקן למערך שלי
// 5: פונקציה שמציגה את השחקנים שלי בדף
const baseurl = "https://nbaserver-q21u.onrender.com/api/filter";
const ranges = document.querySelectorAll(`input[type="range"]`);
let myplayers = [];
ranges.forEach(range => {
    range.addEventListener("change", () => {
        const label = document.querySelector(`#${range.id}-label`);
        if (label) {
            label.textContent = range.id + ": " + range.value;
        }
    });
});
const GetFormObject = () => {
    const position1 = document.querySelector(".position").value;
    const points1 = document.querySelector("#points").value;
    const pre3 = document.querySelector("#pre3").value;
    const pre2 = document.querySelector("#pre2").value;
    console.log(pre3);
    console.log("2 " + pre2);
    console.log(points1);
    return {
        position: position1,
        twoPercent: parseInt(pre2),
        threePercent: parseInt(pre3),
        points: parseInt(points1)
    };
};
const GetPlayersArr = async () => {
    try {
        const data = GetFormObject();
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
            myplayers = newItem;
            displayPlayersFromSearch(myplayers);
            // displayPlayersFromSearch(newItem as Player[])
            return newItem;
        }
        else {
            console.error(res.statusText);
        }
    }
    catch (error) {
        console.error(`Error adding :`, error);
    }
};
const displayPlayersFromSearch = (players) => {
    console.log("rdrhbz");
    const playerstable = document.querySelector(".search-players-table-players");
    playerstable.innerHTML = "";
    for (const player of players) {
        const playerbox = document.createElement("tr");
        playerbox.id = player._id;
        const playerName = document.createElement("td");
        const playerPosition = document.createElement("td");
        const playerPoints = document.createElement("td");
        const player3pre = document.createElement("td");
        const player2pre = document.createElement("td");
        const playeraction = document.createElement("td");
        const playerBtn = document.createElement("button");
        playerPosition.className = "td-pos";
        playerBtn.textContent = `add ${getFirstWord(player.playerName)} to my team`;
        playerBtn.className = "add-to-my-team";
        playerBtn.addEventListener("click", () => addPlayerToMyTeam(player));
        playerName.id = "player-th";
        playeraction.id = "Action-th";
        playeraction.appendChild(playerBtn);
        playerName.textContent = player.playerName;
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
};
const addPlayerToMyTeam = (player) => {
    const playerbox1 = document.querySelector(`#${player.position}`);
    console.log(playerbox1);
    const playerbox = playerbox1.querySelector(".players-box-det");
    console.log(playerbox);
    playerbox.innerHTML = "";
    const playerName = document.createElement("h4");
    const player3pre = document.createElement("p");
    const player2pre = document.createElement("p");
    const playerPoints = document.createElement("p");
    playerPoints.textContent = "points:" + player.points.toString();
    player2pre.textContent = "twoPercent:" + player.twoPercent.toString() + "%";
    player3pre.textContent = "threePercent:" + player.threePercent.toString() + "%";
    playerName.textContent = player.playerName;
    playerbox === null || playerbox === void 0 ? void 0 : playerbox.appendChild(playerName);
    playerbox === null || playerbox === void 0 ? void 0 : playerbox.appendChild(player3pre);
    playerbox === null || playerbox === void 0 ? void 0 : playerbox.appendChild(player2pre);
    playerbox === null || playerbox === void 0 ? void 0 : playerbox.appendChild(playerPoints);
};
const thPlayers = document.querySelectorAll(".th-p");
thPlayers.forEach(th => {
    th.addEventListener("click", () => {
        switch (th.textContent) {
            case "player":
                displayPlayersFromSearch(sortPlayersArr(myplayers, "playerName"));
                break;
            case "points":
                displayPlayersFromSearch(sortPlayersArr(myplayers, "points"));
                break;
            case "FG%":
                displayPlayersFromSearch(sortPlayersArr(myplayers, "twoPercent"));
                break;
            case "3P%":
                displayPlayersFromSearch(sortPlayersArr(myplayers, "threePercent"));
                break;
            default:
                break;
        }
    });
});
(_a = document.querySelector(".search-players")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => GetPlayersArr());
const sortPlayersArr = (playersarr, type) => {
    return playersarr.sort((a, b) => {
        if (a[type] < b[type]) {
            return -1;
        }
        if (a[type] > b[type]) {
            return 1;
        }
        return 0;
    });
};
const getFirstWord = (sentence) => {
    const firstWord = sentence.split(' ')[0];
    return firstWord;
};
