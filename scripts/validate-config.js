const fs=require('fs');
const path=require('path');
const config=JSON.parse(fs.readFileSync(path.join(__dirname,'..','public','data','hubs.json'),'utf8'));
const errors=[];
if(typeof config.default_slug!=='string'||!config.default_slug.trim())errors.push('default_slugが設定されていません。');
if(!Array.isArray(config.hubs)||!config.hubs.length){
  errors.push('hubs配列が空です。');
}else{
  const slugSet=new Set();
  config.hubs.forEach((hub,index)=>{
    if(typeof hub.slug!=='string'||!hub.slug.trim())errors.push(`hubs[${index}].slugが無効です。`);
    else if(!/^[a-z0-9-]+$/.test(hub.slug))errors.push(`hubs[${index}].slugは小文字英数字とハイフンのみ利用できます。`);
    if(slugSet.has(hub.slug))errors.push(`slugが重複しています: ${hub.slug}`);
    slugSet.add(hub.slug);
    if(typeof hub.title!=='string'||!hub.title.trim())errors.push(`hubs[${index}].titleが無効です。`);
    if(!Array.isArray(hub.buttons)||!hub.buttons.length){errors.push(`hubs[${index}].buttonsが空です。`);}else{
      hub.buttons.forEach((button,btnIndex)=>{
        if(typeof button.label!=='string'||!button.label.trim())errors.push(`hubs[${index}].buttons[${btnIndex}].labelが無効です。`);
        if(typeof button.url!=='string'||!/^https:\/\//.test(button.url))errors.push(`hubs[${index}].buttons[${btnIndex}].urlはhttpsで始まる必要があります。`);
      });
    }
  });
}
const ui=config.ui_defaults;
if(!ui||typeof ui!=='object'){
  errors.push('ui_defaultsが存在しません。');
}else{
  ['button_padding_px','button_radius_px','button_font_size_px','button_gap_px','contrast_ratio_min'].forEach((key)=>{
    if(typeof ui[key]!=='number')errors.push(`ui_defaults.${key}は数値である必要があります。`);
  });
  const scheme=ui.color_scheme;
  if(!scheme||typeof scheme!=='object')errors.push('ui_defaults.color_schemeが存在しません。');
  else Object.entries(scheme).forEach(([key,value])=>{if(typeof value!=='string'||!/^#([0-9a-fA-F]{6})$/.test(value))errors.push(`color_scheme.${key}は#RRGGBB形式で指定してください。`);});
}
if(errors.length){console.error('コンフィグ検証でエラーが見つかりました:');errors.forEach((err)=>console.error(`- ${err}`));process.exit(1);}
console.log('configは有効です。');
