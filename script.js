console.log("Welcome to Spotify Clone!");

let playlists = [];
let songs = [];
let activePlaylist;
let activeSongInfo;
let activeSong = new Audio();
let activeSongIndex;

// Fetches the list of playlists from the server.
async function getPlaylists() {
  let response = await fetch("http://127.0.0.1:5500/Inventory/Songs/");
  let text = await response.text();

  let div = document.createElement("div");
  div.innerHTML = text;
  let links = div.getElementsByTagName("a");

  let playlists = [];
  for (let i = 0; i < links.length; i++) {
    let parts = links[i].href.split("Songs/");
    if (parts.length > 1) {
      playlists.push(parts[1].replace(/%20/g, " "));
    }
  }

  return playlists;
}

// Fetches the list of songs from the server.
async function getSongs(playlist) {
  let response = await fetch(
    `http://127.0.0.1:5500/Inventory/Songs/${encodeURIComponent(playlist)}`
  );
  let text = await response.text();

  let div = document.createElement("div");
  div.innerHTML = text;
  let links = div.getElementsByTagName("a");

  let songsList = [];
  for (let i = 0; i < links.length; i++) {
    if (links[i].href.endsWith(".mp3")) {
      let parts = links[i].href.split(`Songs/${encodeURIComponent(playlist)}/`);
      if (parts.length > 1) {
        songsList.push(parts[1].replace(/%20/g, " ").split(".mp3")[0]);
      }
    }
  }

  return songsList;
}

// Plays the selected music track.
function playMusic(track, playlist, autoplay = true) {
  activeSong.src = `/Inventory/Songs/${encodeURIComponent(
    playlist
  )}/${encodeURIComponent(track)}.mp3`;

  document.querySelectorAll(".play").forEach((element) => {
    element.src = "Inventory/Icons/play.svg";
  });

  document.querySelector(".song-name").innerHTML = `${track} - ${playlist}`;
  if (autoplay) {
    document.querySelector(".play-pause").src = "Inventory/Icons/pause.svg";

    if (activeSongInfo) {
      activeSongInfo.querySelector(".play").src = "Inventory/Icons/pause.svg";
    }
    activeSong.play();
  }
}

// Main function to initialize the music player.
async function main() {
  playlists = await getPlaylists();
  if (playlists.length === 0) {
    console.error("No playlists found.");
    return;
  }

  songs = await getSongs(playlists[0]);
  activeSongIndex = 0;

  let playlistElement = document.querySelector(".playlists");
  playlists.forEach((playlist) => {
    playlistElement.innerHTML += `             
    <div class="playlist">
            <div class="play-playlist">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                        stroke-linejoin="round" />
                </svg>
            </div>
            <img src="Inventory/Songs/${encodeURIComponent(
              playlist
            )}/cover.jpg" class="playlist-cover">
            <div class="playlist-info">
                <span class="playlist-title">${playlist}</span>
                <span class="playlist-description">Rise Above Hate</span>
            </div>
    </div>`;
  });

  updateSongList();

  // Add event listener to play each playlist
  document.querySelectorAll(".playlist").forEach((e) => {
    e.addEventListener("click", async () => {
      activePlaylist = e;
      songs = await getSongs(
        activePlaylist.querySelector(".playlist-title").innerHTML
      );
      activeSongIndex = 0;
      updateSongList();
    });
  });

  // Add event listener to play-playlist button
  document.querySelectorAll(".play-playlist").forEach((e) => {
    e.addEventListener("click", async (event) => {
      event.stopPropagation();
      let playlistElement = e.closest(".playlist");
      activePlaylist = playlistElement;
      let playlistTitle =
        playlistElement.querySelector(".playlist-title").innerHTML;
      songs = await getSongs(playlistTitle);
      activeSongIndex = 0;
      updateSongList();
      activeSongInfo = document.querySelectorAll(".song")[activeSongIndex];
      playMusic(songs[activeSongIndex], playlistTitle);
    });
  });

  // Add event listener to play-pause button
  document.querySelector(".play-pause").addEventListener("click", () => {
    if (activeSong.paused) {
      activeSong.play();
      document.querySelector(".play-pause").src = "Inventory/Icons/pause.svg";
      if (activeSongInfo) {
        activeSongInfo.querySelector(".play").src = "Inventory/Icons/pause.svg";
      }
    } else {
      activeSong.pause();
      document.querySelector(".play-pause").src = "Inventory/Icons/play.svg";
      if (activeSongInfo) {
        activeSongInfo.querySelector(".play").src = "Inventory/Icons/play.svg";
      }
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
      if (isNaN(seconds) || seconds < 0) {
        return "00:00";
      }
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

  // Add event listener to seek-bar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    activeSong.currentTime = (activeSong.duration * percent) / 100;
  });

  // Add event listener to next button
  document.querySelector(".next").addEventListener("click", () => {
    if (activeSongIndex < songs.length - 1) {
      activeSongIndex++;
      activeSongInfo = document.querySelectorAll(".song")[activeSongIndex];
      playMusic(
        songs[activeSongIndex],
        activePlaylist.querySelector(".playlist-title").innerHTML
      );
    }
  });

  // Add event listener to previous button
  document.querySelector(".previous").addEventListener("click", () => {
    if (activeSongIndex > 0) {
      activeSongIndex--;
      activeSongInfo = document.querySelectorAll(".song")[activeSongIndex];
      playMusic(
        songs[activeSongIndex],
        activePlaylist.querySelector(".playlist-title").innerHTML
      );
    }
  });

  activeSong.addEventListener("timeupdate", () => {
    if (activeSong.currentTime == activeSong.duration) {
      if (activeSongIndex < songs.length - 1) {
        activeSongIndex++;
        activeSongInfo = document.querySelectorAll(".song")[activeSongIndex];
        playMusic(
          songs[activeSongIndex],
          activePlaylist.querySelector(".playlist-title").innerHTML
        );
      }
    }
  });

  // Set initial volume
  activeSong.volume = document.querySelector(".volume-range").value;

  // Play the first song of the first playlist on page load
  activePlaylist = document.querySelectorAll(".playlist")[0];
  activeSongInfo = document.querySelectorAll(".song")[0];
  playMusic(songs[0], playlists[0], false);
}

function updateSongList() {
  const songElement = document.querySelector(".songs-list");
  songElement.innerHTML = "";
  for (const song of songs) {
    songElement.innerHTML += `
      <li class="song">
        <img src="Inventory/Icons/music.svg" alt="">
        <span class="song-info">
          <div class="song-title">${song}</div>
          <span>${
            activePlaylist
              ? activePlaylist.querySelector(".playlist-title").innerHTML
              : playlists[0]
          }</span>
        </span>
        <span class="play-now">Play Now</span>
        <img class="play" src="Inventory/Icons/play.svg" alt="">
      </li>`;
  }

  // Add event listener to play each song
  document.querySelectorAll(".song").forEach((e, index) => {
    e.addEventListener("click", () => {
      activeSongInfo = e;
      activeSongIndex = index;
      playMusic(
        songs[activeSongIndex],
        activePlaylist.querySelector(".playlist-title").innerHTML
      );
    });
  });
}

// Initialize the music player
main();
