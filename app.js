/* NOELLE デザイン確認用サンプル */
const COLORS = { BLK: "#201513", IVO: "#f3ece4", BEG: "#c8b29f", PNK: "#d9a9a4", NVY: "#253450", GRY: "#8e8784", BRN: "#6a4b3e" };
const PRODUCTS = [
  { id: "shirt-dress", name: "シャツ襟レイヤードワンピース", cat: "ONE PIECE", temp: "20℃", tone: "dark", group: "NEW", colors: ["BLK", "IVO"], sizes: "S M" },
  { id: "ribbon-knit-dress", name: "リボンニットワンピース", cat: "ONE PIECE", temp: "15℃", tone: "pale", group: "NEW", colors: ["BLK", "PNK", "IVO"], sizes: "FREE" },
  { id: "tweed-set", name: "ツイードショートセット", cat: "TOPS", temp: "15℃", tone: "deep", group: "NEW", colors: ["BLK", "BEG"], sizes: "S M" },
  { id: "chain-bag", name: "チェーンショルダーバッグ", cat: "GOODS", temp: "20℃", tone: "mid", group: "NEW", colors: ["BLK", "IVO"], sizes: "FREE" },
  { id: "fur-down", name: "ファーフードダウン", cat: "OUTER", temp: "5℃", tone: "dark", group: "COMING SOON", colors: ["BLK", "GRY"], sizes: "FREE" },
  { id: "wool-coat", name: "配色ウールコート", cat: "OUTER", temp: "10℃", tone: "pale", group: "NEW", colors: ["NVY", "BEG", "GRY"], sizes: "S M" },
  { id: "quilt-bag", name: "キルティングバッグ", cat: "GOODS", temp: "10℃", tone: "deep", group: "RE STOCK", colors: ["IVO", "BLK"], sizes: "FREE" },
  { id: "back-ribbon-knit", name: "バックリボンニット", cat: "TOPS", temp: "15℃", tone: "mid", group: "RE STOCK", colors: ["GRY", "PNK", "IVO"], sizes: "FREE" },
  { id: "lace-top", name: "レースリブトップス", cat: "TOPS", temp: "20℃", tone: "dark", group: "NEW", colors: ["BLK", "IVO"], sizes: "S M" },
  { id: "dot-dress", name: "ドットボウタイワンピース", cat: "ONE PIECE", temp: "20℃", tone: "pale", group: "RE STOCK", colors: ["BLK"], sizes: "S M" },
  { id: "double-set", name: "ダブルボタンセットアップ", cat: "TOPS", temp: "10℃", tone: "deep", group: "COMING SOON", colors: ["NVY", "BLK"], sizes: "S M L" },
  { id: "tweed-jacket", name: "ショートツイードジャケット", cat: "OUTER", temp: "15℃", tone: "mid", group: "COMING SOON", colors: ["BEG", "BLK"], sizes: "S M" },
  { id: "pleat-skirt", name: "プリーツミニスカート", cat: "BOTTOMS", temp: "15℃", tone: "dark", group: "RE STOCK", colors: ["BLK", "GRY"], sizes: "S M L" },
  { id: "short-pants", name: "ハイウエストショートパンツ", cat: "BOTTOMS", temp: "20℃", tone: "pale", group: "COMING SOON", colors: ["BLK", "BRN"], sizes: "S M" },
  { id: "fur-cardigan", name: "ファーカーディガン", cat: "TOPS", temp: "5℃", tone: "deep", group: "RE STOCK", colors: ["BLK", "PNK"], sizes: "FREE" },
  { id: "long-down", name: "ベルテッドロングダウン", cat: "OUTER", temp: "5℃", tone: "mid", group: "COMING SOON", colors: ["BRN", "BLK"], sizes: "FREE" }
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const link = (product) => `product.html?id=${product.id}`;

function card(product) {
  const swatches = product.colors.map((key) => `<i style="background:${COLORS[key]}"></i>`).join("");
  return `<article class="card">
    <a class="card-link" href="${link(product)}">
      <div class="photo ${product.tone}">[写真]<span class="tag">${product.group}</span></div>
      <div class="colors" aria-hidden="true">${swatches}</div>
      <div class="name">${product.name}</div>
      <div class="price">[価格]</div>
    </a>
    <button class="quick" type="button" data-quick aria-label="${product.name}をカートに追加"><span>+</span></button>
  </article>`;
}

function rankCard(product, index) {
  return `<a class="rank-card" href="${link(product)}">
    <div class="photo ${product.tone}">[写真]<span class="rank-no">NO.${index + 1}</span></div>
    <div class="name">${product.name}</div>
    <div class="price">[価格]</div>
  </a>`;
}

function newInCard(product) {
  const codes = product.colors.map((key) => `<span>${key}</span>`).join("");
  const sizes = product.sizes.split(" ").map((size) => `<span>${size}</span>`).join("");
  return `<a class="newin-card" href="${link(product)}">
    <div class="photo ${product.tone}">[着用写真]</div>
    <div class="name">${product.name}</div>
    <div class="price">[価格]</div>
    <div class="codes">${codes}${sizes}</div>
  </a>`;
}

function placeQuickButtons() {
  $$(".card").forEach((item) => {
    const photo = $(".photo", item);
    const quick = $(".quick", item);
    if (photo && quick) quick.style.top = `${photo.offsetHeight - 38}px`;
  });
}

function setupTabs(group, grid, source, key, limit, render) {
  if (!group || !grid) return;
  const show = (value) => {
    const items = (value === "ALL" ? source : source.filter((product) => product[key] === value)).slice(0, limit);
    grid.innerHTML = items.map(render).join("");
    placeQuickButtons();
    $$(".tab", group).forEach((tab) => tab.setAttribute("aria-pressed", String(tab.dataset.value === value)));
  };
  group.addEventListener("click", (event) => {
    const tab = event.target.closest(".tab");
    if (tab) show(tab.dataset.value);
  });
  show($(".tab", group).dataset.value);
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
  $$(".drawer a").forEach((item) => item.addEventListener("click", () => toggle(false)));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") toggle(false); });
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-quick]")) toast("サンプルのため、実際の注文はできません。");
    if (event.target.closest("[data-sample]")) {
      event.preventDefault();
      toast("このページはサンプルです。");
    }
  });
  window.addEventListener("resize", placeQuickButtons);
}

function setupSlider() {
  const slider = $(".slider");
  if (!slider) return;
  const slides = $$(".slide", slider);
  const dots = $$(".dot");
  const mark = (active) => dots.forEach((dot, index) => dot.setAttribute("aria-pressed", String(index === active)));
  const current = () => {
    const center = slider.scrollLeft + slider.clientWidth / 2;
    const distance = (slide) => Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center);
    return slides.reduce((best, slide, index) => (distance(slide) < distance(slides[best]) ? index : best), 0);
  };
  slider.addEventListener("scroll", () => mark(current()), { passive: true });
  dots.forEach((dot, index) => dot.addEventListener("click", () => {
    const slide = slides[index];
    slider.scrollTo({ left: slide.offsetLeft - (slider.clientWidth - slide.offsetWidth) / 2 });
    mark(index);
  }));
  mark(0);
}

function readRecent() {
  try {
    return JSON.parse(localStorage.getItem("melribbon-recent") || "[]");
  } catch {
    return [];
  }
}

function saveRecent(id) {
  try {
    const list = [id, ...readRecent().filter((item) => item !== id)].slice(0, 6);
    localStorage.setItem("melribbon-recent", JSON.stringify(list));
  } catch {
    /* 保存できない環境では何もしない */
  }
}

function setupRecent() {
  const box = $("#recent");
  if (!box) return;
  const items = readRecent().map((id) => PRODUCTS.find((product) => product.id === id)).filter(Boolean);
  if (!items.length) return;
  box.className = "scroll";
  box.innerHTML = items.map((product) => `<a class="rank-card" href="${link(product)}"><div class="photo ${product.tone}">[写真]</div><div class="name" style="margin-top:10px">${product.name}</div></a>`).join("");
}

function setupHome() {
  setupSlider();
  setupTabs($("#new-tabs"), $("#new-grid"), PRODUCTS, "group", 8, card);
  setupTabs($("#temp-tabs"), $("#temp-grid"), PRODUCTS, "temp", 4, card);
  setupTabs($("#rank-tabs"), $("#rank-list"), PRODUCTS, "cat", 6, rankCard);
  $("#newin-list").innerHTML = PRODUCTS.slice(0, 8).map(newInCard).join("");
  $$("[data-cat]").forEach((item) => item.addEventListener("click", () => {
    $(`#rank-tabs .tab[data-value="${item.dataset.cat}"]`)?.click();
  }));
  setupRecent();
}

function setupProduct() {
  const params = new URLSearchParams(location.search);
  const product = PRODUCTS.find((item) => item.id === params.get("id")) || PRODUCTS[1];
  saveRecent(product.id);
  document.title = `${product.name} | NOELLE`;
  $("#crumb-name").textContent = product.name;
  $("#item-name").textContent = product.name;
  $("#item-tag").textContent = `${product.temp}の日に`;
  $("#item-color").textContent = product.colors.join(" / ");
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
  const opts = $(".opts");
  opts.innerHTML = product.sizes.split(" ").map((size, index) => `<button class="size" type="button" aria-pressed="${index === 0}">${size}</button>`).join("");
  opts.addEventListener("click", (event) => {
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
  $("#more-grid").innerHTML = PRODUCTS.filter((item) => item.id !== product.id).slice(0, 4).map(card).join("");
  placeQuickButtons();
}

setupCommon();
if ($("#new-grid")) setupHome();
if ($("#item-name")) setupProduct();
document.fonts?.ready.then(placeQuickButtons);
