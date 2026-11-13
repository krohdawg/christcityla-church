/* Christ City Church signup popup.
   A copy of Planning Center's own Church Center popup (js.churchcenter.com/modal/v1): same full-screen frame,
   same ready/verified/show/close handshake, so Church Center draws its own card and close button.
   Changes from theirs: phones, and any page without https (their popup will not open there), get our own on-site panel, sheet() below.
   If Church Center never answers within 8 seconds, the panel opens instead, so nobody is left on a spinner or sent to a new tab. */
(function(){
var SEL="a[href][data-open-in-church-center-modal='true']";
var ok=true;
var spin="data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="200" height="200"><circle cx="50" cy="50" r="35" fill="none" stroke="#ffffff" stroke-width="10" stroke-dasharray="164.93 56.98"><animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" dur="1s" repeatCount="indefinite"/></circle></svg>');
var fr=null,bg=null,origin=null,timer=null,url=null,lastFocus=null;
function build(){
  if(fr)return;
  fr=document.createElement("iframe");fr.id="ChurchCenterModalIframeExistsInDOM";fr.title="Christ City Church form";fr.allow="payment";
  fr.style.cssText="z-index:2147483647;display:none;opacity:0;background:transparent;border:0;margin:0;padding:0;position:fixed;left:0;top:0;width:100%;height:100%;";
  bg=document.createElement("div");
  bg.style.cssText="z-index:2147483646;display:none;opacity:0;background:rgba(5,26,51,.72);position:fixed;left:0;top:0;width:100%;height:100%;";
  var im=document.createElement("img");im.src=spin;im.alt="";im.style.cssText="position:absolute;left:50%;top:40%;width:64px;height:64px;margin:-32px 0 0 -32px;";
  bg.appendChild(im);document.body.appendChild(bg);document.body.appendChild(fr);
}
function vis(el,on){el.style.display=on?"block":"none";el.style.opacity=on?1:0}
function onMsg(e){
  if(e.origin!==origin||!e.data)return;
  var t=e.data.type;
  if(t==="ready"){fr.contentWindow.postMessage({type:"verified"},"*")}
  else if(t==="show"){clearTimeout(timer);vis(fr,true);vis(bg,true)}
  else if(t==="close"){shut()}
}
function onKey(e){if(e.key==="Escape"||e.keyCode===27)shut()}
function open(href){
  build();lastFocus=document.activeElement;
  var u=new URL(href.replace(".churchcenteronline.com",".churchcenter.com"));
  u.searchParams.set("open-in-church-center-modal","true");url=u.toString();origin=u.origin;
  window.addEventListener("message",onMsg,false);document.addEventListener("keyup",onKey);
  document.documentElement.style.overflow="hidden";
  fr.src=url;vis(fr,false);vis(bg,true);
  clearTimeout(timer);timer=setTimeout(function(){var go=url;shut();sheet(go)},8000);
}
function shut(){
  clearTimeout(timer);
  window.removeEventListener("message",onMsg);document.removeEventListener("keyup",onKey);
  if(fr){fr.src="about:blank";vis(fr,false);vis(bg,false)}
  document.documentElement.style.overflow="";origin=null;
  if(lastFocus&&lastFocus.focus)lastFocus.focus();
}
/* Phones: Church Center's popup card is 430px wide and spills off a phone screen, so phones get the form's
   normal phone page in a full-screen sheet on our site, with our own CLOSE bar. */
var sh=null,sf=null;
function sheet(href){
  if(!sh){
    var st=document.createElement("style");
    st.textContent=".ccs{position:fixed;inset:0;z-index:2147483647;display:none;align-items:center;justify-content:center;background:#fff}.ccs.on{display:flex}.ccs-c{display:flex;flex-direction:column;width:100%;height:100%;background:#fff;overflow:hidden}@media (min-width:640px){.ccs{background:rgba(5,26,51,.72)}.ccs-c{width:560px;height:calc(100% - 48px);max-height:900px;border-radius:12px;box-shadow:0 24px 64px rgba(0,0,0,.35)}}.ccs-h{flex:0 0 56px;display:flex;align-items:center;justify-content:space-between;padding:0 8px 0 18px;background:#051A33;color:#fff;font:800 14px/1 Manrope,system-ui,sans-serif;letter-spacing:.12em}.ccs-x{display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 12px;border:0;border-radius:8px;background:transparent;color:#fff;font:800 13px/1 Manrope,system-ui,sans-serif;letter-spacing:.12em;cursor:pointer}.ccs-x i{font-style:normal;font-size:24px;font-weight:400;line-height:1}.ccs-x:focus-visible{outline:2px solid #fff;outline-offset:2px}.ccs-w{position:relative;flex:1 1 auto;overflow:hidden;background:#fff}.ccs iframe{position:absolute;left:0;top:0;border:0;display:block;background:#fff;transform-origin:0 0}";
    document.head.appendChild(st);
    sh=document.createElement("div");sh.className="ccs";sh.setAttribute("role","dialog");sh.setAttribute("aria-modal","true");sh.setAttribute("aria-label","Christ City Church form");
    sh.innerHTML='<div class="ccs-c"><div class="ccs-h"><span>CHRIST CITY</span><button class="ccs-x" type="button" aria-label="Close form">CLOSE <i aria-hidden="true">&times;</i></button></div><div class="ccs-w"><iframe title="Christ City Church form" allow="payment"></iframe></div></div>';
    document.body.appendChild(sh);sf=sh.querySelector("iframe");
    sh.querySelector(".ccs-x").addEventListener("click",unsheet);sh.addEventListener("click",function(e){if(e.target===sh)unsheet()});
    window.addEventListener("resize",fit);
  }
  lastFocus=document.activeElement;
  var u=new URL(href.replace(".churchcenteronline.com",".churchcenter.com"));u.searchParams.delete("open-in-church-center-modal");
  sf.src=u.toString();sh.classList.add("on");fit();document.documentElement.style.overflow="hidden";document.addEventListener("keyup",sheetKey);
  sh.querySelector(".ccs-x").focus();
}
/* Inside a frame, Church Center lays its form out 430px wide (+ margins), wider than most phones.
   So the frame is drawn 480px wide and shrunk to fit the screen. */
function fit(){
  if(!sh||!sh.classList.contains("on"))return;
  var w=sh.querySelector(".ccs-w"),W=w.clientWidth,H=w.clientHeight,F=480,s=W<F?W/F:1;
  sf.style.width=(s<1?F:W)+"px";sf.style.height=Math.ceil(H/s)+"px";sf.style.transform=s<1?"scale("+s+")":"none";
}
function sheetKey(e){if(e.key==="Escape"||e.keyCode===27)unsheet()}
function unsheet(){if(!sh)return;sh.classList.remove("on");sf.src="about:blank";document.documentElement.style.overflow="";document.removeEventListener("keyup",sheetKey);if(lastFocus&&lastFocus.focus)lastFocus.focus()}
document.addEventListener("click",function(e){
  var a=e.target&&e.target.closest?e.target.closest(SEL):null;
  if(!a)return;
  if(!ok||e.metaKey||e.ctrlKey||e.shiftKey||e.button){if(!ok){e.preventDefault();sheet(a.href)}return}
  e.preventDefault();
  if(window.innerWidth<640||location.protocol!=="https:")sheet(a.href);else open(a.href);
});
window.ChristCityForms={open:open,close:shut,sheet:sheet,unsheet:unsheet};
})();
