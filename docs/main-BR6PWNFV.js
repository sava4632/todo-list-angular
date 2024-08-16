import{C as V,b as j,c as D,d as T,e as I,h as x,i as k,k as F,l as B}from"./chunk-4NJJ6B46.js";import{f as z,g as p,h as R,m as U,n as C,p as W,u as L}from"./chunk-U7WWMXCE.js";import{Ga as m,Gc as P,V as O,Wa as S,Y as h,Ya as y,Z as a,_a as v,ab as w,ba as f,bb as A,ca as l,ha as g,ia as d,ka as E,uc as N,wb as M}from"./chunk-2DJ3BK5N.js";var Y=(()=>{let e=class e{};e.\u0275fac=function(i){return new(i||e)},e.\u0275cmp=g({type:e,selectors:[["shared-error404-page"]],decls:1,vars:0,consts:[[1,"container"]],template:function(i,n){i&1&&M(0,"div",0)},styles:[".container[_ngcontent-%COMP%]{width:100vw;height:100vh;background-image:url(/assets/images/404.svg);background-size:contain;background-position:center;background-repeat:no-repeat}"]});let t=e;return t})();var G=(t,e)=>{let o=l(k);return l(B).isAuthenticated()?!0:(o.navigate(["/auth/login"]),!1)};var ee=[{path:"auth",loadChildren:()=>import("./chunk-PNFFL7WO.js").then(t=>t.AuthModule)},{path:"tasks",loadChildren:()=>import("./chunk-A7OT2TCW.js").then(t=>t.TasksModule),canActivate:[G]},{path:"404",component:Y},{path:"",redirectTo:"auth",pathMatch:"full"},{path:"**",redirectTo:"404",pathMatch:"full"}],H=(()=>{let e=class e{};e.\u0275fac=function(i){return new(i||e)},e.\u0275mod=d({type:e}),e.\u0275inj=a({imports:[F.forRoot(ee),F]});let t=e;return t})();var Z=(()=>{let e=class e{constructor(){this.title="todo-list"}};e.\u0275fac=function(i){return new(i||e)},e.\u0275cmp=g({type:e,selectors:[["app-root"]],decls:1,vars:0,template:function(i,n){i&1&&M(0,"router-outlet")},dependencies:[x]});let t=e;return t})();var te="@",re=(()=>{let e=class e{constructor(r,i,n,s,u){this.doc=r,this.delegate=i,this.zone=n,this.animationType=s,this.moduleImpl=u,this._rendererFactoryPromise=null,this.scheduler=l(y,{optional:!0})}ngOnDestroy(){this._engine?.flush()}loadImpl(){return(this.moduleImpl??import("./chunk-UDQDUBXC.js")).catch(i=>{throw new O(5300,!1)}).then(({\u0275createEngine:i,\u0275AnimationRendererFactory:n})=>{this._engine=i(this.animationType,this.doc,this.scheduler);let s=new n(this.delegate,this._engine,this.zone);return this.delegate=s,s})}createRenderer(r,i){let n=this.delegate.createRenderer(r,i);if(n.\u0275type===0)return n;typeof n.throwOnSyntheticProps=="boolean"&&(n.throwOnSyntheticProps=!1);let s=new b(n);return i?.data?.animation&&!this._rendererFactoryPromise&&(this._rendererFactoryPromise=this.loadImpl()),this._rendererFactoryPromise?.then(u=>{let _=u.createRenderer(r,i);s.use(_)}).catch(u=>{s.use(n)}),s}begin(){this.delegate.begin?.()}end(){this.delegate.end?.()}whenRenderingDone(){return this.delegate.whenRenderingDone?.()??Promise.resolve()}};e.\u0275fac=function(i){S()},e.\u0275prov=h({token:e,factory:e.\u0275fac});let t=e;return t})(),b=class{constructor(e){this.delegate=e,this.replay=[],this.\u0275type=1}use(e){if(this.delegate=e,this.replay!==null){for(let o of this.replay)o(e);this.replay=null}}get data(){return this.delegate.data}destroy(){this.replay=null,this.delegate.destroy()}createElement(e,o){return this.delegate.createElement(e,o)}createComment(e){return this.delegate.createComment(e)}createText(e){return this.delegate.createText(e)}get destroyNode(){return this.delegate.destroyNode}appendChild(e,o){this.delegate.appendChild(e,o)}insertBefore(e,o,r,i){this.delegate.insertBefore(e,o,r,i)}removeChild(e,o,r){this.delegate.removeChild(e,o,r)}selectRootElement(e,o){return this.delegate.selectRootElement(e,o)}parentNode(e){return this.delegate.parentNode(e)}nextSibling(e){return this.delegate.nextSibling(e)}setAttribute(e,o,r,i){this.delegate.setAttribute(e,o,r,i)}removeAttribute(e,o,r){this.delegate.removeAttribute(e,o,r)}addClass(e,o){this.delegate.addClass(e,o)}removeClass(e,o){this.delegate.removeClass(e,o)}setStyle(e,o,r,i){this.delegate.setStyle(e,o,r,i)}removeStyle(e,o,r){this.delegate.removeStyle(e,o,r)}setProperty(e,o,r){this.shouldReplay(o)&&this.replay.push(i=>i.setProperty(e,o,r)),this.delegate.setProperty(e,o,r)}setValue(e,o){this.delegate.setValue(e,o)}listen(e,o,r){return this.shouldReplay(o)&&this.replay.push(i=>i.listen(e,o,r)),this.delegate.listen(e,o,r)}shouldReplay(e){return this.replay!==null&&e.startsWith(te)}};function X(t="animations"){return w("NgAsyncAnimations"),E([{provide:v,useFactory:(e,o,r)=>new re(e,o,r,t),deps:[N,D,A]},{provide:m,useValue:t==="noop"?"NoopAnimations":"BrowserAnimations"}])}var oe=(()=>{let e=class e extends C{constructor(r,i,n){super(r,i,n,l(y,{optional:!0}))}ngOnDestroy(){this.flush()}};e.\u0275fac=function(i){return new(i||e)(f(N),f(p),f(R))},e.\u0275prov=h({token:e,factory:e.\u0275fac});let t=e;return t})();function ie(){return new U}function ne(t,e,o){return new L(t,e,o)}var J=[{provide:R,useFactory:ie},{provide:C,useClass:oe},{provide:v,useFactory:ne,deps:[D,C,A]}],q=[{provide:p,useFactory:()=>new W},{provide:m,useValue:"BrowserAnimations"},...J],se=[{provide:p,useClass:z},{provide:m,useValue:"NoopAnimations"},...J],K=(()=>{let e=class e{static withConfig(r){return{ngModule:e,providers:r.disableAnimations?se:q}}};e.\u0275fac=function(i){return new(i||e)},e.\u0275mod=d({type:e}),e.\u0275inj=a({providers:q,imports:[I]});let t=e;return t})();var Q=(()=>{let e=class e{};e.\u0275fac=function(i){return new(i||e)},e.\u0275mod=d({type:e}),e.\u0275inj=a({imports:[P]});let t=e;return t})();var $=(()=>{let e=class e{};e.\u0275fac=function(i){return new(i||e)},e.\u0275mod=d({type:e,bootstrap:[Z]}),e.\u0275inj=a({providers:[X()],imports:[I,H,Q,j,V,K]});let t=e;return t})();T().bootstrapModule($).catch(t=>console.error(t));
