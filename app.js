/* MEL RIBBON デザイン確認用サンプル */
const PRODUCTS = [
  { id: "shirt-dress", name: "シャツ襟レイヤードワンピース", cat: "ワンピース", temp: "20℃", tone: "dark" },
  { id: "ribbon-knit-dress", name: "リボンニットワンピース", cat: "ワンピース", temp: "15℃", tone: "pale" },
  { id: "tweed-set", name: "ツイードショートセット", cat: "セットアップ", temp: "15℃", tone: "mid" },
  { id: "chain-bag", name: "チェーンショルダーバッグ", cat: "バッグ", temp: "20℃", tone: "dark" },
  { id: "fur-down", name: "ファーフードダウン", cat: "アウター", temp: "5℃", tone: "pale" },
  { id: "wool-coat", name: "配色ウールコート", cat: "アウター", temp: "10℃", tone: "mid" },
  { id: "quilt-bag", name: "キルティングバッグ", cat: "バッグ", temp: "10℃", tone: "dark" },
  { id: "back-ribbon-knit", name: "バックリボンニット", cat: "トップス", temp: "15℃", tone: "pale" },
  { id: "lace-top", name: "レースリブトップス", cat: "トップス", temp: "20℃", tone: "mid" },
  { id: "dot-dress", name: "ドットボウタイワンピース", cat: "ワンピース", temp: "20℃", tone: "pale" },
  { id: "double-set", name: "ダブルボタンセットアップ", cat: "セットアップ", temp: "10℃", tone: "dark" },
  { id: "tweed-jacket", name: "ショートツイードジャケット", cat: "アウター", temp: "15℃", tone: "mid" },
  { id: "rib-set", name: "リブニットセット", cat: "セットアップ", temp: "10℃", tone: "mid" },
  { id: "pleat-skirt", name: "プリーツミニスカート", cat: "ボトムス", temp: "15℃", tone: "pale" },
  { id: "fur-cardigan", name: "ファーカーディガン", cat: "トップス", temp: "5℃", tone: "dark" },
  { id: "short-pants", name: "ハイウエストショートパンツ", cat: "ボトムス", temp: "20℃", tone: "dark" },
  { id: "dot-cardigan", name: "ドットリボンカーディガン", cat: "トップス", temp: "10℃", tone: "pale" },
  { id: "long-down", name: "ベルテッドロングダウン", cat: "アウター", temp: "5℃", tone: "mid" }
];

const HEART = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 20.5 3.5 12a5.2 5.2 0 0 1 7.4-7.4L12 5.7l1.1-1.1a5.2 5.2 0 0 1 7.4 7.4L12 20.5Z"/></svg>';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function card(product, rank) {
  const badge = rank ? `<span class="badge${rank < 4 ? ` b${rank}` : ""}">${rank}</span>` : "";
  return `<article class="card">
    <a class="card-link" href="product.html?id=${product.id}">
      <div class="photo ${product.tone}">[写真]${badge}</div>
      <div class="model">[モデル名]</div>
      <div class="name">${product.name}</div>
      <div class="price">[価格]</div>
    </a>
    <button class="heart" type="button" aria-label="${product.name}をお気に入りに追加" aria-pressed="false">${HEART}</button>
  </article>`;
}

function positionHearts() {
  $$(".card").forEach((item) => {
    const photo = $(".photo", item);
    const heart = $(".heart", item);
    if (photo && heart) heart.style.top = `${photo.offsetHeight - 44}px`;
  });
}

function fill(target, products, ranked) {
  if (!target) return;
  target.innerHTML = products.map((product, index) => card(product, ranked ? index + 1 : 0)).join("");
  positionHearts();
}

function setupTabs(tabGroup, grid, source, keyName) {
  if (!tabGroup || !grid) return;
  const show = (value) => {
    const items = value === "全て" ? source : source.filter((product) => product[keyName] === value);
    fill(grid, items.slice(0, 6));
    $$(".tab", tabGroup).forEach((tab) => tab.setAttribute("aria-pressed", String(tab.dataset.value === value)));
  };
  tabGroup.addEventListener("click", (event) => {
    const tab = event.target.closest(".tab");
    if (tab) show(tab.dataset.value);
  });
  show($(".tab", tabGroup).dataset.value);
}

let toastTimer;
function toast(message) {
  let box = $(".toast");
  if (!box) {
    box = document.createElement("div");
    box.className = "toast";
    box.setAttribute("role", "status");
    document.body.appendChild(box);
  }
  box.textContent = message;
  box.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { box.hidden = true; }, 2600);
}

function setupCommon() {
  const back = $(".drawer-back");
  const drawer = $(".drawer");
  const toggle = (open) => {
    if (!drawer || !back) return;
    drawer.hidden = !open;
    back.hidden = !open;
  };
  $("#menu-open")?.addEventListener("click", () => toggle(true));
  $("#menu-close")?.addEventListener("click", () => toggle(false));
  back?.addEventListener("click", () => toggle(false));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") toggle(false); });
  document.addEventListener("click", (event) => {
    const heart = event.target.closest(".heart");
    if (heart) heart.setAttribute("aria-pressed", String(heart.getAttribute("aria-pressed") !== "true"));
    if (event.target.closest("[data-sample]")) {
      event.preventDefault();
      toast("このページはサンプルです。");
    }
  });
  window.addEventListener("resize", positionHearts);
}

function setupHome() {
  fill($("#rank-grid"), PRODUCTS.slice(0, 9), true);
  setupTabs($("#new-tabs"), $("#new-grid"), PRODUCTS.slice(9).concat(PRODUCTS.slice(0, 9)), "cat");
  setupTabs($("#temp-tabs"), $("#temp-grid"), PRODUCTS, "temp");
  $$("[data-cat]").forEach((link) => link.addEventListener("click", () => {
    $(`#new-tabs .tab[data-value="${link.dataset.cat}"]`)?.click();
  }));
}

function setupProduct() {
  const params = new URLSearchParams(location.search);
  const product = PRODUCTS.find((item) => item.id === params.get("id")) || PRODUCTS[1];
  document.title = `${product.name} | MEL RIBBON`;
  $("#crumb-name").textContent = product.name;
  $("#item-name").textContent = product.name;
  $("#item-tag").textContent = `#${product.temp}の日に`;
  const main = $("#main-photo");
  const setTone = (tone) => { main.className = `main ${tone}`; };
  setTone(product.tone);
  const firstThumb = $(`.thumb[data-tone="${product.tone}"]`);
  $$(".thumb").forEach((item) => item.setAttribute("aria-pressed", String(item === firstThumb)));
  $(".thumbs").addEventListener("click", (event) => {
    const thumb = event.target.closest(".thumb");
    if (!thumb) return;
    setTone(thumb.dataset.tone);
    $$(".thumb").forEach((item) => item.setAttribute("aria-pressed", String(item === thumb)));
  });
  $(".opts").addEventListener("click", (event) => {
    const size = event.target.closest(".size");
    if (!size) return;
    $$(".size").forEach((item) => item.setAttribute("aria-pressed", String(item === size)));
  });
  let cartCount = 0;
  $(".cart-btn").addEventListener("click", () => {
    cartCount += 1;
    const count = $(".count");
    count.textContent = String(cartCount);
    count.hidden = false;
    toast("サンプルのため、実際の注文はできません。");
  });
  fill($("#more-grid"), PRODUCTS.filter((item) => item.id !== product.id).slice(0, 6));
}

setupCommon();
if ($("#rank-grid")) setupHome();
if ($("#item-name")) setupProduct();
document.fonts?.ready.then(positionHearts);
