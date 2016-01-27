/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control','sap/ui/core/EnabledPropagator','sap/ui/core/IconPool','sap/ui/core/Popup'],function(q,l,C,E,I,P){"use strict";var a=C.extend("sap.m.InputBase",{metadata:{library:"sap.m",properties:{value:{type:"string",group:"Data",defaultValue:null,bindable:"bindable"},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},enabled:{type:"boolean",group:"Behavior",defaultValue:true},valueState:{type:"sap.ui.core.ValueState",group:"Appearance",defaultValue:sap.ui.core.ValueState.None},name:{type:"string",group:"Misc",defaultValue:null},placeholder:{type:"string",group:"Misc",defaultValue:null},editable:{type:"boolean",group:"Behavior",defaultValue:true},valueStateText:{type:"string",group:"Misc",defaultValue:null},showValueStateMessage:{type:"boolean",group:"Misc",defaultValue:true},textAlign:{type:"sap.ui.core.TextAlign",group:"Appearance",defaultValue:sap.ui.core.TextAlign.Initial},textDirection:{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:sap.ui.core.TextDirection.Inherit}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{change:{parameters:{value:{type:"string"}}}}}});E.call(a.prototype);I.insertFontFaceStyle();a.prototype.bShowLabelAsPlaceholder=!sap.ui.Device.support.input.placeholder;a.prototype._getPlaceholder=function(){return this.getPlaceholder();};a.prototype._setLabelVisibility=function(){if(!this.bShowLabelAsPlaceholder||!this._$label||!this.isActive()){return;}var v=this._getInputValue();this._$label.css("display",v?"none":"inline");};a.prototype._getInputValue=function(v){v=(typeof v=="undefined")?this._$input.val():v.toString();if(this.getMaxLength&&this.getMaxLength()>0){v=v.substring(0,this.getMaxLength());}return v;};a.prototype._triggerInputEvent=function(p){p=p||{};var e=new q.Event("input",p);e.originalEvent=p;e.setMark("synthetic",true);q.sap.delayedCall(0,this,function(){this.$("inner").trigger(e);});};a.prototype.init=function(){this._lastValue="";this._changeProxy=q.proxy(this.onChange,this);this.bRenderingPhase=false;this.bFocusoutDueRendering=false;};a.prototype.onBeforeRendering=function(){this.bRenderingPhase=true;if(this._bCheckDomValue){this._sDomValue=this._getInputValue();}};a.prototype.onAfterRendering=function(){this._$input=this.$("inner");if(this._bCheckDomValue&&this._sDomValue!==this._getInputValue()){this._$input.val(this._sDomValue);}this._bCheckDomValue=false;if(this.bShowLabelAsPlaceholder){this._$label=this.$("placeholder");this._setLabelVisibility();}this.bRenderingPhase=false;};a.prototype.exit=function(){this._$input=null;this._$label=null;if(this._popup){this._popup.destroy();this._popup=null;}};a.prototype.ontouchstart=function(e){e.setMarked();};a.prototype.onfocusin=function(e){this._bIgnoreNextInput=!this.bShowLabelAsPlaceholder&&sap.ui.Device.browser.msie&&sap.ui.Device.browser.version>9&&!!this.getPlaceholder()&&!this._getInputValue();this.$().toggleClass("sapMFocus",true);if(sap.ui.Device.support.touch){q(document).on('touchstart.sapMIBtouchstart',q.proxy(this._touchstartHandler,this));}this.openValueStateMessage();};a.prototype._touchstartHandler=function(e){if(e.target!=this._$input[0]){this._touchX=e.targetTouches[0].pageX;this._touchY=e.targetTouches[0].pageY;this._touchT=e.timestamp;q(e.target).on('touchmove.sapMIBtouch',q.proxy(this._touchmoveHandler,this)).on('touchend.sapMIBtouch',q.proxy(this._touchendHandler,this)).on('touchcancel.sapMIBtouch',this._removeTouchHandler);}};a.prototype._isClick=function(e){return Math.abs(e.changedTouches[0].pageX-this._touchX)<10&&Math.abs(e.changedTouches[0].pageY-this._touchY)<10&&e.timestamp-this._touchT<q.event.special.tap.tapholdThreshold;};a.prototype._touchmoveHandler=function(e){if(!this._isClick(e)){q(e.target).off('.sapMIBtouch');}};a.prototype._touchendHandler=function(e){if(this._isClick(e)){this.onChange(e);}q(e.target).off('.sapMIBtouch');};a.prototype.onfocusout=function(e){this.bFocusoutDueRendering=this.bRenderingPhase;this.$().toggleClass("sapMFocus",false);q(document).off(".sapMIBtouchstart");if(this.bRenderingPhase){return;}this.closeValueStateMessage();};a.prototype.onsapfocusleave=function(e){if(this.bFocusoutDueRendering){return;}this.onChange(e);};a.prototype.ontap=function(e){if(this.getEnabled()&&this.getEditable()&&this.bShowLabelAsPlaceholder&&e.target.id===this.getId()+"-placeholder"){this.focus();}};a.prototype.onChange=function(e){if(!this.getEditable()||!this.getEnabled()){return;}var v=this._getInputValue();if(v!==this._lastValue){this.setValue(v);v=this.getValue();this._lastValue=v;this.fireChangeEvent(v);return true;}};a.prototype.fireChangeEvent=function(v,p){var c=q.extend({value:v,newValue:v},p);this.fireChange(c);};a.prototype.onValueRevertedByEscape=function(v){this.fireEvent("liveChange",{value:v,newValue:v});};a.prototype.onsapenter=function(e){this.onChange(e);};a.prototype.onsapescape=function(e){var v=this._getInputValue();if(v!==this._lastValue){e.setMarked();e.preventDefault();this.updateDomValue(this._lastValue);this.onValueRevertedByEscape(this._lastValue);}};a.prototype.oninput=function(e){if(this._bIgnoreNextInput){this._bIgnoreNextInput=false;e.setMarked("invalid");return;}if(!this.getEditable()){e.setMarked("invalid");return;}if(document.activeElement!==e.target){e.setMarked("invalid");return;}this._bCheckDomValue=true;this._setLabelVisibility();};a.prototype.onkeydown=function(e){var k=q.sap.KeyCodes;var b=sap.ui.Device.browser;if((b.msie&&b.version<10)&&(e.which===k.DELETE||e.which===k.BACKSPACE)){this._triggerInputEvent();}};a.prototype.oncut=function(e){var b=sap.ui.Device.browser;if(b.msie&&b.version<10){this._triggerInputEvent();}};a.prototype.selectText=function(s,S){q(this.getFocusDomRef()).selectText(s,S);return this;};a.prototype.getSelectedText=function(){return q(this.getFocusDomRef()).getSelectedText();};a.prototype.setProperty=function(p,v,s){if(p=="value"){this._bCheckDomValue=false;}return C.prototype.setProperty.apply(this,arguments);};a.prototype.getFocusInfo=function(){var f=C.prototype.getFocusInfo.call(this),F=this.getFocusDomRef();q.extend(f,{cursorPos:0,selectionStart:0,selectionEnd:0});if(F){f.cursorPos=q(F).cursorPos();try{f.selectionStart=F.selectionStart;f.selectionEnd=F.selectionEnd;}catch(e){}}return f;};a.prototype.applyFocusInfo=function(f){C.prototype.applyFocusInfo.call(this,f);this.$("inner").cursorPos(f.cursorPos);this.selectText(f.selectionStart,f.selectionEnd);return this;};a.prototype.bindToInputEvent=function(c){if(this._oInputEventDelegate){this.removeEventDelegate(this._oInputEventDelegate);}this._oInputEventDelegate={oninput:c};return this.addEventDelegate(this._oInputEventDelegate);};a.prototype.updateDomValue=function(v){v=this._getInputValue(v);if(this.isActive()&&(this._getInputValue()!==v)){this._$input.val(v);this._bCheckDomValue=true;}this._setLabelVisibility();return this;};a.prototype.closeValueStateMessage=function(){if(this._popup){this._popup.close(0);}var i=q(this.getFocusDomRef());i.removeAriaDescribedBy(this.getId()+"-message");};a.prototype.getDomRefForValueStateMessage=function(){return this.getFocusDomRef();};a.prototype.iOpenMessagePopupDuration=200;a.prototype.openValueStateMessage=function(){var s=this.getValueState();if(s==sap.ui.core.ValueState.None||!this.getShowValueStateMessage()||!this.getEditable()||!this.getEnabled()){return;}var t=this.getValueStateText()||sap.ui.core.ValueStateSupport.getAdditionalText(this);var m=this.getId()+"-message";if(!this._popup){this._popup=new P(q("<span></span>")[0],false,false,false);this._popup.attachClosed(function(){q.sap.byId(m).remove();});}var d=P.Dock;var i=q(this.getFocusDomRef());var b=i.css("text-align")==="right";var c="sapMInputBaseMessage sapMInputBaseMessage"+s;var T="sapMInputBaseMessageText";var r=sap.ui.getCore().getLibraryResourceBundle("sap.m");if(s===sap.ui.core.ValueState.Success){c="sapUiInvisibleText";t="";}var $=q("<div>",{"id":m,"class":c,"role":"tooltip","aria-live":"assertive"}).append(q("<span>",{"aria-hidden":true,"class":"sapUiHidden","text":r.getText("INPUTBASE_VALUE_STATE_"+s.toUpperCase())})).append(q("<span>",{"id":m+"-text","class":T,"text":t}));this._popup.setContent($[0]);this._popup.close(0);this._popup.open(this.iOpenMessagePopupDuration,b?d.EndTop:d.BeginTop,b?d.EndBottom:d.BeginBottom,this.getDomRefForValueStateMessage(),null,null,sap.ui.Device.system.phone?true:P.CLOSE_ON_SCROLL);if(i.offset().top<$.offset().top){$.addClass("sapMInputBaseMessageBottom");}else{$.addClass("sapMInputBaseMessageTop");}i.addAriaDescribedBy(m);};a.prototype.updateValueStateClasses=function(v,o){var V=sap.ui.core.ValueState,t=this.$(),i=q(this.getFocusDomRef());if(o!==V.None){t.removeClass("sapMInputBaseState sapMInputBase"+o);i.removeClass("sapMInputBaseStateInner sapMInputBase"+o+"Inner");}if(v!==V.None){t.addClass("sapMInputBaseState sapMInputBase"+v);i.addClass("sapMInputBaseStateInner sapMInputBase"+v+"Inner");}};a.prototype.setValueState=function(v){var o=this.getValueState();this.setProperty("valueState",v,true);v=this.getValueState();if(v===o){return this;}var d=this.getDomRef();if(!d){return this;}var i=q(this.getFocusDomRef()),V=sap.ui.core.ValueState;if(v===V.Error){i.attr("aria-invalid","true");}else{i.removeAttr("aria-invalid");}this.updateValueStateClasses(v,o);if(i[0]===document.activeElement){(v==V.None)?this.closeValueStateMessage():this.openValueStateMessage();}return this;};a.prototype.setValueStateText=function(t){this.setProperty("valueStateText",t,true);this.$("message-text").text(this.getValueStateText());return this;};a.prototype.setValue=function(v){v=this.validateProperty("value",v);v=this._getInputValue(v);this.updateDomValue(v);if(v!==this.getProperty("value")){this._lastValue=v;}this.setProperty("value",v,true);return this;};a.prototype.getFocusDomRef=function(){return this.getDomRef("inner");};a.prototype.getIdForLabel=function(){return this.getId()+"-inner";};a.prototype.propagateMessages=function(n,m){if(m&&m.length>0){this.setValueState(m[0].type);this.setValueStateText(m[0].message);}else{this.setValueState(sap.ui.core.ValueState.None);this.setValueStateText('');}};a.prototype.setTooltip=function(t){var d=this.getDomRef();this._refreshTooltipBaseDelegate(t);this.setAggregation("tooltip",t,true);if(!d){return this;}var T=this.getTooltip_AsString();if(T){d.setAttribute("title",T);}else{d.removeAttribute("title");}if(sap.ui.getCore().getConfiguration().getAccessibility()){var D=this.getDomRef("describedby"),A=this.getRenderer().getDescribedByAnnouncement(this),s=this.getId()+"-describedby",b="aria-describedby",f=this.getFocusDomRef(),c=f.getAttribute(b);if(!D&&A){D=document.createElement("span");D.setAttribute("id",s);D.setAttribute("aria-hidden","true");D.setAttribute("class","sapUiInvisibleText");if(this.getAriaDescribedBy){f.setAttribute(b,(this.getAriaDescribedBy().join(" ")+" "+s).trim());}else{f.setAttribute(b,s);}d.appendChild(D);}else if(D&&!A){d.removeChild(D);var e=D.id;if(c&&e){f.setAttribute(b,c.replace(e,"").trim());}}if(D){D.textContent=A;}}return this;};a.prototype.refreshDataState=function(n,d){if(n==="value"&&d.getMessages()){this.propagateMessages(n,d.getMessages());}};return a;},true);
