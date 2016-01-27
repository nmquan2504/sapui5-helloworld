/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/model/BindingMode','sap/ui/base/BindingParser','sap/ui/model/Context','sap/ui/base/ManagedObject','sap/ui/model/ClientContextBinding','sap/ui/model/FilterProcessor','sap/ui/model/json/JSONModel','sap/ui/model/json/JSONListBinding','sap/ui/model/json/JSONPropertyBinding','sap/ui/model/json/JSONTreeBinding','sap/ui/model/MetaModel','./_ODataMetaModelUtils'],function(q,B,a,C,M,b,F,J,c,d,e,f,U){"use strict";var r=/^((\/dataServices\/schema\/\d+)\/(?:complexType|entityType)\/\d+)\/property\/\d+$/;var O=c.extend("sap.ui.model.odata.ODataMetaListBinding"),R=M.extend("sap.ui.model.odata._resolver",{metadata:{properties:{any:"any"}}});O.prototype.applyFilter=function(){var t=this;this.aIndices=F.apply(this.aIndices,this.aFilters.concat(this.aApplicationFilters),function(v,p){return p==="@sapui.name"?v:t.oModel.getProperty(p,t.oList[v]);});this.iLength=this.aIndices.length;};var g=f.extend("sap.ui.model.odata.ODataMetaModel",{constructor:function(m,A,o){var t=this;function l(){var D=JSON.parse(JSON.stringify(m.getServiceMetadata()));U.merge(A?A.getAnnotationsData():{},D);t.oModel=new J(D);t.oModel.setDefaultBindingMode(t.sDefaultBindingMode);}o=o||{};f.apply(this);this.oModel=null;this.mContext2Promise={};this.sDefaultBindingMode=B.OneTime;this.oLoadedPromise=o.annotationsLoadedPromise?o.annotationsLoadedPromise.then(l):new Promise(function(h,i){l();h();});this.oMetadata=m;this.oODataModelInterface=o;this.mQueryCache={};this.mQName2PendingRequest={};this.oResolver=undefined;this.mSupportedBindingModes={"OneTime":true};}});g.prototype._getObject=function(p,o){var h=o,j,s,i,E,n,P,k,l=p||"",m;if(!o||o instanceof C){l=this.resolve(p||"",o);if(!l){q.sap.log.error("Invalid relative path w/o context",p,"sap.ui.model.odata.ODataMetaModel");return null;}}if(l.charAt(0)==="/"){h=this.oModel._getObject("/");l=l.slice(1);}k="/";n=h;while(l){P=undefined;j=undefined;if(l.charAt(0)==='['){try{m=a.parseExpression(l,1);E=m.at;if(E>=0&&(l.length===E+1||l.charAt(E+1)==='/')){j=m.result;P=l.slice(0,E+1);l=l.slice(E+2);}}catch(t){if(!(t instanceof SyntaxError)){throw t;}}}if(P===undefined){E=l.indexOf("/");if(E<0){P=l;l="";}else{P=l.slice(0,E);l=l.slice(E+1);}}if(!n){if(q.sap.log.isLoggable(q.sap.log.Level.WARNING)){q.sap.log.warning("Invalid part: "+P,"path: "+p+", context: "+(o instanceof C?o.getPath():o),"sap.ui.model.odata.ODataMetaModel");}break;}if(j){if(h===o){q.sap.log.error("A query is not allowed when an object context has been given",p,"sap.ui.model.odata.ODataMetaModel");return null;}if(!Array.isArray(n)){q.sap.log.error("Invalid query: '"+k+"' does not point to an array",p,"sap.ui.model.odata.ODataMetaModel");return null;}s=k+P;P=this.mQueryCache[s];if(P===undefined){this.oResolver=this.oResolver||new R({models:this.oModel});for(i=0;i<n.length;i++){this.oResolver.bindObject(k+i);this.oResolver.bindProperty("any",j);try{if(this.oResolver.getAny()){this.mQueryCache[s]=P=i;break;}}finally{this.oResolver.unbindProperty("any");this.oResolver.unbindObject();}}}}n=n[P];k=k+P+"/";}return n;};g.prototype._mergeMetadata=function(o){var E=this.getODataEntityContainer(),m=U.getChildAnnotations(o.annotations,E.namespace+"."+E.name,true),i=E.entitySet.length,s=this.oModel.getObject("/dataServices/schema"),t=this;o.entitySets.forEach(function(h){var j,S,T=h.entityType,n=T.slice(0,T.lastIndexOf("."));if(!t.getODataEntitySet(h.name)){E.entitySet.push(JSON.parse(JSON.stringify(h)));if(!t.getODataEntityType(T)){j=t.oMetadata._getEntityTypeByName(T);S=U.getSchema(s,n);S.entityType.push(JSON.parse(JSON.stringify(j)));U.visitParents(S,o.annotations,"entityType",U.visitEntityType,S.entityType.length-1);}}});U.visitChildren(E.entitySet,m,"EntitySet",s,null,i);};g.prototype._sendBundledRequest=function(){var Q=this.mQName2PendingRequest,h=Object.keys(Q),t=this;if(!h.length){return;}this.mQName2PendingRequest={};h=h.sort();h.forEach(function(s,i){h[i]=encodeURIComponent(s);});this.oODataModelInterface.addAnnotationUrl("$metadata?sap-value-list="+h.join(",")).then(function(o){var s;t._mergeMetadata(o);for(s in Q){try{Q[s].resolve(o);}catch(E){Q[s].reject(E);}}},function(E){var s;for(s in Q){Q[s].reject(E);}});};g.prototype.bindContext=function(p,o,P){return new b(this,p,o,P);};g.prototype.bindList=function(p,o,s,h,P){return new O(this,p,o,s,h,P);};g.prototype.bindProperty=function(p,o,P){return new d(this,p,o,P);};g.prototype.bindTree=function(p,o,h,P){return new e(this,p,o,h,P);};g.prototype.destroy=function(){f.prototype.destroy.apply(this,arguments);return this.oModel.destroy.apply(this.oModel,arguments);};g.prototype.getMetaContext=function(p){var A,E,o,m,n,P,Q;function s(S){var i=S.indexOf("(");return i>=0?S.slice(0,i):S;}if(!p){return null;}P=p.split("/");if(P[0]!==""){throw new Error("Not an absolute path: "+p);}P.shift();E=this.getODataEntitySet(s(P[0]));if(!E){throw new Error("Entity set not found: "+P[0]);}P.shift();Q=E.entityType;while(P.length){o=this.getODataEntityType(Q);n=s(P[0]);A=this.getODataAssociationEnd(o,n);if(A){Q=A.type;if(A.multiplicity==="1"&&n!==P[0]){throw new Error("Multiplicity is 1: "+P[0]);}P.shift();}else{m=this.getODataProperty(o,P,true);if(P.length){throw new Error("Property not found: "+P.join("/"));}break;}}m=m||this.getODataEntityType(Q,true);return this.createBindingContext(m);};g.prototype.getODataAssociationEnd=function(E,n){var N=E?U.findObject(E.navigationProperty,n):null,A=N?U.getObject(this.oModel,"association",N.relationship):null,o=A?U.findObject(A.end,N.toRole,"role"):null;return o;};g.prototype.getODataAssociationSetEnd=function(E,n){var A,o=null,h=this.getODataEntityContainer(),N=E?U.findObject(E.navigationProperty,n):null;if(h&&N){A=U.findObject(h.associationSet,N.relationship,"association");o=A?U.findObject(A.end,N.toRole,"role"):null;}return o;};g.prototype.getODataComplexType=function(Q,A){return U.getObject(this.oModel,"complexType",Q,A);};g.prototype.getODataEntityContainer=function(A){var v=A?undefined:null;(this.oModel.getObject("/dataServices/schema")||[]).forEach(function(s,i){var j=U.findIndex(s.entityContainer,"true","isDefaultEntityContainer");if(j>=0){v=A?"/dataServices/schema/"+i+"/entityContainer/"+j:s.entityContainer[j];return false;}});return v;};g.prototype.getODataEntitySet=function(n,A){return U.getFromContainer(this.getODataEntityContainer(),"entitySet",n,A);};g.prototype.getODataEntityType=function(Q,A){return U.getObject(this.oModel,"entityType",Q,A);};g.prototype.getODataFunctionImport=function(n,A){var p=n&&n.indexOf('/')>=0?n.split('/'):undefined,E=p?U.getObject(this.oModel,"entityContainer",p[0]):this.getODataEntityContainer();return U.getFromContainer(E,"functionImport",p?p[1]:n,A);};g.prototype.getODataProperty=function(t,n,A){var i,p=Array.isArray(n)?n:[n],P=null,s;while(t&&p.length){i=U.findIndex(t.property,p[0]);if(i<0){break;}p.shift();P=t.property[i];s=t.$path+"/property/"+i;if(p.length){t=this.getODataComplexType(P.type);}}return A?s:P;};g.prototype.getODataValueLists=function(p){var h=false,m,P=p.getPath(),o=this.mContext2Promise[P],t=this;if(o){return o;}m=r.exec(P);if(!m){throw new Error("Unsupported property context with path "+P);}o=new Promise(function(i,j){var k=p.getObject(),Q,v=U.getValueLists(k);if(q.isEmptyObject(v)&&k["sap:value-list"]&&t.oODataModelInterface.addAnnotationUrl){h=true;Q=t.oModel.getObject(m[2]).namespace+"."+t.oModel.getObject(m[1]).name;t.mQName2PendingRequest[Q+"/"+k.name]={resolve:function(l){q.extend(k,((l.annotations.propertyAnnotations||{})[Q]||{})[k.name]);v=U.getValueLists(k);if(q.isEmptyObject(v)){j(new Error("No value lists returned for "+P));}else{delete t.mContext2Promise[P];i(v);}},reject:j};setTimeout(t._sendBundledRequest.bind(t),0);}else{i(v);}});if(h){this.mContext2Promise[P]=o;}return o;};g.prototype.getProperty=function(){return this._getObject.apply(this,arguments);};g.prototype.isList=function(){return this.oModel.isList.apply(this.oModel,arguments);};g.prototype.loaded=function(){return this.oLoadedPromise;};g.prototype.refresh=function(){throw new Error("Unsupported operation: ODataMetaModel#refresh");};g.prototype.setLegacySyntax=function(l){if(l){throw new Error("Legacy syntax not supported by ODataMetaModel");}};g.prototype.setProperty=function(){throw new Error("Unsupported operation: ODataMetaModel#setProperty");};return g;});
