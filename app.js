/* MEL RIBBON デザイン確認用サンプル */
const COLORS = { black: "#201513", ivory: "#f3ece4", beige: "#c8b29f", pink: "#d9a9a4", navy: "#253450", gray: "#8e8784", brown: "#6a4b3e" };
const PRODUCTS = [
  { id: "shirt-dress", name: "シャツ襟レイヤードワンピース", cat: "ONE PIECE", temp: "20℃", tone: "dark", group: "NEW", colors: ["black", "ivory"] },
  { id: "ribbon-knit-dress", name: "リボンニットワンピース", cat: "ONE PIECE", temp: "15℃", tone: "pale", group: "NEW", colors: ["black", "pink", "ivory"] },
  { id: "tweed-set", name: "ツイードショートセット", cat: "TOPS", temp: "15℃", tone: "deep", group: "NEW", colors: ["black", "beige"] },
  { id: "chain-bag", name: "チェーンショルダーバッグ", cat: "GOODS", temp: "20℃", tone: "mid", group: "NEW", colors: ["black", "ivory"] },
  { id: "fur-down", name: "ファーフードダウン", cat: "OUTER", temp: "5℃", tone: "dark", group: "COMING SOON", colors: ["black", "gray"] },
  { id: "wool-coat", name: "配色ウールコート", cat: "OUTER", temp: "10℃", tone: "pale", group: "NEW", colors: ["navy", "beige", "gray"] },
  { id: "quilt-bag", name: "キルティングバッグ", cat: "GOODS", temp: "10℃", tone: "deep", group: "RE STOCK", colors: ["ivory", "black"] },
  { id: "back-ribbon-knit", name: "バックリボンニット", cat: "TOPS", temp: "15℃", tone: "mid", group: "RE STOCK", colors: ["gray", "pink", "ivory"] },
  { id: "lace-top", name: "レースリブトップス", cat: "TOPS", temp: "20℃", tone: "dark", group: "NEW", colors: ["black", "ivory"] },
  { id: "dot-dress", name: "ドットボウタイワンピース", cat: "ONE PIECE", temp: "20℃", tone: "pale", group: "RE STOCK", colors: ["black"] },
  { id: "double-set", name: "ダブルボタンセットアップ", cat: "TOPS", temp: "10℃", tone: "deep", group: "COMING SOON", colors: ["navy", "black"] },
  { id: "tweed-jacket", name: "ショートツイードジャケット", cat: "OUTER", temp: "15℃", tone: "mid", group: "COMING SOON", colors: ["beige", "black"] },
  { id: "pleat-skirt", name: "プリーツミニスカート", cat: "BOTTOMS", temp: "15℃", tone: "dark", group: "RE STOCK", colors: ["black", "gray"] },
  { id: "short-pants", name: "ハイウエストショートパンツ", cat: "BOTTOMS", temp: "20℃", tone: "pale", group: "COMING SOON", colors: ["black", "brown"] },
  { id: "fur-cardigan", name: "ファーカーディガン", cat: "TOPS", temp: "5℃", tone: "deep", group: "RE STOCK", colors: ["black", "pink"] },
  { id: "long-down", name: "ベルテッドロングダウン", cat: "OUTER", temp: "5℃", tone: "mid", group: "COMING SOON", colors: ["brown", "black"] }
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function card(product, options = {}) {
  const swatches = product.colors.map((key) => `<i style="background:${COLORS[key]}"></i>`).join("");
  const mark = options.rank
    ? `<span class="rank-no">No.${options.rank}</span>`
    : `<span class="tag">${product.group === "NEW" ? "NEW" : product.group}</span>`;
  return `<article class="card">
    <a class="card-link" href="product.html?id=${product.id}">
      <div class="photo ${product.tone}">[写真]${mark}</div>
      <div class="colors" aria-hidden="true">${swatches}</div>
      <div class="name">${product.name}</div>
      <div class="price">[価格]</div>
    </a>
    <button class="quick" type="button" data-quick aria-label="${product.name}をカートに追加"><span>+</span></button>
  </article>`;
}

function placeQuickButtons() {
  $$(".card").forEach((item) => {
    const photo = $(".photo", item);
    const quick = $(".quick", item);
    if (photo && quick) quick.style.top = `${photo.offsetHeight - 40}px`;
  });
}

function fill(target, products, options = {}) {
  if (!target) return;
  target.innerHTML = products.length
    ? products.map((product, index) => card(product, { rank: options.ranked ? index + 1 : 0 })).join("")
    : '<p class="empty">該当するアイテムはまだありません。</p>';
  placeQuickButtons();
}

function setupTabs(group, grid, source, key, limit, ranked) {
  if (!group || !grid) return;
  const show = (value) => {
    const items = value === "ALL" ? source : source.filter((product) => product[key] === value);
    fill(grid, items.slice(0, limit), { ranked });
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
  $$(".drawer a").forEach((link) => link.addEventListener("click", () => toggle(false)));
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
    let best = 0;
    slides.forEach((slide, index) => {
      const distance = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center);
      const bestDistance = Math.abs(slides[best].offsetLeft + slides[best].offsetWidth / 2 - center);
      if (distance < bestDistance) best = index;
    });
    return best;
  };
  slider.addEventListener("scroll", () => mark(current()), { passive: true });
  dots.forEach((dot, index) => dot.addEventListener("click", () => {
    const slide = slides[index];
    slider.scrollTo({ left: slide.offsetLeft - (slider.clientWidth - slide.offsetWidth) / 2 });
    mark(index);
  }));
  mark(0);
}

function setupHome() {
  setupSlider();
  setupTabs($("#new-tabs"), $("#new-grid"), PRODUCTS, "group", 8, false);
  setupTabs($("#temp-tabs"), $("#temp-grid"), PRODUCTS, "temp", 4, false);
  setupTabs($("#rank-tabs"), $("#rank-grid"), PRODUCTS, "cat", 4, true);
  $$("[data-cat]").forEach((link) => link.addEventListener("click", () => {
    $(`#rank-tabs .tab[data-value="${link.dataset.cat}"]`)?.click();
  }));
}

function setupProduct() {
  const params = new URLSearchParams(location.search);
  const product = PRODUCTS.find((item) => item.id === params.get("id")) || PRODUCTS[1];
  document.title = `${product.name} | MEL RIBBON`;
  $("#crumb-name").textContent = product.name;
  $("#item-name").textContent = product.name;
  $("#item-tag").textContent = `${product.temp}の日に`;
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
  fill($("#more-grid"), PRODUCTS.filter((item) => item.id !== product.id).slice(0, 4));
}

setupCommon();
if ($("#new-grid")) setupHome();
if ($("#item-name")) setupProduct();
document.fonts?.ready.then(placeQuickButtons);
