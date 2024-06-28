console.log("Welcome to Spotify Clone!");

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
      songs.push(as[i].href);
    }
  }
  console.log(songs);

  return songs;
}

getSongs();
