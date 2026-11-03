import {argbFromHex,hexFromArgb,TonalPalette} from '@material/material-color-utilities';
export const DEFAULTS={themeColor:'#6750A4',secondaryColor:'',tertiaryColor:'',surfaceColor:'',personColorJ:'#6750A4',personColorG:'#7D5260',contrastLevel:'standard'};

export const isHex=value=>typeof value==='string'&&/^#[0-9a-f]{6}$/i.test(value);
const source=(value,fallback)=>isHex(value)?value:fallback;
const luminance=hex=>{const rgb=hex.replace('#','').match(/../g).map(h=>parseInt(h,16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
export function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
export function contrastText(color){return contrast(color,'#000000')>=contrast(color,'#FFFFFF')?'#000000':'#FFFFFF';}
export function tone(color,value){return hexFromArgb(TonalPalette.fromInt(argbFromHex(source(color,DEFAULTS.themeColor))).tone(value));}
const cache=new Map();
function readable(palette,backgrounds,preferred,ratio){
 const candidate=hexFromArgb(palette.tone(preferred));if(backgrounds.every(bg=>contrast(candidate,bg)>=ratio))return candidate;
 let best=null,distance=Infinity;
 for(let i=0;i<=100;i++){const color=hexFromArgb(palette.tone(i)),delta=Math.abs(i-preferred);if(delta<distance&&backgrounds.every(bg=>contrast(color,bg)>=ratio)){best=color;distance=delta;}}
 return best||contrastText(backgrounds[0]);
}
const reference={
  "light": {
    "--md-primary": "#6750A4",
    "--md-on-primary": "#FFFFFF",
    "--md-primary-container": "#EADDFF",
    "--md-on-primary-container": "#21005D",
    "--md-secondary": "#625B71",
    "--md-on-secondary": "#FFFFFF",
    "--md-secondary-container": "#E8DEF8",
    "--md-on-secondary-container": "#1D192B",
    "--md-tertiary": "#7D5260",
    "--md-on-tertiary": "#FFFFFF",
    "--md-tertiary-container": "#FFD8E4",
    "--md-on-tertiary-container": "#31111D",
    "--md-error": "#B3261E",
    "--md-on-error": "#FFFFFF",
    "--md-error-container": "#F9DEDC",
    "--md-on-error-container": "#410E0B",
    "--md-surface": "#FEF7FF",
    "--md-on-surface": "#1D1B20",
    "--md-surface-variant": "#E7E0EC",
    "--md-on-surface-variant": "#49454F",
    "--md-surface-container-lowest": "#FFFFFF",
    "--md-surface-container-low": "#F7F2FA",
    "--md-surface-container": "#F3EDF7",
    "--md-surface-container-high": "#ECE6F0",
    "--md-surface-container-highest": "#E6E0E9",
    "--md-outline": "#79747E",
    "--md-outline-variant": "#CAC4D0",
    "--md-inverse-surface": "#322F35",
    "--md-inverse-on-surface": "#F5EFF7",
    "--md-inverse-primary": "#D0BCFF",
    "--md-success": "#146C2E",
    "--md-success-container": "#C4EED0",
    "--md-on-success-container": "#072711",
    "--md-warn": "#7A5900"
  },
  "dark": {
    "--md-primary": "#D0BCFF",
    "--md-on-primary": "#381E72",
    "--md-primary-container": "#4F378B",
    "--md-on-primary-container": "#EADDFF",
    "--md-secondary": "#CCC2DC",
    "--md-on-secondary": "#332D41",
    "--md-secondary-container": "#4A4458",
    "--md-on-secondary-container": "#E8DEF8",
    "--md-tertiary": "#EFB8C8",
    "--md-on-tertiary": "#492532",
    "--md-tertiary-container": "#633B48",
    "--md-on-tertiary-container": "#FFD8E4",
    "--md-error": "#F2B8B5",
    "--md-on-error": "#601410",
    "--md-error-container": "#8C1D18",
    "--md-on-error-container": "#F9DEDC",
    "--md-surface": "#141218",
    "--md-on-surface": "#E6E0E9",
    "--md-surface-variant": "#49454F",
    "--md-on-surface-variant": "#CAC4D0",
    "--md-surface-container-lowest": "#0F0D13",
    "--md-surface-container-low": "#1D1B20",
    "--md-surface-container": "#211F26",
    "--md-surface-container-high": "#2B2930",
    "--md-surface-container-highest": "#36343B",
    "--md-outline": "#938F99",
    "--md-outline-variant": "#49454F",
    "--md-inverse-surface": "#E6E0E9",
    "--md-inverse-on-surface": "#322F35",
    "--md-inverse-primary": "#6750A4",
    "--md-success": "#7ED99A",
    "--md-success-container": "#0A5225",
    "--md-on-success-container": "#C4EED0",
    "--md-warn": "#F0B72F"
  }
};
// Fixed Material 3 reference schemes. Legacy custom settings cannot change UI roles.
export function create(input={},dark=false){
 const key=dark?'dark':'light';if(cache.has(key))return cache.get(key);
 const colors={...reference.light,...(dark?reference.dark:{})};colors['--md-scrim']='rgba(0,0,0,.32)';
 for(const [id,role]of [['j','primary'],['g','tertiary']]){
  colors['--person-'+id+'-text']=colors['--md-on-surface'];
  colors['--person-'+id+'-container']=colors['--md-'+role+'-container'];
  colors['--person-'+id+'-on-container']=colors['--md-on-'+role+'-container'];
  colors['--person-'+id+'-on-primary-container']=colors['--md-on-primary-container'];
  colors['--person-'+id+'-on-secondary-container']=colors['--md-on-secondary-container'];
  colors['--person-'+id+'-indicator']=colors['--md-'+role];
 }
 cache.set(key,colors);return colors;
}
export function apply(settings,dark,target=document.documentElement){const colors=create(settings,dark);for(const [key,value]of Object.entries(colors))target.style.setProperty(key,value);return colors;}
// Category colors use the same readable tonal treatment as the person colors.
export function category(settings,dark,color){
 const palette=TonalPalette.fromInt(argbFromHex(source(color,'#49454F'))),scheme=create(settings,dark);
 const background=hexFromArgb(palette.tone(dark?30:90));
 const surfaces=['--md-surface','--md-surface-container-low','--md-surface-container-highest'].map(key=>scheme[key]);
 return {foreground:readable(palette,[background,...surfaces],dark?90:25,7),background};
}
