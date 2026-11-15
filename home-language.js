(() => {
  "use strict";

const keys = [
  "language", "welcome", "season", "seasonNote", "tips", "tipsNote",
  "calculators", "calculatorsNote", "planner", "plannerNote", "footer", "top", "skip"
];

const translations = {
  en: ["Language", "Season updates, game tips, and battle planning for GIR members.", "Season", "Season 8: Dinosaur Era", "Tips", "Alliance and gameplay tips", "Calculators", "Plan resources and upgrades", "Planner", "Black Gold Battlefield roster and map", "Unofficial Dark War: Survival community guide", "Back to top", "Skip to content"],
  es: ["Idioma", "Novedades de temporada, consejos y planificación de batallas para GIR.", "Temporada", "Temporada 8: Era de los dinosaurios", "Consejos", "Consejos para la alianza y el juego", "Calculadoras", "Planifica recursos y mejoras", "Planificador", "Lista de jugadores y mapa de Black Gold Battlefield", "Guía comunitaria no oficial de Dark War: Survival", "Volver arriba", "Ir al contenido"],
  pt: ["Idioma", "Novidades da temporada, dicas e planejamento de batalhas para a GIR.", "Temporada", "Temporada 8: Era dos dinossauros", "Dicas", "Dicas para a aliança e para o jogo", "Calculadoras", "Planeje recursos e melhorias", "Planejador", "Lista de jogadores e mapa de Black Gold Battlefield", "Guia comunitário não oficial de Dark War: Survival", "Voltar ao topo", "Ir para o conteúdo"],
  fr: ["Langue", "Infos de saison, astuces et préparation des combats pour les membres de GIR.", "Saison", "Saison 8 : Ère des dinosaures", "Astuces", "Conseils pour l’alliance et le jeu", "Calculateurs", "Planifiez vos ressources et améliorations", "Planificateur", "Liste des joueurs et carte de Black Gold Battlefield", "Guide communautaire non officiel de Dark War: Survival", "Retour en haut", "Aller au contenu"],
  de: ["Sprache", "Saisoninfos, Spieltipps und Schlachtplanung für GIR-Mitglieder.", "Saison", "Saison 8: Zeitalter der Dinosaurier", "Tipps", "Tipps für Allianz und Spiel", "Rechner", "Ressourcen und Upgrades planen", "Planer", "Spielerliste und Karte für Black Gold Battlefield", "Inoffizieller Community-Guide zu Dark War: Survival", "Nach oben", "Zum Inhalt"],
  ru: ["Язык", "Новости сезона, игровые советы и планы сражений для участников GIR.", "Сезон", "Сезон 8: Эра динозавров", "Советы", "Советы по игре и альянсу", "Калькуляторы", "Расчёт ресурсов и улучшений", "Планировщик", "Состав команды и карта Black Gold Battlefield", "Неофициальный гайд сообщества Dark War: Survival", "Наверх", "К содержанию"],
  ar: ["اللغة", "أخبار الموسم ونصائح اللعب وخطط المعارك لأعضاء GIR.", "الموسم", "الموسم الثامن: عصر الديناصورات", "نصائح", "نصائح للتحالف واللعب", "الحاسبات", "خطط للموارد والترقيات", "المخطط", "قائمة اللاعبين وخريطة Black Gold Battlefield", "دليل غير رسمي من مجتمع Dark War: Survival", "العودة إلى الأعلى", "انتقل إلى المحتوى"],
  id: ["Bahasa", "Kabar musim, tips bermain, dan rencana pertempuran untuk anggota GIR.", "Musim", "Musim 8: Era Dinosaurus", "Tips", "Tips aliansi dan permainan", "Kalkulator", "Rencanakan sumber daya dan peningkatan", "Perencana", "Daftar pemain dan peta Black Gold Battlefield", "Panduan komunitas tidak resmi Dark War: Survival", "Kembali ke atas", "Langsung ke konten"],
  ko: ["언어", "GIR 멤버를 위한 시즌 소식, 게임 팁, 전투 계획입니다.", "시즌", "시즌 8: 공룡 시대", "팁", "연맹 및 게임 플레이 팁", "계산기", "자원과 업그레이드 계획", "플래너", "Black Gold Battlefield 참가 명단 및 지도", "Dark War: Survival 비공식 커뮤니티 가이드", "맨 위로", "본문으로 건너뛰기"],
  ja: ["言語", "GIRメンバー向けのシーズン情報、攻略のヒント、作戦計画。", "シーズン", "シーズン8：恐竜時代", "ヒント", "同盟とゲーム攻略のヒント", "計算ツール", "資源とアップグレードを計画", "作戦プランナー", "Black Gold Battlefieldの参加者とマップ", "Dark War: Survival 非公式コミュニティガイド", "ページの先頭へ", "本文へ移動"],
  "zh-Hans": ["语言", "为 GIR 成员提供赛季资讯、游戏技巧和作战计划。", "赛季", "第 8 赛季：恐龙时代", "技巧", "联盟与游戏技巧", "计算器", "规划资源和升级", "作战计划", "Black Gold Battlefield 阵容与地图", "Dark War: Survival 非官方社区指南", "返回顶部", "跳转到正文"],
  th: ["ภาษา", "ข่าวประจำฤดูกาล เคล็ดลับ และแผนการรบสำหรับสมาชิก GIR", "ฤดูกาล", "ฤดูกาล 8: ยุคไดโนเสาร์", "เคล็ดลับ", "เคล็ดลับสำหรับพันธมิตรและการเล่น", "เครื่องคำนวณ", "วางแผนทรัพยากรและการอัปเกรด", "วางแผนการรบ", "รายชื่อผู้เล่นและแผนที่ Black Gold Battlefield", "คู่มือชุมชน Dark War: Survival ฉบับไม่เป็นทางการ", "กลับด้านบน", "ข้ามไปยังเนื้อหา"],
  vi: ["Ngôn ngữ", "Tin mùa giải, mẹo chơi và kế hoạch chiến đấu cho thành viên GIR.", "Mùa giải", "Mùa 8: Kỷ nguyên khủng long", "Mẹo chơi", "Mẹo cho liên minh và cách chơi", "Công cụ tính", "Lên kế hoạch tài nguyên và nâng cấp", "Kế hoạch", "Danh sách người chơi và bản đồ Black Gold Battlefield", "Hướng dẫn cộng đồng không chính thức cho Dark War: Survival", "Về đầu trang", "Chuyển đến nội dung"],
  tr: ["Dil", "GIR üyeleri için sezon haberleri, oyun ipuçları ve savaş planları.", "Sezon", "8. Sezon: Dinozor Çağı", "İpuçları", "İttifak ve oyun ipuçları", "Hesaplayıcılar", "Kaynakları ve yükseltmeleri planla", "Planlayıcı", "Black Gold Battlefield oyuncu listesi ve haritası", "Resmî olmayan Dark War: Survival topluluk rehberi", "Başa dön", "İçeriğe geç"]
};

const allianceKeys = ["motto", "diplomacy", "napNote", "allies", "interstate", "leadership", "r5", "r4"];
const allianceCopy = {
  en: ["", "Diplomacy", "Non-aggression pact", "Allies", "Inter-state NAP", "Leadership", "R5 leader", "R4 council"],
  es: ["", "Diplomacia", "Pacto de no agresión", "Aliados", "Pacto entre estados", "Liderazgo", "Líder R5", "Consejo R4"],
  pt: ["", "Diplomacia", "Pacto de não agressão", "Aliados", "Pacto entre estados", "Liderança", "Líder R5", "Conselho R4"],
  fr: ["", "Diplomatie", "Pacte de non-agression", "Alliés", "Pacte inter-États", "Direction", "Chef R5", "Conseil R4"],
  de: ["", "Diplomatie", "Nichtangriffspakt", "Verbündete", "Staatenübergreifender NAP", "Führung", "R5-Anführer", "R4-Rat"],
  ru: ["", "Дипломатия", "Пакт о ненападении", "Союзники", "Межгосударственный пакт", "Руководство", "Лидер R5", "Совет R4"],
  ar: ["", "الدبلوماسية", "ميثاق عدم اعتداء", "الحلفاء", "ميثاق عدم اعتداء بين الولايات", "القيادة", "القائد R5", "مجلس R4"],
  id: ["", "Diplomasi", "Pakta nonagresi", "Sekutu", "Pakta antarnegara bagian", "Kepemimpinan", "Pemimpin R5", "Dewan R4"],
  ko: ["", "외교", "불가침 협정", "동맹", "서버 간 불가침 협정", "지도부", "R5 연맹장", "R4 간부"],
  ja: ["", "外交", "不可侵協定", "友好同盟", "サーバー間不可侵協定", "指導部", "R5 同盟主", "R4 幹部"],
  "zh-Hans": ["", "外交", "互不侵犯协议", "盟友", "跨服互不侵犯协议", "管理团队", "R5 盟主", "R4 管理成员"],
  th: ["", "การทูต", "ข้อตกลงไม่รุกราน", "พันธมิตร", "ข้อตกลงไม่รุกรานระหว่างรัฐ", "ผู้นำ", "ผู้นำ R5", "สภา R4"],
  vi: ["", "Ngoại giao", "Hiệp ước không xâm phạm", "Đồng minh", "Hiệp ước liên bang", "Ban lãnh đạo", "Thủ lĩnh R5", "Hội đồng R4"],
  tr: ["", "Diplomasi", "Saldırmazlık anlaşması", "Müttefikler", "Eyaletler arası saldırmazlık anlaşması", "Yönetim", "R5 lideri", "R4 konseyi"]
};

const select = document.querySelector("#home-language");
const storageKey = "gir-home-language";
const ignored = "script, style, code, kbd, bdi, [data-brand], [data-copy], [lang]:not(html), output, #squads, #starter-count, #planner-status, #copy-status, #roster-storage-status";
const originalText = new WeakMap();
const originalAttributes = new WeakMap();
let active = "en";
let curated = {};

window.girText = (source, ...values) => {
  const key = typeof source === "string" ? source : source.reduce((result, part, index) =>
    result + (index ? "ZXQ" + (index - 1) + "QXZ" : "") + part, "");
  const localized = curated[key] ?? (typeof girCatalogs !== "undefined" ? girCatalogs[active]?.[key] : undefined) ?? key;
  return values.length ? localized.replace(/ZXQ(\d+)QXZ/g, (_, index) => String(values[index])) : localized;
};

function translateNode(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    if (node.parentElement?.closest(ignored)) return;
    const source = originalText.get(node) ?? node.data;
    const english = source.trim();
    if (!english) return;
    originalText.set(node, source);
    const translated = girText(english);
    const value = source.replace(english, () => translated);
    if (node.data !== value) node.data = value;
  } else if (node.nodeType === Node.ELEMENT_NODE && !node.closest(ignored)) {
    const attrs = originalAttributes.get(node) ?? {};
    for (const name of ["aria-label", "alt", "placeholder", "title"]) {
      if (!node.hasAttribute(name)) continue;
      attrs[name] ??= node.getAttribute(name);
      const value = girText(attrs[name]);
      if (node.getAttribute(name) !== value) node.setAttribute(name, value);
    }
    originalAttributes.set(node, attrs);
  }
}

function translateTree(root) {
  translateNode(root);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  while (walker.nextNode()) translateNode(walker.currentNode);
}

function showLanguage(language) {
  active = language;
  const english = [...translations.en, ...allianceCopy.en];
  const selected = [...translations[language], ...allianceCopy[language]];
  curated = Object.fromEntries(english.map((source, index) => [source, selected[index]]).filter(([source]) => source));
  const strings = Object.fromEntries([...keys, ...allianceKeys].map((key, index) => [key, selected[index]]));
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  select.value = language;
  document.querySelectorAll("[data-copy]").forEach(node => {
    const value = strings[node.dataset.copy];
    if (value !== undefined) node.textContent = value;
  });
  translateTree(document.documentElement);
  document.dispatchEvent(new Event("gir-language-change"));
}

function browserLanguage() {
  for (const locale of navigator.languages ?? [navigator.language]) {
    const base = locale?.split("-")[0].toLowerCase();
    const supported = base === "zh" ? "zh-Hans" : base;
    if (Object.hasOwn(translations, supported)) return supported;
  }
  return "en";
}

if (!select) return;
let initialLanguage = browserLanguage();
try {
  const saved = localStorage.getItem(storageKey);
  if (Object.hasOwn(translations, saved)) initialLanguage = saved;
} catch {
  // The selector works without browser storage.
}
showLanguage(initialLanguage);
new MutationObserver(records => {
  for (const record of records) {
    for (const node of record.addedNodes) translateTree(node);
  }
}).observe(document.body, {childList: true, subtree: true});
select.addEventListener("change", () => {
  showLanguage(select.value);
  try { localStorage.setItem(storageKey, select.value); } catch {}
});
})();
