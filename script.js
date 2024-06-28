console.log("Welcome to Spotify Clone!");

let activeSongInfo;
let activeSong = new Audio();

// Fetches the list of songs from the server.
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

// Plays the selected music track.
function playMusic(track) {
  activeSong.src = "/Inventory/Songs/" + track + ".mp3";
  document.querySelectorAll(".play").forEach((element) => {
    element.src = "Inventory/Icons/play.svg";
  });
  document.querySelector(".play-pause").src = "Inventory/Icons/pause.svg";
  document.querySelector(".song-name").innerHTML =
    track + " - Sidhu Moose Wala";

  activeSongInfo.querySelector(".play").src = "Inventory/Icons/pause.svg";
  activeSong.play();
}

// Main function to initialize the music player.
async function main() {
  songs = await getSongs();
  // playMusic(songs[0], true);

  let element = document.querySelector(".songs-list");
  for (const song of songs) {
    element.innerHTML += `
      <li class="song">
        <img src="Inventory/Icons/music.svg" alt="">
        <span class="song-info">
          <div class="song-title">${song}</div>
          <span>Sidhu Moose Wala</span>
        </span>
        <span class="play-now">Play Now</span>
        <img class="play" src="Inventory/Icons/play.svg" alt="">
      </li>`;
  }

  // Add event listener to play button of each song
  Array.from(document.querySelectorAll(".song")).forEach((e) => {
    e.addEventListener("click", () => {
      activeSongInfo = e;
      console.log(activeSongInfo);
      playMusic(activeSongInfo.querySelector(".song-title").innerHTML);
    });
  });

  // Add event listener to play-pause button
  document.querySelector(".play-pause").addEventListener("click", () => {
    console.log("play-pause clicked");
    if (activeSong.paused) {
      activeSong.play();
      document.querySelector(".play-pause").src = "Inventory/Icons/pause.svg";
      activeSongInfo.querySelector(".play").src = "Inventory/Icons/pause.svg";
    } else {
      activeSong.pause();
      document.querySelector(".play-pause").src = "Inventory/Icons/play.svg";
      activeSongInfo.querySelector(".play").src = "Inventory/Icons/play.svg";
    }
  });

  // Add event listener to volume button
  document.querySelector(".volume-on").addEventListener("click", () => {
    if (activeSong.volume != 0) {
      activeSong.volume = 0;
      document.querySelector(".volume-on").src = "Inventory/Icons/mute.svg";
    } else {
      activeSong.volume = document.querySelector(".volume-range").value;
      document.querySelector(".volume-on").src = "Inventory/Icons/volume.svg";
    }
  });

  // Add event listener to volume range slider
  document.querySelector(".volume-range").addEventListener("input", () => {
    activeSong.volume = document.querySelector(".volume-range").value;
    if (activeSong.volume == 0) {
      document.querySelector(".volume-on").src = "Inventory/Icons/mute.svg";
    } else {
      document.querySelector(".volume-on").src = "Inventory/Icons/volume.svg";
    }
  });

  // Update song progress and time display
  activeSong.addEventListener("timeupdate", () => {
    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}:${
        remainingSeconds < 10 ? "0" : ""
      }${remainingSeconds}`;
    };

    document.querySelector(".song-time").innerHTML = `${formatTime(
      activeSong.currentTime
    )}/${formatTime(activeSong.duration)}`;
    document.querySelector(".circle").style.left =
      (activeSong.currentTime / activeSong.duration) * 100 + "%";
  });
}

// Initialize the music player
main();
