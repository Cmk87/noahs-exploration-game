/* Tiny helpers shared by every file. All scripts are classic (non-module)
   scripts loaded in order, so top-level names are shared between them. */
const $=id=>document.getElementById(id);
const rnd=(a,b)=>a+Math.random()*(b-a);
const clamp01=v=>v<0?0:v>1?1:v;
let activeTab='trace';              // the visible tab; read by animation loops in every file
/* canvas roundRect arrived in Chrome 99 / Safari 16; older tablets (iPads stuck on iOS 15) need this */
if(window.CanvasRenderingContext2D&&!CanvasRenderingContext2D.prototype.roundRect)
  CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){
    let a=Array.isArray(r)?r:[r];if(a.length===1)a=[a[0],a[0],a[0],a[0]];else if(a.length===2)a=[a[0],a[1],a[0],a[1]];else if(a.length===3)a=[a[0],a[1],a[2],a[1]];
    const m=Math.min(Math.abs(w),Math.abs(h))/2,[tl,tr,br,bl]=a.map(v=>Math.max(0,Math.min(+v||0,m)));
    this.moveTo(x+tl,y);this.lineTo(x+w-tr,y);this.arcTo(x+w,y,x+w,y+tr,tr);this.lineTo(x+w,y+h-br);this.arcTo(x+w,y+h,x+w-br,y+h,br);
    this.lineTo(x+bl,y+h);this.arcTo(x,y+h,x,y+h-bl,bl);this.lineTo(x,y+tl);this.arcTo(x,y,x+tl,y,tl);this.closePath();};
