const feed = document.getElementById("feed");
const modal = document.getElementById("modal");

let videos = JSON.parse(localStorage.getItem("videos")) || [];

function openUpload() {
  modal.style.display = "flex";
}

function save() {
  localStorage.setItem("videos", JSON.stringify(videos));
}

function publish() {
  const title = document.getElementById("title").value;
  const file = document.getElementById("file").files[0];
  const type = document.getElementById("type").value;

  if (!title || !file) {
    alert("Add title and video");
    return;
  }

  const url = URL.createObjectURL(file);

  videos.unshift({
    title,
    url,
    type,
    views: 0,
    likes: 0,
    comments: []
  });

  save();
  modal.style.display = "none";
  render();
}

function like(i) {
  videos[i].likes++;
  save();
  render();
}

function view(i) {
  if (!videos[i].viewed) {
    videos[i].views++;
    videos[i].viewed = true;
    save();
  }
}

function comment(i, input) {
  if (!input.value) return;
  videos[i].comments.push(input.value);
  input.value = "";
  save();
  render();
}

function render() {
  feed.innerHTML = "";

  videos.forEach((v, i) => {
    const div = document.createElement("div");
    div.className = "video " + (v.type === "short" ? "short" : "");

    div.innerHTML = `
      <video controls onplay="view(${i})">
        <source src="${v.url}">
      </video>
      <div class="info">
        <h3>${v.title}</h3>
        <div class="stats">
          <span>👁 ${v.views}</span>
          <button onclick="like(${i})">👍 ${v.likes}</button>
        </div>

        <div class="comment-box">
          <input placeholder="Add comment" 
                 onkeydown="if(event.key==='Enter') comment(${i}, this)">
          ${v.comments.map(c => `<div class="comment">${c}</div>`).join("")}
        </div>
      </div>
    `;

    feed.appendChild(div);
  });
}

render();
