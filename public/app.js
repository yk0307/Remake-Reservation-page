const CONFIG_URL='/data/hubs.json';
const escapeHtml=(v)=>v.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const applyTheme=(ui)=>{
  const root=document.documentElement;
  Object.entries({
    '--bg-color':ui.color_scheme.background,
    '--text-color':ui.color_scheme.text,
    '--button-bg':ui.color_scheme.button_bg,
    '--button-text':ui.color_scheme.button_text,
    '--button-border':ui.color_scheme.button_border,
    '--button-padding':`${ui.button_padding_px}px`,
    '--button-radius':`${ui.button_radius_px}px`,
    '--button-font-size':`${ui.button_font_size_px}px`,
    '--button-gap':`${ui.button_gap_px}px`,
    '--button-width':ui.button_full_width?'100%':'auto'
  }).forEach(([key,value])=>root.style.setProperty(key,value));
};
const buildButtons=(buttons)=>buttons.map((b)=>`<a class="booking-button" href="${escapeHtml(b.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(b.label)}</a>`).join('');
const buildLinks=(hubs,active)=>hubs.map((hub)=>hub.slug===active?`<li><span class="active-hub">${escapeHtml(hub.title)}</span></li>`:`<li><a href="/${escapeHtml(hub.slug)}/">${escapeHtml(hub.title)}</a></li>`).join('');
const renderHub=(container,hub,config,isDeep)=>{
  document.title=`${hub.title} | 予約ハブ`;
  const home=isDeep?'<a class="home-link" href="/">All Programs</a>':'';
  container.innerHTML=`<header class="header">${home}<h1>${escapeHtml(hub.title)}</h1></header><section class="buttons">${buildButtons(hub.buttons)}</section><aside class="hub-links"><h2>他のプログラム</h2><ul>${buildLinks(config.hubs,hub.slug)}</ul></aside>`;
};
const renderMissing=(container,config,slug)=>{
  document.title='ページが見つかりません | 予約ハブ';
  container.innerHTML=`<header class="header"><a class="home-link" href="/">All Programs</a><h1>ページが見つかりません</h1><p class="lead">指定されたスラッグ「${escapeHtml(slug)}」に該当する予約ページは存在しません。</p></header><aside class="hub-links"><h2>利用可能なプログラム</h2><ul>${buildLinks(config.hubs,null)}</ul></aside>`;
};
const resolveSlug=(config)=>{const raw=window.location.pathname.replace(/^\/+|\/+$/g,'');return raw||config.default_slug;};
const syncHistory=(slug,config)=>{const target=slug===config.default_slug?'/':`/${slug}/`;if(window.location.pathname!==target)window.history.replaceState({},'',target);};
const main=async()=>{
  const container=document.getElementById('app');
  try{
    const res=await fetch(CONFIG_URL,{cache:'no-store'});
    if(!res.ok)throw new Error('コンフィグの取得に失敗しました');
    const config=await res.json();
    applyTheme(config.ui_defaults);
    const slug=resolveSlug(config);
    syncHistory(slug,config);
    const hub=config.hubs.find((item)=>item.slug===slug);
    if(hub)renderHub(container,hub,config,slug!==config.default_slug);else renderMissing(container,config,slug);
  }catch(error){
    console.error(error);
    container.innerHTML=`<header class="header"><h1>エラーが発生しました</h1><p class="error">${escapeHtml(error.message)}</p></header>`;
  }
};
document.addEventListener('DOMContentLoaded',main);
