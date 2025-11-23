const CONFIG_URL='/data/hubs.json';
const escapeHtml=(v)=>v.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const HEX_COLOR_PATTERN=/^([0-9a-f]{3}|[0-9a-f]{6})$/i;
const hexToRgba=(hex,alpha)=>{
  const value=hex?.replace('#','');
  if(!value||!HEX_COLOR_PATTERN.test(value))return '';
  const normalized=value.length===3?value.split('').map((c)=>c+c).join(''):value.padEnd(6,'0');
  const r=parseInt(normalized.slice(0,2),16);
  const g=parseInt(normalized.slice(2,4),16);
  const b=parseInt(normalized.slice(4,6),16);
  return `rgba(${r},${g},${b},${alpha})`;
};
const applyTheme=(ui={})=>{
  const root=document.documentElement;
  const colorScheme=ui.color_scheme??{};
  const accent=colorScheme.accent??colorScheme.text??'#111827';
  const tokens={
    '--hub-bg-base':colorScheme.background??'#FFFFFF',
    '--hub-bg-subtle':'#F7F7F9',
    '--hub-border-color':colorScheme.button_border??'#E5E7EB',
    '--hub-text-color':colorScheme.text??'#111827',
    '--hub-accent-color':accent,
    '--hub-accent-soft':hexToRgba(accent,0.12)||'rgba(17,24,39,0.12)',
    '--hub-accent-softer':hexToRgba(accent,0.06)||'rgba(17,24,39,0.06)',
    '--hub-focus-ring':hexToRgba(accent,0.45)||'rgba(17,24,39,0.5)',
    '--hub-button-surface':colorScheme.button_bg??'rgba(255,255,255,0.92)',
    '--hub-surface-veil':hexToRgba(accent,0.04)||'rgba(17,24,39,0.04)',
    '--hub-surface-border':hexToRgba(accent,0.12)||'rgba(17,24,39,0.12)',
    '--hub-button-radius':`${ui.button_radius_px??16}px`,
    '--hub-button-padding-y':`${ui.button_padding_px??16}px`,
    '--hub-button-font-size':`${ui.button_font_size_px??15}px`,
    '--hub-button-gap-y':`${ui.button_gap_px??12}px`,
    '--hub-button-width':ui.button_full_width?'100%':'auto',
    '--hub-container-px':'24px',
    '--hub-container-max-width':'44rem',
    '--hub-grid-gap':'16px'
  };
  Object.entries(tokens).forEach(([key,value])=>root.style.setProperty(key,value));
  root.style.setProperty('--bg-color',tokens['--hub-bg-base']);
  root.style.setProperty('--text-color',tokens['--hub-text-color']);
  root.style.setProperty('--button-bg',tokens['--hub-button-surface']);
  root.style.setProperty('--button-text',tokens['--hub-text-color']);
  root.style.setProperty('--button-border',tokens['--hub-border-color']);
  root.style.setProperty('--button-padding',`${ui.button_padding_px??16}px`);
  root.style.setProperty('--button-radius',`${ui.button_radius_px??16}px`);
  root.style.setProperty('--button-font-size',`${ui.button_font_size_px??15}px`);
  root.style.setProperty('--button-gap',`${ui.button_gap_px??12}px`);
  root.style.setProperty('--button-width',ui.button_full_width?'100%':'auto');
};
const buildButtons=(buttons)=>buttons.map((button)=>`
    <a class="hub-button" href="${escapeHtml(button.url)}" target="_blank" rel="noopener noreferrer">
      <span class="hub-button__content">
        <span class="hub-button__label">${escapeHtml(button.label)}</span>
        <span class="hub-button__icon" aria-hidden="true">→</span>
      </span>
    </a>
  `).join('').trim();
const renderHub=(container,hub)=>{
  document.title=`${hub.title} | 予約ハブ`;
  container.innerHTML=`
    <main class="hub-main">
      <header class="hub-header">
        <h1 class="hub-title">${escapeHtml(hub.title)}</h1>
      </header>
      <section class="hub-grid" aria-label="予約リンク">
        ${buildButtons(hub.buttons)}
      </section>
    </main>
  `;
};
const renderMissing=(container,slug)=>{
  document.title='ページが見つかりません | 予約ハブ';
  container.innerHTML=`
    <main class="hub-main">
      <header class="hub-header">
        <h1 class="hub-title">ページが見つかりません</h1>
        <p class="hub-lead">指定されたスラッグ「${escapeHtml(slug)}」に該当する予約ページは存在しません。</p>
      </header>
    </main>
  `;
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
    if(hub)renderHub(container,hub);else renderMissing(container,slug);
  }catch(error){
    console.error(error);
    container.innerHTML=`
      <main class="hub-main">
        <header class="hub-header">
          <h1 class="hub-title">エラーが発生しました</h1>
          <p class="error">${escapeHtml(error.message)}</p>
        </header>
      </main>
    `;
  }
};
document.addEventListener('DOMContentLoaded',main);
