import{_ as ae,c as d,j as _,r as c,k as I,o as oe,l as ue,b as p,d as v,u as n,h as $,n as h,t as j,f as y,w as ne,v as se,e as ie,F as R,g as G,p as re,i as de}from"./index.6d9d14bd.js";import{p as ce,s as fe}from"./label.da2d5a9e.js";import pe from"./Texter.02f1ef6f.js";const H=s=>(re("data-v-1db86628"),s=s(),de(),s),ve=["checked"],ye=["hide-outline","only"],me=["value","placeholder","tabindex","disabled"],be=H(()=>y("p-tip",null,"\u641C\u7D22",-1)),he={key:0,selected:""},Se=H(()=>y("p-tip",null,"\u5DF2\u9009",-1)),ke=["selected","title","onClick"],ge=H(()=>y("p-tip",null,"\u672A\u9009",-1)),we=["selected","title","onClick"],Ve={__name:"Combo",props:{modelValue:{type:[String,Number,Boolean,Array,Object],default:""},disable:{type:Boolean,default:!1},text:{type:String,default:""},default:{type:[String,Number,Boolean],default:""},...ce,disabling:{type:[String,Boolean],default:!1},readonly:{type:[String,Boolean],default:!1},place:{type:[Number,String],default:""},tab:{type:[Number,String],default:0},align:{type:String,default:null},list:{type:Array,default:()=>[]},filter:{type:[String,Boolean,Function],default:!1},multiSelect:{type:[String,Boolean],default:!1},keyShow:{type:[String,Function,Array],default:"text"},keyValue:{type:String,default:"value"}},emits:["update:modelValue","update:disable","update:value"],setup(s,{emit:S}){const a=s,k=d(()=>a.multiSelect==="array"?a.multiSelect:_(a.multiSelect)),f=d(()=>_(a.disabling)),J=d(()=>_(a.readonly)),{label_:x,labelWidth_:K,labelAlign_:P}=fe(a,f),Q=d(()=>({width:K.value,textAlign:P.value})),m=c(f.value&&a.modelValue===!1?a.default:a.modelValue),i=c(f.value?a.modelValue===!1:a.disable);I(()=>a.disable,e=>{f.value||(i.value=e)}),I(()=>a.modelValue,e=>{f.value?e===!1?i.value=!0:(i.value=!1,m.value=e):m.value=e}),I([m,i],([e,t],[l,o])=>{f.value?(e!=l&&S("update:value",e),t!=o&&S("update:disable",t),S("update:modelValue",t===!0?!1:e)):S("update:modelValue",e)});const C=d(()=>{const e=m.value;return k.value?e instanceof Array?e.filter(t=>t):e?String(e).split(",").map(t=>t.trim()).filter(t=>t):[]:[e]}),A=(e,t)=>t===null||typeof t>"u"||typeof t=="boolean"?e===t:e==t,X=e=>{const t=C.value,l=a.keyValue=="$$"?e:e[a.keyValue];return k.value?!!~t.findIndex(o=>A(o,l)):A(t[0],l)},B=c(""),L=d(()=>typeof a.filter=="function"?a.filter:_(a.filter)),Y=(e,t,l)=>{var r,V,z;const o=(V=(r=B.value)==null?void 0:r.trim())!=null?V:"",u=L.value;return u?typeof u=="function"?u(o,e.data,e,t,l):(z=b(e.data))==null?void 0:z.includes(o):!0},M=d(()=>a.list),D=d(()=>M.value.map(e=>({selected:X(e),data:e}))),W=d(()=>D.value.filter(e=>e.selected)),Z=d(()=>D.value.filter(e=>!e.selected).filter((e,t,l)=>Y(e,t,l)).filter(e=>{var t;return!((t=e.data)!=null&&t.hidden)})),b=(e,t=0)=>{var o,u;const l=a.keyShow instanceof Array?a.keyShow[t]:a.keyShow;return typeof l=="function"?(o=l(e))!=null?o:"":(u=e==null?void 0:e[l])!=null?u:""},O=d(()=>C.value.map(e=>b(M.value.find(t=>A(a.keyValue=="$$"?t:t==null?void 0:t[a.keyValue],e)),1)).join("\u3001")),g=c(null),E=c(null),w=c(null),T=c(""),U=c(""),N=c(!1),ee=()=>{N.value=!0},te=()=>{N.value=!1},F=c(!1),le=()=>{w.value.state.isShown?w.value.hide():(T.value="auto",U.value=window.getComputedStyle(g.value).width,w.value.show(),F.value=!F.value)},q=e=>{var t,l;if(k.value){e.selected=!!e.selected;const o=a.keyValue=="$$"?e.data:(t=e.data)==null?void 0:t[a.keyValue],u=new Set(C.value);u.has(o)?u.delete(o):u.add(o);const r=[...u];k.value=="array"?m.value=r:m.value=r.join(",")}else e.selected=!0,m.value=a.keyValue=="$$"?e.data:(l=e.data)==null?void 0:l[a.keyValue]};return oe(()=>{w.value=ue(g.value,{placement:"bottom-start",content:E.value,allowHTML:!0,interactive:!0,animation:"",duration:[0,0],offset:[0,-2],trigger:"manual",maxWidth:"unset",onShow:ee,onHide:te})}),(e,t)=>(p(),v("comp-combo",null,[n(f)?(p(),v("p-disabling",{key:0,checked:e.brop(!i.value),onClick:t[0]||(t[0]=l=>i.value=!i.value)},null,8,ve)):$("",!0),n(x)?(p(),v("p-label",{key:1,style:h(n(Q)),onClick:t[1]||(t[1]=l=>n(f)&&(i.value=!i.value))},j(n(x)),5)):$("",!0),y("p-value",{ref_key:"domValue",ref:g,"hide-outline":e.brop(N.value),only:e.brop(!n(f)&&!n(x)),onClick:t[2]||(t[2]=l=>!i.value&&!n(J)&&le())},[y("input",{ref_key:"domValue",ref:g,value:n(O),style:h({textAlign:s.align}),placeholder:s.place,tabindex:s.tab,readonly:!0,disabled:i.value},null,12,me)],8,ye),y("p-drop",{ref_key:"domDrop",ref:E,tabindex:"0",style:h({width:T.value,minWidth:U.value})},[ne(y("p-filter",null,[be,ie(pe,{modelValue:B.value,"onUpdate:modelValue":t[3]||(t[3]=l=>B.value=l),filter:"","focus-switch":F.value},null,8,["modelValue","focus-switch"])],512),[[se,n(L)]]),n(W).length?(p(),v("p-options",he,[Se,(p(!0),v(R,null,G(n(W),(l,o)=>{var u,r;return p(),v("p-option",{key:`combo-option-${o}`,selected:e.brop(l.selected),title:(r=(u=l.data)==null?void 0:u[a.keyValue])!=null?r:b(l.data),style:h({textAlign:s.align}),onClick:V=>q(l)},j(b(l.data)),13,ke)}),128))])):$("",!0),y("p-options",null,[ge,n(D).length?$("",!0):(p(),v("p-option",{key:0,style:h({textAlign:s.align}),disabled:""},"\u65E0\u53EF\u7528\u9009\u9879",4)),(p(!0),v(R,null,G(n(Z),(l,o)=>{var u,r;return p(),v("p-option",{key:`combo-option-${o}`,selected:e.brop(l.selected),title:(r=(u=l.data)==null?void 0:u[a.keyValue])!=null?r:b(l.data),style:h({textAlign:s.align}),onClick:V=>q(l)},j(b(l.data)),13,we)}),128))])],4)]))}},Ce=ae(Ve,[["__scopeId","data-v-1db86628"]]);export{Ce as default};
