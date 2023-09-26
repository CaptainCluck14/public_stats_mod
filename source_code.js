// ==UserScript==
// @name         Public Stats Mod
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Take Stats for KOTCs in SHell Shockers!
// @author       Axudus#1315 (357741912095981579)
// @match        https://shellshock.io/*
// @grant        none
// ==/UserScript==


(function () {
    const players = new Set();

    const teamScores = { captureScoreBlue: 0, captureScoreRed: 0 };
    const teamColors = [, "rgba(64, 224, 255, 1)", "rgba(255, 192, 160, 1)"];

    const weaponSVGs = [ // ['Soldier', 'Scrambler', 'Ranger', 'Eggsploder', 'Whipper', 'Crackshot', 'TriHard']
        "m61.7 51.4.4-1.3 22.4-19.7-.2-1.8 14.6-12.7-3.3-3.3-4.3 3.6C86.7 13.9 83 8.7 83 8.7l-1.9 1.7c3.5 4 5.2 7.5 6.1 9.5l-.9.7-6.1-3-3.4 2.8-1.6-1-11.5 9.5.2 2.2-.5.4-3.6-1.1-5.3 4.8-1.3-.8-1.2 1.2 2.6 3.1-28 23.2.4 6.5-2.7 4.5-3.1-.2L7.1 85l10.5 12.1 14.8-23.3 1.3-.5 8.7 24.1 10.8-9.1-6.4-13.9 7.1-6.7-3-5c2.8 2.7 18.2 16.9 38.8 15.6L91 63.1s-17.8 1.3-29.3-11.7zm24.9-36.3c.2-.2.5-.2.8 0l1.6 1.2c.3.2.3.7 0 1l-.6.5c-.3.2-.7.2-.9-.2l-.9-1.7c-.3-.3-.2-.7 0-.8zM45.5 71.6 44 68.2l4.2-2.1-.5-.9-2.7-.7.9-2 1.4-.3 2.9 4.9-4.7 4.5z",
        "M94.5 15.3c-.3-.6-.9-1.5-1.8-2.6-.9-1-1.6-1.8-2.2-2.3-.5-.4-1.1-.4-1.6-.1l-3.7 3-2.2-.6-3.1 2.2.5 2.2L46 44.6c-.2.2-.4.4-.7.6l-2.6-2.5-1.7 1.5 2.5 3c-5.2 6.5-10 17.3-10 17.3l-3.3.2L11.4 83l11.3 12.9L41 67.7l2.8 1.5.6-.2c7.9-2.4 9.5-7.5 9.5-7.7l.2-.7-3.9-5.1 10.5-6.8L85.1 28c.8-.7.9-1.8.3-2.7l-.7-1 9.4-7.5c.5-.3.7-1 .4-1.5zM44.1 66.1l-1.5-.8 2.5-3.8h3l.9-1-2.1-1.5 1.2-1.4 2.7 3.5c-.5 1.1-2.3 3.5-6.7 5z",
        "m76.8 32.6-.1-2.2 22.5-19.3-3.3-3.3-11.4 9.6-4.7-1.3-7.6 6.5-2.2-1-25.7 21.8-3.6-3.5.9-.7 6.5-3.9 2.7.2 1.2-1.1s-1.8-3.4-6.9-8l-1.2 1.3v2.1l-4.6 5.8-8.3 8-3.9 1.7-13.9 11.1-2.9.9s1 2.1 2.4 3.6c2 2 4 3.2 3.7 3l.8-2.6 13.1-11.7 2.5-3.1.2-.2 3.5 3.8-12.4 10.6 1.7 8.9-19 16.5L17 98.2l16.9-17 3.4 7.5 11.3-6.3-5-9.4 9.4-9.8-2.2-3.8 1.5.8 6.6 5.5 8.7-10.8c-7.7-4.6-9.6-8-9.6-8l5.2-2 13.6-12.3zm1.2-12 1.8.6-4.6 4-1-1.1 3.8-3.5zM17.5 89.1l-3.5-5 2.5-2.2 3.8 4.4-2.8 2.8zm8.1-4.2-4.4-7.3L29 71l3.5 7.3-6.9 6.6zm23.9-22.1-7.3 7.6-2.5-4.6 4.9-2.3-.3-2c-1.5.6-2.5-.1-3.2-.7l4.9-3.7.1.1 3.4 5.6z",
        "m78.1 48.5-5.1-.1.1-1.7 6.2-5.1 1.4-3.2.9 1.1 19.2-13.1s-.9-3.1-3.7-7l.2-1.8c.2-1.2-.7-2.3-1.9-2.4l-1.9-.2c-1.7-1.7-3.7-3.4-6.2-5L70.9 26.6l1.3 1.5-1.5.5-5.5-2.6-4.9 4.1.8 4.4-4.7 3.8-4-4.6.1-.1 1.4.3 7.4-6.9.6.7 4.2-3.4-5.3-6.3-4.2 3.4.4.6-7.8 6v1.5l-12.4 8.6 5.4 6.2 5.7-6 3.4 4.7-1.6-.4-3.7 2.8 1 1.3-22.3 19-1.4-.5-3.5 2.8.2 1.3-8.8 5.2-2.2-.3-3.9 3.5s3.4 11.5 14.7 18.2l4.4-3.5.3-2.2 6-7.5.6-.5 1.3.4 3.2-2.8-.1-1.4 2.9-2.5 11.1 11.6 7.1-6.2-10-12.6 9.5-8.2 8.3.2.2.3-2.1 2.1 5.1 6.8 1.8-1.7 5.8 9 6.5-6.1-4.2-10.8 5.2-5.7-4.6-6.1zm-1.4 2.6 2.5 3.6-3.2 3.4-2-2.5 2.5-1.9-.6-.7-3.1-.1.1-1.9 3.8.1zM63.2 31.2l2.4-2 1.4.7-.3.1-3.3 2.6-.2-1.4z",
        "m98 16.8-2.9-3.4c-.4-.4-1.1-.5-1.5-.1L90.4 16c-.3.3-.5.7-.3 1.1l-6.4 5.6-5.4-5.7-2-1-4-3.9-.7.5-.5 1.1-1.7-2.1-1 .8 1.7 2.1-1.2.2-1.8 1.4.2 1.1-1.1.8-1.1-.4-1.7 1.3.2 1.2-.9.9-1.1-.4-1.7 1.4.2 1.2-1 .8-1.2-.4-1.6 1.3.2 1.3-1.1.8-1.3-.4-1.7 1.4v1.3l-2.8-3.5-1.8 1.5 3.7 4.5-.8 1.2 1.8 8.1L7.8 78l16 16.3H26l18.4-16 10.5-.5 9.5-5.5 5.2-7.1v-7.4l9-6.2 2.1 4.1 5.3-4.2v-6.9l-3.7-6.2 3.7-3.2 3.9 4.2 4.1-3.3-4.7-6.1h-4l.8-2.2 7.6-6.6c.3.1.7 0 1-.2l3.2-2.7c.4-.4.5-1.1.1-1.5zM58.6 66.1l-6.2 4.5-6.6-7.3 10.6-9c1.5 1.9 4.6 4.9 4.6 4.9l-2.4 6.9zm-.8-29.5-.6-2.3 14.4-12.1 3 .5-16.8 13.9zM74.4 50l-4.1-3.3-.8-3.3 5.5-4.6 4.4 6.2-5 5z",
        "m97.3 9.6-3.1-3.1-3.6 2-36.2 31.7h-.8l-1.4-1.6 1.4-1.2 4.2-2 3.7-2.8-4.9-5.6-3.6 2.8-3.8 5.3-.4-.5-1.9 1.6.4.5-9.8 8.3-.5-.6-1.9 1.6.5.6-6.6 3.3-1.8 1.8 5.2 5.7 2.1-1.8 4-5.6 1.5 1.8-.5 1.6-1.1-.8-1.6 1.2.6.9-1.9 1.7 2.9 3.2-3.4 6.2-3.9.4-17 14 2.4 2.1-1.5 1.5-2.3-1.9-4.1 3.9 16.6 13.8 3.3-4.2-2.3-1.9 1.2-1.3 1.5 1.3L41 75.4l6 2.4 4-4-5.7-6-.4-2.8 3.3-4.3 2.3 2.4h6.3l3.7-3.2 1-5.7-3.2-3.6 22-19-3.1-4 16.9-14.1 3.2-3.9zM18.1 83.7l3 2.7-1.4 1.3-3.2-2.7 1.6-1.3zm6.2 7.9-2.4-2 1.3-1.3 2.3 2-1.2 1.3zm17.3-42-1-1.1 9.8-8.2 1.1 1.2-9.9 8.1zm17.3 5.6-.4 3.5-2.5 2.4-4.6.3-1.9-2.1.7-.9 1.3 1.4h3.4l.9-.8-2.8-.7-1.4-1.7.2-.3 4.6-4 2.5 2.9z",
        "m94.3 7.4-2.8.5-1 3-12.1 11.8-1.1-.9-5 4.5 3.8 4.1.6 2.9-2 1.4-5.4-6.5-9-1-12 10.3-.5-.5 2-1.7-3.5-4.3-2.1 2-.7-.7-5.1 4.9.7.7-2 1.8 3.1 3.7 2.4-2 .6.6-6.2 5.2 1.8 1.9 7.9-6.8h1l1.1 1.2.2.7-.3.3.3 2.3-2 1.3-1.2-1.1-28.2 21.2 2.2 2.7-12.1 9.4v4.2l9.4 8.6 1.7-.6 6.2 6.1 5.2-4.6.6-14h2.9l1.5-1.4s2.9 3.2 6.7 6.1c3.8 2.9 10.3 8.1 10.3 8.1L58.3 81v-2.4l-2.7-.6s-8-4.8-11.6-9.1l1.1-1.1-1.1-2.6 7.4-6.5L59 70.5l3.4 1.1 9.5-8-5.7-15.9 1.9-1.4 1.5 1.1 2.3-1.8-1-1.9 1-.8 11.7 10.9 2.7-2.5L77.4 38l4.3-3.3-.7-6.2-.8-1.3.3-1.5L95 15.3l2.8-.5.5-2.9-4-4.5zm-37 31.2-4.3.6.8 2.3-1.8.5-1.1-.3-.9-1.3v-.9l11-9.6 2.3 1.5-.4 2.3-3.2-.1.9 2.2-4.2.4.9 2.4zm11.1 23.6-4.6 4.4-4.6-8 .8-2.4.9-.1-.1-1.6-1.7-2.5 4.3-3.8 5 14z"
    ];

    const keys = ["name", "kills", "deaths", "kdr"];

    let downloadOrCopy = true;
    let sortType = "kills";

    Array.prototype.push = new Proxy(Array.prototype.push, {
        apply(func, that, args) {
            if (args[0]?.player?.id) {
                const player = args[0].player;
                players.add(player);
            }
            return Reflect.apply(...arguments);
        }
    });

    async function downloadImage(htmlElement) {
        // photobooth update added html2canvas, so it's no longer needed to be 'required' above
        const canvas = await html2canvas(htmlElement, {
            scale: 2
        });

        const imageData = canvas.toDataURL("image/png");

        if (downloadOrCopy) {
            let link = document.createElement("a");
            link.download = "stats.png";
            link.href = imageData;
            link.click();
        } else {
            const canWriteToClipboard = await askWritePermission();

            if (canWriteToClipboard) {
                const response = dataURLtoBlob(imageData);
                await setToClipboard(response).catch(function (error) {
                    if (typeof error == "string" && error.includes("not focused")) { // accomplishes the task
                        alert("Failed to copy! Document is not focused.");
                    }
                })
            }
        }
    }

    function dataURLtoBlob(dataurl) {
        let arr = dataurl.split(","),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {
            type: mime
        });
    }

    function getStats() {
        return [...players].reduce((ret, player) => {
            if (!player.stats.kills && !player.stats.deaths) return ret;

            ret[player.team].push([
                [player.charClass, player.name],
                player.stats.kills,
                player.stats.deaths,
                (player.stats.kills / (player.stats.deaths || 1)).toFixed(2)
            ]);
            return ret;
        }, [[], [], []]);;
    }

    function sortByKey(array, key, order) {
        key = Math.max(0, Math.floor(key));
        const num = key !== 0;

        return array.sort((a, b) => {// does its job
            if (num) {
                const valueA = Number(a[key]);
                const valueB = Number(b[key]);

                if (valueA < valueB) {
                    return order === 1 ? -1 : 1;
                } else if (valueA > valueB) {
                    return order === 1 ? 1 : -1;
                }

                return 0;
            } else {
                const subArrayA = a[key];
                const subArrayB = b[key];

                if (subArrayA[1] < subArrayB[1]) {
                    return -1;
                } else if (subArrayA[1] > subArrayB[1]) {
                    return 1;
                }

                return 0;
            }
        });
    }

    function createRows(team, players) {
        const blue = team === 1;
        return `
            <div class="team ${blue ? "blue" : "red"}">
                <h2>${blue ? "Blue" : "Red"} Team - ${blue ? teamScores.captureScoreBlue : teamScores.captureScoreRed}</h2>
                <div class="table">
                    <div class="row header">
                        <div class="cell name">Name</div>
                        <div class="cell">Kills</div>
                        <div class="cell">Deaths</div>
                        <div class="cell">KDR</div>
                    </div>
                    ${players.map(player => `
                        <div class="row">
                            ${player.map((val, idx) => `
                                <div class="cell ${idx ? "" : "name"}">
                                    ${!idx ? `<svg viewBox="0 0 100 100"><path d="${weaponSVGs[val[0]]}" fill="${teamColors[team]}"></path></svg>` + val[1] : val}
                                </div>`).join("")}
                        </div>`).join("")}
                </div>
            </div>
        `;
    }

    function generateHTML() {
        const [, blue, red] = getStats();

        let sortIndex = keys.indexOf(sortType);
        let blueRows = createRows(1, sortByKey(blue, sortIndex, 0));
        let redRows = createRows(2, sortByKey(red, sortIndex, 0));

        let div = document.createElement("div");
        div.innerHTML = `${style}<div class="container">${blueRows}${redRows}</div>`;

        document.body.appendChild(div);
        downloadImage(div);
        div.remove();
    }

    const style = `
    <style>
        .container {
            font-family: 'Nunito', sans-serif;
            display: flex;
            flex-wrap: wrap;
        }

        .team {
            flex-basis: 50%;
            box-sizing: border-box;
            border: 1px solid black;
            background-color: #1e1e1e;
            padding: 10px;
            color: white;
        }

        .team h2 {
            margin-top: 0;
            background-color: #2c2c2c;
            font-weight: bold;
            padding: 5px;
        }

        .table {
            display: table;
            width: 100%;
            border-collapse: collapse;
        }

        .row {
            display: table-row;
            text-align: center;
        }

        .name {
            text-align: left;
        }

        .name svg {
            width: 25px;
            height: 25px;
            float: right;
        }

        .cell {
            display: table-cell;
            padding: 5px;
            border: 1px solid black;
        }

        .header {
            background-color: #2c2c2c;
            font-weight: bold;
            border: 1px solid black;
        }

        .red {
            --red: ${teamColors[2]};
            border-color: var(--red);
            border-width: 5px;
            color: var(--red);
        }

        .red h2 {
            color: var(--red);
        }

        .blue {
            --blue: ${teamColors[1]};
            border-color: var(--blue);
            border-width: 5px;
            color: var(--blue);
        }

        .blue h2 {
            color: var(--blue);
        }
    </style>`;

    async function askWritePermission() {
        try {
            const { state } = await navigator.permissions.query({ name: "clipboard-write" });
            return state === "granted"
        } catch (error) {
            alert("Missing access to copy to clipboard!");
            downloadOrCopy = true;
            return false
        }
    }

    async function setToClipboard(blob) {
        const data = [new ClipboardItem({ [blob.type]: blob })];
        await navigator.clipboard.write(data);
    }

    function loadSettings() {
        if (!localStorage.hasOwnProperty("stats_mod_download")) localStorage.setItem("stats_mod_download", true);
        if (!localStorage.hasOwnProperty("stats_mod_sort")) localStorage.setItem("stats_mod_sort", "kills");

        downloadOrCopy = getStoredBool("stats_mod_download", true);
        let sort = getStoredString("stats_mod_sort", "kills");

        sortType = keys.includes(sort) ? sort : "kills";
    }

    let buttonsLoaded = setInterval(() => {
        let parent = document.querySelector(".pause-game-weapon-select");
        if (parent) {
            clearInterval(buttonsLoaded);

            let resetStats = document.createElement("button");
            resetStats.className = "ss_button btn_red bevel_red";
            resetStats.innerHTML = "<i class='fas fa-trash'></i> Clear Stats";
            resetStats.addEventListener("click", function (e) {
                if (window.extern.gameType != 3) return alert("Restricted for King of the Coup.");
                players.forEach(function (player) {
                    player.stats.kills = 0;
                    player.stats.deaths = 0;
                })
                players.clear();
            });
            parent.appendChild(resetStats);

            let downloadStats = document.createElement("button");
            downloadStats.className = "ss_button btn_med btn_green bevel_green";
            downloadStats.innerHTML = "<i class='fas fa-download'></i> Download Stats";
            downloadStats.addEventListener("click", function (e) {
                if (window.extern.gameType != 3) return alert("Restricted for King of the Coup.");
                generateHTML();
            })

            parent.appendChild(downloadStats);
            loadSettings();

            const oldLeaveGame = window.extern.leaveGame;
            window.extern.leaveGame = function (callback) {
                oldLeaveGame(callback);
                players.clear();
            };

            let selectDiv = document.createElement("div");
            let pickMethod = document.createElement("select");

            let optionGroup = document.createElement("optgroup");
            optionGroup.label = "Save Type";
            optionGroup.appendChild(new Option("Download", "download"));
            optionGroup.appendChild(new Option("Copy to Clipboard", "copy"));

            pickMethod.appendChild(optionGroup);

            pickMethod.classList = "ss_select ss_marginright_sm";
            pickMethod.value = downloadOrCopy ? "download" : "copy";

            pickMethod.addEventListener("change", function (e) {
                downloadOrCopy = this.value == "download";
                localStorage.setItem("stats_mod_download", downloadOrCopy);
            });

            let pickMethod2 = document.createElement("select");
            pickMethod2.classList = "ss_select ss_marginright_sm";

            let optionGroup2 = document.createElement("optgroup");
            optionGroup2.label = "Sort Type";

            optionGroup2.appendChild(new Option("Name", "name"));
            optionGroup2.appendChild(new Option("Kills", "kills"));
            optionGroup2.appendChild(new Option("Deaths", "deaths"));
            optionGroup2.appendChild(new Option("KDR", "kdr"));

            pickMethod2.appendChild(optionGroup2);
            pickMethod2.selectedIndex = keys.indexOf(sortType);
            pickMethod2.addEventListener("change", function (e) {
                if (!keys.includes(this.value)) return;

                sortType = this.value;
                localStorage.setItem("stats_mod_sort", this.value);
            })

            selectDiv.appendChild(pickMethod);
            selectDiv.appendChild(pickMethod2);

            selectDiv.style.display = "flex";
            pickMethod.style.flex = 1;
            pickMethod2.style.flex = 1;

            parent.appendChild(selectDiv);


            const node1 = document.getElementById("captureScoreBlue");
            const node2 = document.getElementById("captureScoreRed");

            const getScore = (node) => node.innerText.split("/")[0]?.trim();

            let stopScores = false; // messy but works so whatever
            const observer = new MutationObserver(function (mutationsList) {
                for (var mutation of mutationsList) {
                    if (mutation.type == "childList") {
                        let { target } = mutation;
                        if (target.innerText != target.lastText) {
                            target.lastText = target.innerText;

                            let newScore = getScore(target);
                            if (newScore == 5) {
                                stopScores = true;
                                teamScores[target.id] = newScore;
                            } else if (newScore == 1) {
                                stopScores = false;

                                teamScores.captureScoreBlue = getScore(node1);
                                teamScores.captureScoreRed = getScore(node2);
                            }
                            if (stopScores) return;
                            teamScores[target.id] = newScore;
                        }
                    }
                }
            });

            observer.observe(node1, { attributes: true, childList: true });
            observer.observe(node2, { attributes: true, childList: true });
        }
    }, 10000);

}());

