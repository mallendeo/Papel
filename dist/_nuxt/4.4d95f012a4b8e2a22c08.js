webpackJsonp([4],{"/TYz":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a("Yc/6"),r=a("rGQh"),s=!1;var n=function(t){s||a("teV2")},o=a("VU/8")(i.a,r.a,!1,n,"data-v-2a183b29",null);o.options.__file="pages/index.vue",e.default=o.exports},"29pw":function(t,e,a){"use strict";var i=function(){var t=this.$createElement;return(this._self._c||t)("div",{staticClass:"loading"})};i._withStripped=!0;var r={render:i,staticRenderFns:[]};e.a=r},"3wWP":function(t,e,a){"use strict";var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"grid"},[t.loading?a("loading-indicator",{style:{"--color":"var(--color-accent)"}}):t._e(),t._l(t.sheetList,function(e,i){return!t.loading&&t.getUsername(e)?a("div",{key:e.distHash+"-"+i,staticClass:"grid__item col"},[a("a",{staticClass:"iframe-wrapper",attrs:{href:"/"+t.getUsername(e)+"/"+e.slug}},[a("iframe",{attrs:{src:t.ipfsUrl+"/"+e.distHash,sandbox:"allow-scripts allow-pointer-lock allow-same-origin",scrolling:"no",tabindex:"-1",allowtransparency:"true",frameborder:"0"}}),e.title||e.description?a("div",{staticClass:"details"},[e.title?a("h4",{staticClass:"details__title"},[t._v(t._s(e.title))]):t._e(),e.description?a("p",{staticClass:"details__description"},[t._v(t._s(e.description))]):t._e()]):t._e()]),a("div",{staticClass:"actions"},[a("div",{staticClass:"link"},[t.showAuthor?a("a",{attrs:{href:"/"+t.getUsername(e)}},[a("app-avatar",{style:{"--size":"2rem"},attrs:{hash:e.author.avatar,alt:"User @"+t.getUsername(e),admin:e.author.isAdmin}})],1):t._e(),a("div",{staticClass:"col"},[a("a",{staticClass:"title",attrs:{title:e.title,href:"/"+t.getUsername(e)+"/"+e.slug}},[t._v("\n            "+t._s(e.title||"A project by "+t.getUsername(e))+"\n          ")]),t.showAuthor?a("a",{staticClass:"username",attrs:{href:"/"+t.getUsername(e)}},[t._v("\n            "+t._s(e.author.name||e.author.username)+"\n          ")]):t._e()])]),a("button",{staticClass:"btn action-btn"},[a("i",{staticClass:"material-icons"},[t._v("comment")]),t._v("\n        "+t._s(e.numComments||0)+"\n      ")]),a("button",{staticClass:"btn action-btn"},[a("i",{staticClass:"material-icons"},[t._v("\n          "+t._s(e.liked?"favorite":"favorite_border")+"\n        ")]),t._v("\n        "+t._s(e.numLikes||0)+"\n      ")])])]):t._e()}),t.totalSheets>t.perPage?a("nav",{staticClass:"nav"},[a("nav-btn",{attrs:{to:t.pageUrl(t.currPage-1),disabled:!t.showPrevBtn}},[a("i",{staticClass:"material-icons"},[t._v("arrow_back")]),t._v("\n      Prev\n    ")]),a("nav-btn",{attrs:{"icon-right":!0,to:t.pageUrl(t.currPage+1),disabled:!t.showNextBtn}},[t._v("\n      Next\n      "),a("i",{staticClass:"material-icons"},[t._v("arrow_forward")])])],1):t._e()],2)};i._withStripped=!0;var r={render:i,staticRenderFns:[]};e.a=r},"6jTt":function(t,e,a){"use strict";var i=function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"avatar"},[e("div",{staticClass:"image-wrapper"},[e("img",{staticClass:"image",attrs:{alt:this.alt,src:this.hash?this.ipfsUrl+"/"+this.hash:a("JrEj")}})]),this.admin?e("img",{staticClass:"addon",attrs:{src:a("okHp"),alt:"Crown"}}):this._e()])};i._withStripped=!0;var r={render:i,staticRenderFns:[]};e.a=r},EVoM:function(t,e,a){"use strict";var i=a("lwuJ"),r=a("x/vM"),s=!1;var n=function(t){s||a("XwR7")},o=a("VU/8")(i.a,r.a,!1,n,"data-v-5d25fcee",null);o.options.__file="components/ui/NavBtn.vue",e.a=o.exports},"It/Q":function(t,e,a){var i=a("SX+q");"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);a("rjj0")("bbc9bad0",i,!1,{sourceMap:!1})},"Iu/s":function(t,e,a){(t.exports=a("FZ+f")(!1)).push([t.i,".loading[data-v-6d7f6efa]{--s:var(--size,32px);--s:var(--size,2rem);border:2px solid var(--color,#fff);border:.125rem solid var(--color,#fff);border-radius:50%;border-top-color:transparent;border-right-color:transparent;width:var(--s);height:var(--s);margin:auto;-webkit-transform-origin:50% 50%;transform-origin:50% 50%;-webkit-animation:spin var(--dur,.75s) linear infinite;animation:spin var(--dur,.75s) linear infinite}",""])},JrEj:function(t,e,a){t.exports=a.p+"img/user.656def7.svg"},OKRJ:function(t,e,a){"use strict";var i=a("dDdc"),r=a("6jTt"),s=!1;var n=function(t){s||a("It/Q")},o=a("VU/8")(i.a,r.a,!1,n,"data-v-3637e83a",null);o.options.__file="components/ui/AppAvatar.vue",e.a=o.exports},QLJK:function(t,e,a){var i=a("Iu/s");"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);a("rjj0")("7b490a1d",i,!1,{sourceMap:!1})},R6iJ:function(t,e,a){(t.exports=a("FZ+f")(!1)).push([t.i,".grid[data-v-3dc13ffa]{width:100%;height:100%;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(2,16rem) 1fr;grid-gap:2.5rem}.grid__item[data-v-3dc13ffa]{height:100%}.loading[data-v-3dc13ffa]{grid-area:1/2}.details[data-v-3dc13ffa]{position:absolute;top:0;left:0;width:100%;height:100%;padding:16px;padding:1rem;background:var(--color-shade);-webkit-transition:all .2s ease;transition:all .2s ease;opacity:0;color:var(--color-text)}.details[data-v-3dc13ffa]:hover{opacity:1}.details__title[data-v-3dc13ffa]{font-size:20px;font-size:1.25rem;line-height:20px;line-height:1.25rem}.details__description[data-v-3dc13ffa]{font-weight:400;margin-top:8px;margin-top:.5rem;color:var(--color-text-light)}.title[data-v-3dc13ffa],.username[data-v-3dc13ffa]{max-width:160px;max-width:10rem;margin-left:8px;margin-left:.5rem;text-decoration:none;color:var(--color-text);text-overflow:ellipsis;white-space:nowrap;overflow:hidden;font-weight:700}.title[data-v-3dc13ffa]{font-size:14.4px;font-size:.9rem}.username[data-v-3dc13ffa]{-ms-flex-item-align:start;align-self:flex-start;opacity:.5;font-size:12.8px;font-size:.8rem}.link[data-v-3dc13ffa]{-webkit-box-flex:1;-ms-flex:1;flex:1;color:#fff;display:-webkit-box;display:-ms-flexbox;display:flex;position:relative;text-decoration:none}.iframe-wrapper[data-v-3dc13ffa]{-webkit-box-flex:1;-ms-flex:1;flex:1;background:#fff;-webkit-transition:all .2s ease;transition:all .2s ease;border-radius:.25rem;overflow:hidden;position:relative;-webkit-mask-image:radial-gradient(circle,#fff 100%,#000 0);mask-image:radial-gradient(circle,#fff 100%,#000 0)}.iframe-wrapper iframe[data-v-3dc13ffa]{pointer-events:none;-webkit-transform:scale(.501);transform:scale(.501);-webkit-transform-origin:0 0;transform-origin:0 0;width:200%;height:200%;border:none}.nav[data-v-3dc13ffa]{grid-column:2/3;grid-row:3;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between}.actions[data-v-3dc13ffa],.nav[data-v-3dc13ffa]{display:-webkit-box;display:-ms-flexbox;display:flex}.actions[data-v-3dc13ffa]{margin-top:16px;margin-top:1rem;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.action-btn[data-v-3dc13ffa]{height:auto;display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-item-align:stretch;align-self:stretch;color:var(--color-text-light);font-size:12px;font-size:.75rem;padding:0 4px;padding:0 .25rem}.action-btn [class*=icon][data-v-3dc13ffa]{color:var(--color-text);margin-right:4px;margin-right:.25rem;font-size:13.6px;font-size:.85rem}.action-btn[data-v-3dc13ffa]:first-of-type{margin-left:auto}",""])},"SX+q":function(t,e,a){(t.exports=a("FZ+f")(!1)).push([t.i,".avatar[data-v-3637e83a]{position:relative}.addon[data-v-3637e83a]{width:16px;width:1rem;position:absolute;left:14.4px;left:.9rem;bottom:0}.image[data-v-3637e83a]{min-width:100%;height:100%}.image-wrapper[data-v-3637e83a]{--s:var(--size,64px);--s:var(--size,4rem);width:var(--s);height:var(--s);border-radius:50%;overflow:hidden}",""])},UKWk:function(t,e,a){(t.exports=a("FZ+f")(!1)).push([t.i,".nav-btn[data-v-5d25fcee]{padding:8px 16px;padding:.5rem 1rem;border-radius:.25rem;background:var(--color-shade);color:var(--color-text);text-decoration:none}.nav-btn[data-v-5d25fcee]:hover{background:var(--color-accent);color:#fff}.nav-btn.disabled[data-v-5d25fcee],.nav-btn[data-v-5d25fcee]:disabled{pointer-events:none;opacity:.25}[data-theme=light] .shadow[data-v-5d25fcee]{-webkit-box-shadow:var(--shadow,0 .25rem .75rem -.25rem var(--shadow-color,rgba(0,0,0,.2)));box-shadow:var(--shadow,0 .25rem .75rem -.25rem var(--shadow-color,rgba(0,0,0,.2)))}.nav-btn[data-v-5d25fcee]{font-size:16px;font-size:1rem}.nav-btn .material-icons[data-v-5d25fcee],.nav-btn[data-v-5d25fcee] .material-icons{font-size:16px;font-size:1rem;margin-right:8px;margin-right:.5rem}.icon-right[data-v-5d25fcee] .material-icons{margin-right:0;margin-left:8px;margin-left:.5rem}",""])},VPXY:function(t,e,a){"use strict";var i=a("29pw"),r=!1;var s=function(t){r||a("QLJK")},n=a("VU/8")(null,i.a,!1,s,"data-v-6d7f6efa",null);n.options.__file="components/ui/LoadingIndicator.vue",e.a=n.exports},XwR7:function(t,e,a){var i=a("UKWk");"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);a("rjj0")("1db078d6",i,!1,{sourceMap:!1})},"Yc/6":function(t,e,a){"use strict";var i=a("uNvG");e.a={components:{SheetGrid:i.a},middleware:"check-extension"}},dDdc:function(t,e,a){"use strict";var i=a("dNE7");e.a={props:{hash:{type:String},alt:{type:String},admin:{type:Boolean,default:!1}},data:function(){return{ipfsUrl:i.b}}}},lwuJ:function(t,e,a){"use strict";e.a={props:{to:{type:String},href:{type:String},disabled:{type:Boolean},shadow:{type:Boolean},iconRight:{type:Boolean,default:!1}}}},"o/r4":function(t,e,a){"use strict";var i=a("Dd8w"),r=a.n(i),s=a("Xxa5"),n=a.n(s),o=a("exGp"),c=a.n(o),l=a("NYxO"),d=a("dNE7"),f=a("OKRJ"),p=a("VPXY"),u=a("EVoM");e.a={components:{AppAvatar:f.a,LoadingIndicator:p.a,NavBtn:u.a},data:function(){return{loading:!0}},mounted:function(){var t=c()(n.a.mark(function t(){var e,a,i,r;return n.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(this.loading=!0,e=this.$route.params,a=e.page,i=e.list,!(r=this.username)){t.next=8;break}return t.next=6,this.getUserSheets({username:r,page:a});case 6:t.next=10;break;case 8:return t.next=10,this.getSheets({page:a,type:i});case 10:this.loading=!1;case 11:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),props:{showAuthor:{type:Boolean,default:!1},username:{type:String},perPage:{type:Number,default:6},ipfsUrl:{type:String,default:d.b}},methods:r()({},Object(l.mapActions)("profile",["getUserSheets"]),Object(l.mapActions)("homepage",["getSheets"])),computed:r()({},Object(l.mapState)("profile",["userSheets","totalUserSheets"]),Object(l.mapState)("homepage",["sheets","totalSheets"]),{sheetList:function(){return this.username?this.userSheets||[]:this.sheets},showPrevBtn:function(){return this.currPage>1},currPage:function(){return Number(this.$route.params.page||1)},showNextBtn:function(){return this.currPage<this.totalSheets/this.perPage},getUsername:function(){var t=this;return function(e){return t.username||e.author&&e.author.username}},pageUrl:function(){var t=this.$route.params.list,e=void 0===t?"picks":t;return function(t){return"/"+("public"===e?"picks":e)+"/"+(t||"")}}})}},okHp:function(t,e){t.exports="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTEuOSA1MTEuOSI+CiAgPHBhdGggZD0iTTQ2OS4zIDEyOGE0Mi43IDQyLjcgMCAwIDAtNDAuNSA1NS44bC0zNC42IDIyYTUzLjMgNTMuMyAwIDAgMS03MC0xMS4yTDI5MC40IDE1M2E0Mi43IDQyLjcgMCAxIDAtNjguNyAwbC0zMy45IDQxLjVhNTMuMyA1My4zIDAgMCAxLTY5LjkgMTEuMmwtMzQuNi0yMkE0Mi43IDQyLjcgMCAxIDAgMzguOSAyMTNsMjUuMiAxNTEuM2MuOSA1LjEgNS40IDguOSAxMC42IDguOWgzNjIuNmM1LjIgMCA5LjctMy44IDEwLjUtOWwyNS4zLTE1MS4yYTQyLjcgNDIuNyAwIDAgMC0zLjgtODUuMXoiIGZpbGw9IiNmZmMxMDciLz4KICA8ZWxsaXBzZSBjeD0iMjU2IiBjeT0iMzYyLjYiIHJ4PSIxODEuMyIgcnk9IjUzLjMiIGZpbGw9IiNmZmEwMDAiLz4KICA8cGF0aCBkPSJNMjU2IDQyNi42Yy05NS40IDAtMTkyLTIyLTE5Mi02NHM5Ni42LTY0IDE5Mi02NCAxOTIgMjIgMTkyIDY0LTk2LjYgNjQtMTkyIDY0em0wLTEwNi42Yy0xMTIgMC0xNzAuNyAyNy43LTE3MC43IDQyLjZTMTQ0IDQwNS4zIDI1NiA0MDUuM3MxNzAuNy0yNy43IDE3MC43LTQyLjdTMzY4IDMyMCAyNTYgMzIweiIgZmlsbD0iI2ZmZDU0ZiIvPgo8L3N2Zz4K"},rGQh:function(t,e,a){"use strict";var i=function(){var t=this.$createElement,e=this._self._c||t;return e("section",{staticClass:"col wrapper"},[e("sheet-grid",{attrs:{"show-author":!0}})],1)};i._withStripped=!0;var r={render:i,staticRenderFns:[]};e.a=r},teV2:function(t,e,a){var i=a("x7x+");"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);a("rjj0")("09bc0e81",i,!1,{sourceMap:!1})},uNvG:function(t,e,a){"use strict";var i=a("o/r4"),r=a("3wWP"),s=!1;var n=function(t){s||a("wzOi")},o=a("VU/8")(i.a,r.a,!1,n,"data-v-3dc13ffa",null);o.options.__file="components/SheetGrid.vue",e.a=o.exports},wzOi:function(t,e,a){var i=a("R6iJ");"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);a("rjj0")("da2a59c4",i,!1,{sourceMap:!1})},"x/vM":function(t,e,a){"use strict";var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{class:{"icon-right":t.iconRight}},[!t.href&&t.to?a("nuxt-link",t._g({staticClass:"btn row row--ai-center nav-btn",class:{disabled:t.disabled,shadow:t.shadow},attrs:{to:t.to}},t.$listeners),[t._t("default")],2):t._e(),t.href?a("a",t._g({staticClass:"btn row row--ai-center nav-btn",attrs:{href:t.href}},t.$listeners),[t._t("default")],2):t._e(),t.href||t.to?t._e():a("button",t._g({staticClass:"btn row row--ai-center nav-btn",attrs:{disabled:t.disabled}},t.$listeners),[t._t("default")],2)],1)};i._withStripped=!0;var r={render:i,staticRenderFns:[]};e.a=r},"x7x+":function(t,e,a){(t.exports=a("FZ+f")(!1)).push([t.i,".grid[data-v-2a183b29]{margin-top:48px;margin-top:3rem}",""])}});