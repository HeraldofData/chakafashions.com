// ========== Business settings: edit these in ONE place ==========
const CONFIG = {
  whatsapp: "263782109891",              // international format, no + or spaces
  phoneDisplay: "+263 78 210 9891",
  email: "info@chakafashions.com",
  waGreeting: "Hello Chaka Fashions, I would like a quote.",
};

// ========== Currencies (Southern Africa) ==========
// Fallback rates per 1 USD (19 Nov 2026). Live rates are loaded automatically when online.
const CURRENCIES = [
  { code: "USD", label: "🇺🇸 USD – US Dollar",               sym: "US$", rate: 1 },
  { code: "ZWG", label: "🇿🇼 ZiG – Zimbabwe Gold",            sym: "ZiG ", rate: 26.56 },
  { code: "ZAR", label: "🇿🇦 ZAR – South African Rand",       sym: "R ",  rate: 17.24 },
  { code: "BWP", label: "🇧🇼 BWP – Botswana Pula",            sym: "P ",  rate: 14.31 },
  { code: "NAD", label: "🇳🇦 NAD – Namibian Dollar",          sym: "N$ ", rate: 17.24 },
  { code: "ZMW", label: "🇿🇲 ZMW – Zambian Kwacha",           sym: "K ",  rate: 20.58 },
  { code: "MZN", label: "🇲🇿 MZN – Mozambican Metical",       sym: "MT ", rate: 63.73 },
  { code: "MWK", label: "🇲🇼 MWK – Malawian Kwacha",          sym: "MK ", rate: 1739.67 },
  { code: "LSL", label: "🇱🇸 LSL – Lesotho Loti",             sym: "M ",  rate: 17.24 },
  { code: "SZL", label: "🇸🇿 SZL – Eswatini Lilangeni",       sym: "E ",  rate: 17.24 },
];

// ---------- Contact links ----------
const waLink = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
document.querySelectorAll(".js-whatsapp").forEach(a => {
  a.href = waLink(a.dataset.waText || CONFIG.waGreeting);
  a.target = "_blank"; a.rel = "noopener";
});
document.querySelectorAll(".js-tel").forEach(a => a.href = `tel:+${CONFIG.whatsapp}`);
document.querySelectorAll(".js-phone-text").forEach(el => el.textContent = CONFIG.phoneDisplay);
document.querySelectorAll(".js-email").forEach(a => { a.href = `mailto:${CONFIG.email}`; a.textContent = CONFIG.email; });
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Mobile menu ----------
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");
if (toggle) toggle.addEventListener("click", () => toggle.setAttribute("aria-expanded", links.classList.toggle("open")));


// ---------- Currency switcher ----------
const selects = [document.getElementById("currency"), document.getElementById("currency2")];
let current = "USD";
try { current = localStorage.getItem("cw-currency") || "USD"; } catch (e) {}

selects.forEach(sel => {
  CURRENCIES.forEach(c => sel.add(new Option(c.label, c.code)));
  sel.addEventListener("change", () => setCurrency(sel.value));
});

function format(usd, c) {
  const v = usd * c.rate;
  const big = v >= 100;
  const rounded = big ? Math.round(v) : v;
  return c.sym + rounded.toLocaleString("en", { minimumFractionDigits: big ? 0 : 2, maximumFractionDigits: big ? 0 : 2 });
}

function setCurrency(code) {
  const c = CURRENCIES.find(x => x.code === code) || CURRENCIES[0];
  current = c.code;
  selects.forEach(s => s.value = c.code);
    document.querySelectorAll("[data-usd]").forEach(el => el.textContent = format(+el.dataset.usd, c));
  try { localStorage.setItem("cw-currency", c.code); } catch (e) {}
}
setCurrency(current);

// Live exchange rates (free, no key). Falls back silently to the rates above.
fetch("https://open.er-api.com/v6/latest/USD")
  .then(r => r.json())
  .then(d => {
    if (d.result !== "success") return;
    CURRENCIES.forEach(c => { if (d.rates[c.code]) c.rate = d.rates[c.code]; });
    setCurrency(current);
    const date = new Date(d.time_last_update_unix * 1000).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    document.getElementById("rateNote").textContent =
      `Rates updated ${date}. Local currency prices are a guide. Quotes are issued in USD or ZiG.`;
  })
  .catch(() => {});

// ---------- Quote form → WhatsApp ----------
document.getElementById("quoteForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(e.target));
  const msg =
`Quote request – Chaka Fashions website

Name: ${d.name}
Phone: ${d.phone}
School/Company: ${d.org || "-"}
Country: ${d.country}
Need: ${d.type}
Quantity: ${d.qty}
Currency: ${current}
Details: ${d.details || "-"}`;
  window.open(waLink(msg), "_blank", "noopener");
});
