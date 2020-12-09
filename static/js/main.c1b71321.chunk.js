(this["webpackJsonpsound-painting"]=this["webpackJsonpsound-painting"]||[]).push([[0],{24:function(e,t,n){},25:function(e,t,n){},45:function(e,t,n){"use strict";n.r(t);var o=n(6),s=n(3),a=n.n(s),i=n(13),c=n.n(i),r=(n(24),n(4)),d=n(58),l=n(7),u=n(16),p=n.n(u),h=(n(25),n(5)),f=n(0),v=n(1),j=n(15),m=new(function(){function e(t){Object(f.a)(this,e),this.players=new Map,this.loadedSounds=new Map,this.sceneSounds=[],Object(l.e)(this,{loadedSounds:l.f,isLoaded:l.c}),this.value=t}return Object(v.a)(e,[{key:"isLoaded",get:function(){return Object(h.a)(this.loadedSounds.values()).every((function(e){return 1==e}))}}]),Object(v.a)(e,[{key:"setSounds",value:function(e,t){var n=this;t.forEach((function(t){var o=t.file;if(!n.players.get(o)){var s="".concat(e,"/").concat(o),a=new j.a(s,(function(){console.log("loaded",o),n.loadedSounds.set(o,!0)})).toDestination();n.players.set(o,a),a.loop=!0,a.volume.value=-12,n.loadedSounds.set(o,!1)}})),this.sceneSounds=t}},{key:"playSounds",value:function(){var e=this;this.sceneSounds.forEach((function(t){var n=e.players.get(t.file);n&&"started"!==n.state&&(n.start(),e.setSoundPosition(0,0))}))}},{key:"setSoundPosition",value:function(e,t){var n=this;this.sceneSounds.forEach((function(o){var s=document.getElementById(o.file),a=Object(r.a)(o.position,2),i=a[0],c=a[1],d=o.radius;if(s){var l=Math.abs(i-e),u=Math.abs(c-t),p=Math.sqrt(Math.pow(l,2)+Math.pow(u,2)),h=1-Math.min(1,p/d),f=j.b(h),v=n.players.get(o.file);if(v){var m=.5*h+.5,g=40*h+40;s.style.opacity=m,s.style.width="".concat(g,"px"),s.style.height="".concat(g,"px"),s.style.marginLeft="".concat(-g/2,"px"),s.style.marginTop="".concat(-g/2,"px"),v.volume.value=f+-12}}}))}}]),e}()),g={name:"Impression, Sunrise",artist:"Claude Monet",key:"monet",width:1280,height:993,sounds:[{file:"foghorn.mp3",position:[.1,.15],radius:.3,color:"coral"},{file:"gulls.mp3",position:[.8,.2],radius:.5,color:"coral"},{file:"harborwaves.mp3",position:[.5,.8],radius:.7,color:"coral"}]};m.setSounds(g.key,g.sounds),Object(l.b)((function(){console.log("\ud83d\udd25",m.isLoaded)}));var b=Object(d.a)((function(){var e=Object(s.useState)(!0),t=Object(r.a)(e,2),n=t[0],a=t[1];Object(s.useEffect)((function(){var e=function(e){var t=window.innerWidth,n=window.innerHeight;m.setSoundPosition(e.pageX/t,e.pageY/n)};return window.addEventListener("mousemove",e),function(){window.removeEventListener("mousemove",e)}}),[]);var i="".concat("/listen-paintings","/").concat(g.key,"/image.jpg"),c=n?"shown":"hidden";return Object(o.jsx)("div",{className:"App",children:Object(o.jsxs)("div",{className:"image-container",children:[Object(o.jsx)("div",{className:"overlay ".concat(c),children:m.isLoaded?Object(o.jsx)("span",{className:"state loaded",onClick:function(){a(!1),m.playSounds()},children:"Start"}):Object(o.jsx)("div",{className:"state loading",children:"Loading..."})}),n?null:g.sounds.map((function(e){var t=Object(r.a)(e.position,2),n=t[0],s=t[1],a={marginLeft:"".concat(-30,"px"),marginTop:"".concat(-30,"px"),left:"".concat(100*n,"%"),top:"".concat(100*s,"%"),backgroundColor:e.color};return Object(o.jsx)("div",{id:e.file,className:"sound-icon",style:a,children:Object(o.jsx)(p.a,{style:{fontSize:48}})},e.file)})),Object(o.jsx)("img",{src:i,className:"painting",alt:""}),Object(o.jsxs)("div",{className:"image-description",children:[Object(o.jsx)("span",{className:"title",children:g.name}),Object(o.jsx)("span",{className:"artist",children:g.artist})]})]})})})),y=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,59)).then((function(t){var n=t.getCLS,o=t.getFID,s=t.getFCP,a=t.getLCP,i=t.getTTFB;n(e),o(e),s(e),a(e),i(e)}))};c.a.render(Object(o.jsx)(a.a.StrictMode,{children:Object(o.jsx)(b,{})}),document.getElementById("root")),y()}},[[45,1,2]]]);
//# sourceMappingURL=main.c1b71321.chunk.js.map