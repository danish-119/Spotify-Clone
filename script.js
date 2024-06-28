console.log("Welcome to Spotify Clone!");

// ---------------------------------------------------------------------------------
async function getSongs() {
  let a = await fetch("http://127.0.0.1:3000/Inventory/Songs/");
  let response = await a.text();
  // console.log(response);

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  // console.log(as);

  let songs = [];
  for (let i = 0; i < as.length; i++) {
    if (as[i].href.endsWith(".mp3")) {
      songs.push(
        as[i].href.split("Songs/")[1].replaceAll("%20", " ").split(".mp3")[0]
      );
    }
  }
  // console.log(songs);

  return songs;
}

// const play = function playSong(){
//   let song = document.querySelector(".song").innerHTML;
//   console.log(song);
// }

// -------------------------------------------------------------------------------------
async function main() {
  let songs = await getSongs();
  console.log(songs);

  let element = document.querySelector(".songs-list");
  for (const song of songs) {
    element.innerHTML = element.innerHTML + `           <li class="song">
                    <img src="Inventory/Icons/music.svg" alt="">
                    <span class="song-info">
                        <div class="song-title">${song}</div>
                        <span>Sidhu Moose Wala</span>
                    </span>
                    <span class="play-now">Play Now</span>
                    <img class="play" src="Inventory/Icons/play.svg" alt="">
                </li>`;
  }
  // var audio = new Audio(songs[2]);
  // audio.play();
}

main();
