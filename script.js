console.log("Welcome to Spotify Clone!");

let activeSong = new Audio();
let songs = [];

// ---------------------------------------------------------------------------------
async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/Inventory/Songs/");
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

  let songs = [];
  for (let i = 0; i < as.length; i++) {
    if (as[i].href.endsWith(".mp3")) {
      songs.push(
        as[i].href.split("Songs/")[1].replaceAll("%20", " ").split(".mp3")[0]
      );
    }
  }

  return songs;
}

//--------------------------------------------------------------------------------------
function playMusic(track) {
  activeSong.src = "/Inventory/Songs/" + track + ".mp3";
  document.querySelectorAll(".play").forEach((element) => {
    element.src = "Inventory/Icons/play.svg";
  });
  document.querySelector(".play-pause").src = "Inventory/Icons/pause.svg";
  document.querySelector(".song-name").innerHTML =
    track + " - Sidhu Moose Wala";
  activeSong.play();
}

// -------------------------------------------------------------------------------------
async function main() {
  songs = await getSongs();

  let element = document.querySelector(".songs-list");
  for (const song of songs) {
    element.innerHTML =
      element.innerHTML +
      `           <li class="song">
                    <img src="Inventory/Icons/music.svg" alt="">
                    <span class="song-info">
                        <div class="song-title">${song}</div>
                        <span>Sidhu Moose Wala</span>
                    </span>
                    <span class="play-now">Play Now</span>
                    <img class="play" src="Inventory/Icons/play.svg" alt="">
                </li>`;
  }

  // ------------
  Array.from(document.querySelectorAll(".song")).forEach((e) => {
    e.querySelector(".play").addEventListener("click", () => {
      console.log(e.querySelector(".song-title").innerHTML);
      playMusic(e.querySelector(".song-title").innerHTML);
      e.querySelector(".play").src = "Inventory/Icons/pause.svg";
    });
  });

  //---------
  document.querySelector(".play-pause").addEventListener("click", () => {
    console.log("play-pause clicked");
    if (activeSong.paused) {
      activeSong.play();
      document.querySelector(".play-pause").src = "Inventory/Icons/pause.svg";
    } else {
      activeSong.pause();
      document.querySelector(".play-pause").src = "Inventory/Icons/play.svg";
    }
  });

  //------------
  document.querySelector(".volume-on").addEventListener("click", () => {
    if (activeSong.volume != 0) {
      activeSong.volume = 0;
      document.querySelector(".volume-on").src = "Inventory/Icons/mute.svg";
    } else {
      activeSong.volume = document.querySelector(".volume-range").value;
      document.querySelector(".volume-on").src = "Inventory/Icons/volume.svg";
    }
  });

  // ------------
  document.querySelector(".volume-range").addEventListener("input", () => {
    activeSong.volume = document.querySelector(".volume-range").value;
    document.querySelector(".volume-on").src = "Inventory/Icons/volume.svg";
  });

  // -----------
  activeSong.addEventListener("timeupdate", () => {
    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
    };

    document.querySelector(".song-time").innerHTML = `${formatTime(activeSong.currentTime)}/${formatTime(activeSong.duration)}`;
    document.querySelector(".circle").style.left = (activeSong.currentTime / activeSong.duration) * 100 + "%";
  });
}

main();
