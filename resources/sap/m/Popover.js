/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./Bar','./Button','./InstanceManager','./library','sap/ui/core/Control','sap/ui/core/Popup','sap/ui/core/delegate/ScrollEnablement','sap/ui/core/theming/Parameters'],function(q,B,a,I,l,C,P,S,b){"use strict";var c=C.extend("sap.m.Popover",{metadata:{interfaces:["sap.ui.core.PopupInterface"],library:"sap.m",properties:{placement:{type:"sap.m.PlacementType",group:"Behavior",defaultValue:sap.m.PlacementType.Right},showHeader:{type:"boolean",group:"Appearance",defaultValue:true},title:{type:"string",group:"Appearance",defaultValue:null},modal:{type:"boolean",group:"Behavior",defaultValue:false},offsetX:{type:"int",group:"Appearance",defaultValue:0},offsetY:{type:"int",group:"Appearance",defaultValue:0},showArrow:{type:"boolean",group:"Appearance",defaultValue:true},contentWidth:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},contentHeight:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},enableScrolling:{type:"boolean",group:"Misc",defaultValue:true,deprecated:true},verticalScrolling:{type:"boolean",group:"Misc",defaultValue:true},horizontalScrolling:{type:"boolean",group:"Misc",defaultValue:true},bounce:{type:"boolean",group:"Behavior",defaultValue:null}},defaultAggregation:"content",aggregations:{content:{type:"sap.ui.core.Control",multiple:true,singularName:"content"},customHeader:{type:"sap.ui.core.Control",multiple:false},subHeader:{type:"sap.ui.core.Control",multiple:false},footer:{type:"sap.ui.core.Control",multiple:false},_internalHeader:{type:"sap.m.Bar",multiple:false,visibility:"hidden"},beginButton:{type:"sap.ui.core.Control",multiple:false},endButton:{type:"sap.ui.core.Control",multiple:false}},associations:{leftButton:{type:"sap.m.Button",multiple:false,deprecated:true},rightButton:{type:"sap.m.Button",multiple:false,deprecated:true},initialFocus:{type:"sap.ui.core.Control",multiple:false},ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"}},events:{afterOpen:{parameters:{openBy:{type:"sap.ui.core.Control"}}},afterClose:{parameters:{openBy:{type:"sap.ui.core.Control"}}},beforeOpen:{parameters:{openBy:{type:"sap.ui.core.Control"}}},beforeClose:{parameters:{openBy:{type:"sap.ui.core.Control"}}}}}});c._bIE9=(sap.ui.Device.browser.internet_explorer&&sap.ui.Device.browser.version<10);c._bIOS7=sap.ui.Device.os.ios&&sap.ui.Device.os.version>=7&&sap.ui.Device.os.version<8&&sap.ui.Device.browser.name==="sf";c.prototype.init=function(){this._arrowOffsetThreshold=4;this._marginTopInit=false;this._marginTop=48;this._marginLeft=10;this._marginRight=10;this._marginBottom=10;this._$window=q(window);this._initialWindowDimensions={width:this._$window.width(),height:this._$window.height()};this.oPopup=new P();this.oPopup.setShadow(true);this.oPopup.setAutoClose(true);this.oPopup.setAnimations(q.proxy(this._openAnimation,this),q.proxy(this._closeAnimation,this));this._placements=[sap.m.PlacementType.Top,sap.m.PlacementType.Right,sap.m.PlacementType.Bottom,sap.m.PlacementType.Left,sap.m.PlacementType.Vertical,sap.m.PlacementType.Horizontal,sap.m.PlacementType.Auto,sap.m.PlacementType.VerticalPreferedTop,sap.m.PlacementType.VerticalPreferedBottom,sap.m.PlacementType.HorizontalPreferedLeft,sap.m.PlacementType.HorizontalPreferedRight];this._myPositions=["center bottom","begin center","center top","end center"];this._atPositions=["center top","end center","center bottom","begin center"];this._offsets=["0 -18","18 0","0 18","-18 0"];this._arrowOffset=18;this._followOfTolerance=32;this._scrollContentList=[sap.m.NavContainer,sap.m.Page,sap.m.ScrollContainer];this._fnAdjustPositionAndArrow=q.proxy(this._adjustPositionAndArrow,this);this._fnOrientationChange=q.proxy(this._onOrientationChange,this);this._fnFollowOf=q.proxy(function(i){var L=i.lastOfRect,r=i.currentOfRect;if(!sap.ui.Device.system.desktop||(Math.abs(L.top-r.top)<=this._followOfTolerance&&Math.abs(L.left-r.left)<=this._followOfTolerance)||(Math.abs(L.top+L.height-r.top-r.height)<=this._followOfTolerance&&Math.abs(L.left+L.width-r.left-r.width)<=this._followOfTolerance)){this.oPopup._applyPosition(this.oPopup._oLastPosition,true);}else{this.close();}},this);this.setFollowOf(true);this._oRestoreFocusDelegate={onBeforeRendering:function(){var A=q(document.activeElement),o=A.control(0);this._sFocusControlId=o&&o.getId();},onAfterRendering:function(){if(this._sFocusControlId&&!q.sap.containsOrEquals(this.getDomRef(),document.activeElement)){sap.ui.getCore().byId(this._sFocusControlId).focus();}}};var t=this;this.oPopup._applyPosition=function(p,f){var e=this.getOpenState(),o;if(e===sap.ui.core.OpenState.CLOSING||e===sap.ui.core.OpenState.CLOSED){return;}if(f){t._storeScrollPosition();}t._clearCSSStyles();var i=q.inArray(t.getPlacement(),t._placements);if(i>3&&!t._bPosCalced){t._calcPlacement();return;}t._bPosCalced=false;if(t._oOpenBy instanceof sap.ui.core.Element){p.of=t._getOpenByDomRef();}if(!p.of){q.sap.log.warning("sap.m.Popover: in function applyPosition, the openBy element doesn't have any DOM output. "+t);return;}if(!q.sap.containsOrEquals(document.documentElement,p.of)&&p.of.id){o=q.sap.byId(p.of.id);if(o){p.of=o;}else{q.sap.log.warning("sap.m.Popover: in function applyPosition, the openBy element's DOM is already detached from DOM tree and can't be found again by the same id. "+t);return;}}var r=q(p.of).rect();if(f&&t._$window.height()==t._initialWindowDimensions.height&&(r.top+r.height<=0||r.top>=t._$window.height()||r.left+r.width<=0||r.left>=t._$window.width())){t.close();return;}if(!sap.ui.Device.system.desktop){q(window).scrollLeft(0);}t._deregisterContentResizeHandler();P.prototype._applyPosition.call(this,p);t._fnAdjustPositionAndArrow();t._restoreScrollPosition();t._registerContentResizeHandler();};this.oPopup.close=function(d){var e=typeof d==="boolean";if(d!==true&&(this.touchEnabled||!this._isFocusInsidePopup())){t.fireBeforeClose({openBy:t._oOpenBy});}t._deregisterContentResizeHandler();P.prototype.close.apply(this,e?[]:arguments);t.removeDelegate(t._oRestoreFocusDelegate);if(document.activeElement&&!this.restoreFocus&&!this._bModal){document.activeElement.blur();}};};c.prototype.onBeforeRendering=function(){var n,p;if(!this._bVScrollingEnabled&&!this._bHScrollingEnabled&&this._hasSingleScrollableContent()){this._forceDisableScrolling=true;q.sap.log.info("VerticalScrolling and horizontalScrolling in sap.m.Popover with ID "+this.getId()+" has been disabled because there's scrollable content inside");}else{this._forceDisableScrolling=false;}if(!this._forceDisableScrolling){if(!this._oScroller){this._oScroller=new S(this,this.getId()+"-scroll",{horizontal:this.getHorizontalScrolling(),vertical:this.getVerticalScrolling(),zynga:false,preventDefault:false,nonTouchScrolling:"scrollbar",bounce:this.getBounce()===""?undefined:this.getBounce(),iscroll:sap.ui.Device.browser.name==="an"?"force":undefined});}}if(this._bContentChanged){this._bContentChanged=false;n=this._getSingleNavContent();p=this._getSinglePageContent();if(n&&!this.getModal()&&!sap.ui.Device.support.touch&&!q.sap.simulateMobileOnDesktop){n.attachEvent("afterNavigate",function(e){q.sap.focus(this.getDomRef());},this);}if(n||p){p=p||n.getCurrentPage();if(p&&p._getAnyHeader){this.addStyleClass("sapMPopoverWithHeaderCont");}if(n){n.attachEvent("navigate",function(e){var o=e.getParameter("to");if(o instanceof sap.m.Page){this.$().toggleClass("sapMPopoverWithHeaderCont",!!o._getAnyHeader());}},this);}}}};c.prototype.onAfterRendering=function(){var $,d,e;if(!this._marginTopInit&&this.getShowArrow()){this._marginTop=2;if(this._oOpenBy){$=q(this._getOpenByDomRef());if(!($.closest("header.sapMIBar").length>0)){d=$.closest(".sapMPage");if(d.length>0){e=d.children("header.sapMIBar");if(e.length>0){this._marginTop+=e.outerHeight();}}}this._marginTopInit=true;}}};c.prototype.exit=function(){this._deregisterContentResizeHandler();sap.ui.Device.resize.detachHandler(this._fnOrientationChange);I.removePopoverInstance(this);this.removeDelegate(this._oRestoreFocusDelegate);this._oRestoreFocusDelegate=null;if(this.oPopup){this.oPopup.detachClosed(this._handleClosed,this);this.oPopup.destroy();this.oPopup=null;}if(this._oScroller){this._oScroller.destroy();this._oScroller=null;}if(this._internalHeader){this._internalHeader.destroy();this._internalHeader=null;}if(this._headerTitle){this._headerTitle.destroy();this._headerTitle=null;}};c.prototype.openBy=function(o,s){var p=this.oPopup,e=this.oPopup.getOpenState(),f=this._getInitialFocusId(),d,i;this._adaptPositionParams();if(e===sap.ui.core.OpenState.OPEN||e===sap.ui.core.OpenState.OPENING){if(this._oOpenBy===o){return this;}else{var g=function(){p.detachClosed(g,this);this.openBy(o);};p.attachClosed(g,this);this.close();return this;}}if(!o){return this;}if(sap.ui.Device.support.touch){sap.ui.Device.resize.attachHandler(this._fnOrientationChange);}if(!this._oOpenBy||o!==this._oOpenBy){this._oOpenBy=o;}this.fireBeforeOpen({openBy:this._oOpenBy});p.attachOpened(this._handleOpened,this);p.attachClosed(this._handleClosed,this);p.setInitialFocusId(f);i=q.inArray(this.getPlacement(),this._placements);if(i>-1){d=this._getOpenByDomRef();if(!d){q.sap.log.error("sap.m.Popover id = "+this.getId()+": is opened by a control which isn't rendered yet.");return this;}this.toggleStyleClass("sapUiSizeCompact",!!q(d).closest(".sapUiSizeCompact").length);p.setAutoCloseAreas([d]);p.setContent(this);if(i<=3){p.setPosition(this._myPositions[i],this._atPositions[i],d,this._calcOffset(this._offsets[i]),"fit");}else{p._oPosition.of=d;}var t=this;var h=function(){if(p.getOpenState()===sap.ui.core.OpenState.CLOSING){if(t._sOpenTimeout){clearTimeout(t._sOpenTimeout);t._sOpenTimeout=null;}t._sOpenTimeout=setTimeout(h,150);}else{t._oPreviousFocus=P.getCurrentFocusInfo();p.open();t.addDelegate(t._oRestoreFocusDelegate,t);if(!s){I.addPopoverInstance(t);}}};h();}else{q.sap.log.error(this.getPlacement()+"is not a valid value! It can only be top, right, bottom or left");}return this;};c.prototype.close=function(){var e=this.oPopup.getOpenState(),s;if(e===sap.ui.core.OpenState.CLOSED||e===sap.ui.core.OpenState.CLOSING){return this;}this.fireBeforeClose({openBy:this._oOpenBy});this.oPopup.close(true);if(this._oPreviousFocus){s=(this._oPreviousFocus.sFocusId===sap.ui.getCore().getCurrentFocusedControlId())||(this._oPreviousFocus.sFocusId===document.activeElement.id);if(!s&&this.oPopup.restoreFocus){P.applyFocusInfo(this._oPreviousFocus);this._oPreviousFocus=null;}}return this;};c.prototype.isOpen=function(){return this.oPopup&&this.oPopup.isOpen();};c.prototype.setFollowOf=function(v){if(v){this.oPopup.setFollowOf(this._fnFollowOf);}else{this.oPopup.setFollowOf(false);}return this;};c.prototype._clearCSSStyles=function(){var s=this.getDomRef().style,$=this.$("cont"),d=$.children(".sapMPopoverScroll"),o=$[0].style,e=d[0].style,f=this.getContentWidth(),g=this.getContentHeight(),h=this.$("arrow"),w,W;if(f.indexOf("%")>0){w=this._$window.width();f=sap.m.PopupHelper.calcPercentageSize(f,w);}if(g.indexOf("%")>0){W=this._$window.height();g=sap.m.PopupHelper.calcPercentageSize(g,W);}o.width=f||"";o.height=g||"";o.maxWidth="";o.maxHeight="";s.left="";s.right="";s.top="";s.bottom="";s.width="";s.height="";e.width="";e.display="";h.removeClass("sapMPopoverArrRight sapMPopoverArrLeft sapMPopoverArrDown sapMPopoverArrUp sapMPopoverCrossArr sapMPopoverFooterAlignArr sapMPopoverHeaderAlignArr");h.css({left:"",top:""});};c.prototype._onOrientationChange=function(){var e=this.oPopup.getOpenState();if(!(e===sap.ui.core.OpenState.OPEN||e===sap.ui.core.OpenState.OPENING)){return;}this.oPopup._applyPosition(this.oPopup._oLastPosition,true);};c.prototype._handleOpened=function(){var t=this;this.oPopup.detachOpened(this._handleOpened,this);if(!sap.ui.Device.support.touch){setTimeout(function(){sap.ui.Device.resize.attachHandler(t._fnOrientationChange);},0);}var f=this._getInitialFocusId(),o=sap.ui.getCore().byId(f);q.sap.focus(o?o.getFocusDomRef():q.sap.domById(f));this.fireAfterOpen({openBy:this._oOpenBy});};c.prototype._handleClosed=function(){this.oPopup.detachClosed(this._handleClosed,this);sap.ui.Device.resize.detachHandler(this._fnOrientationChange);I.removePopoverInstance(this);this.fireAfterClose({openBy:this._oOpenBy});};c.prototype.onfocusin=function(e){var s=e.target,$=this.$();if(s.id===this.getId()+"-firstfe"){var L=$.lastFocusableDomRef();q.sap.focus(L);}else if(s.id===this.getId()+"-lastfe"){var f=$.firstFocusableDomRef();q.sap.focus(f);}};c.prototype.onkeydown=function(e){var k=q.sap.KeyCodes,K=e.which||e.keyCode,A=e.altKey;if(K===k.ESCAPE||(A&&K===k.F4)){if(e.originalEvent&&e.originalEvent._sapui_handledByControl){return;}this.close();e.stopPropagation();e.preventDefault();}};c.prototype._hasSingleNavContent=function(){return!!this._getSingleNavContent();};c.prototype._getSingleNavContent=function(){var d=this._getAllContent();while(d.length===1&&d[0]instanceof sap.ui.core.mvc.View){d=d[0].getContent();}if(d.length===1&&d[0]instanceof sap.m.NavContainer){return d[0];}else{return null;}};c.prototype._getSinglePageContent=function(){var d=this._getAllContent();while(d.length===1&&d[0]instanceof sap.ui.core.mvc.View){d=d[0].getContent();}if(d.length===1&&d[0]instanceof sap.m.Page){return d[0];}else{return null;}};c.prototype._hasSinglePageContent=function(){var d=this._getAllContent();while(d.length===1&&d[0]instanceof sap.ui.core.mvc.View){d=d[0].getContent();}if(d.length===1&&d[0]instanceof sap.m.Page){return true;}else{return false;}};c.prototype._hasSingleScrollableContent=function(){var d=this._getAllContent(),i;while(d.length===1&&d[0]instanceof sap.ui.core.mvc.View){d=d[0].getContent();}if(d.length===1){for(i=0;i<this._scrollContentList.length;i++){if(d[0]instanceof this._scrollContentList[i]){return true;}}return false;}else{return false;}};c.prototype._getOffsetX=function(){var r=sap.ui.getCore().getConfiguration().getRTL();return this.getOffsetX()*(r?-1:1);};c.prototype._getOffsetY=function(){return this.getOffsetY();};c.prototype._calcOffset=function(o){var O=this._getOffsetX(),i=this._getOffsetY();var p=o.split(" ");return(parseInt(p[0],10)+O)+" "+(parseInt(p[1],10)+i);};c.prototype._calcPlacement=function(){var p=this.getPlacement();var o=this._getOpenByDomRef();switch(p){case sap.m.PlacementType.Auto:this._calcAuto();break;case sap.m.PlacementType.Vertical:case sap.m.PlacementType.VerticalPreferedTop:case sap.m.PlacementType.VerticalPreferedBottom:this._calcVertical();break;case sap.m.PlacementType.Horizontal:case sap.m.PlacementType.HorizontalPreferedLeft:case sap.m.PlacementType.HorizontalPreferedRight:this._calcHorizontal();break;}this._bPosCalced=true;var i=q.inArray(this._oCalcedPos,this._placements);this.oPopup.setPosition(this._myPositions[i],this._atPositions[i],o,this._calcOffset(this._offsets[i]),"fit");};c.prototype._calcVertical=function(){var $=q(this._getOpenByDomRef());var h=$[0]!==undefined;var p=h?$[0].getBoundingClientRect().top:0;var i=h?$[0].getBoundingClientRect().height:0;var o=this._getOffsetY();var t=p-this._marginTop+o;var d=p+i;var e=this._$window.height()-d-this._marginBottom-o;var f=this.$().outerHeight();if(this.getPlacement()===sap.m.PlacementType.VerticalPreferedTop&&t>f+this._arrowOffset){this._oCalcedPos=sap.m.PlacementType.Top;}else if(this.getPlacement()===sap.m.PlacementType.VerticalPreferedBottom&&e>f+this._arrowOffset){this._oCalcedPos=sap.m.PlacementType.Bottom;}else if(t>e){this._oCalcedPos=sap.m.PlacementType.Top;}else{this._oCalcedPos=sap.m.PlacementType.Bottom;}};c.prototype._calcHorizontal=function(){var $=q(this._getOpenByDomRef());var h=$[0]!==undefined;var p=h?$[0].getBoundingClientRect().left:0;var i=h?$[0].getBoundingClientRect().width:0;var o=this._getOffsetX();var L=p-this._marginLeft+o;var d=p+i;var r=this._$window.width()-d-this._marginRight-o;var e=this.$().outerWidth();var R=sap.ui.getCore().getConfiguration().getRTL();if(this.getPlacement()===sap.m.PlacementType.HorizontalPreferedLeft&&L>e+this._arrowOffset){this._oCalcedPos=R?sap.m.PlacementType.Right:sap.m.PlacementType.Left;}else if(this.getPlacement()===sap.m.PlacementType.HorizontalPreferedRight&&r>e+this._arrowOffset){this._oCalcedPos=R?sap.m.PlacementType.Left:sap.m.PlacementType.Right;}else if(L>r){this._oCalcedPos=R?sap.m.PlacementType.Right:sap.m.PlacementType.Left;}else{this._oCalcedPos=R?sap.m.PlacementType.Left:sap.m.PlacementType.Right;}};c.prototype._calcAuto=function(){if(this._$window.width()>this._$window.height()){if(this._checkHorizontal()){this._calcHorizontal();}else if(this._checkVertical()){this._calcVertical();}else{this._calcBestPos();}}else{if(this._checkVertical()){this._calcVertical();}else if(this._checkHorizontal()){this._calcHorizontal();}else{this._calcBestPos();}}};c.prototype._checkHorizontal=function(){var $=q(this._getOpenByDomRef());var h=$[0]!==undefined;var p=h?$[0].getBoundingClientRect().left:0;var i=h?$[0].getBoundingClientRect().width:0;var o=this._getOffsetX();var L=p-this._marginLeft+o;var d=p+i;var r=this._$window.width()-d-this._marginRight-o;var e=this.$();var w=e.outerWidth()+this._arrowOffset;if((w<=L)||(w<=r)){return true;}};c.prototype._checkVertical=function(){var $=q(this._getOpenByDomRef());var h=$[0]!==undefined;var p=h?$[0].getBoundingClientRect().top:0;var i=h?$[0].getBoundingClientRect().height:0;var o=this._getOffsetY();var t=p-this._marginTop+o;var d=p+i;var e=this._$window.height()-d-this._marginBottom-o;var f=this.$();var H=f.outerHeight()+this._arrowOffset;if((H<=t)||(H<=e)){return true;}};c.prototype._calcBestPos=function(){var $=this.$();var h=$.outerHeight();var w=$.outerWidth();var r=sap.ui.getCore().getConfiguration().getRTL();var d=q(this._getOpenByDomRef());var H=d[0]!==undefined;var p=H?d[0].getBoundingClientRect().left:0;var i=H?d[0].getBoundingClientRect().top:0;var e=H?d[0].getBoundingClientRect().width:0;var f=H?d[0].getBoundingClientRect().height:0;var o=this._getOffsetX();var O=this._getOffsetY();var t=i-this._marginTop+O;var g=i+f;var j=this._$window.height()-g-this._marginBottom-O;var L=p-this._marginLeft+o;var k=p+e;var R=this._$window.width()-k-this._marginRight-o;var m=h*w;var A;var n;if((this._$window.height()-this._marginTop-this._marginBottom)>=h){A=h;}else{A=this._$window.height()-this._marginTop-this._marginBottom;}if((this._$window.width()-this._marginLeft-this._marginRight)>=w){n=w;}else{n=this._$window.width()-this._marginLeft-this._marginRight;}var s=(A*(L))/m;var u=(A*(R))/m;var T=(n*(t))/m;var v=(n*(j))/m;var M=Math.max(s,u);var x=Math.max(T,v);if(M>x){if(M===s){this._oCalcedPos=r?sap.m.PlacementType.Right:sap.m.PlacementType.Left;}else if(M===u){this._oCalcedPos=r?sap.m.PlacementType.Left:sap.m.PlacementType.Right;}}else if(x>M){if(x===T){this._oCalcedPos=sap.m.PlacementType.Top;}else if(x===v){this._oCalcedPos=sap.m.PlacementType.Bottom;}}else if(x===M){if(this._$window.height()>this._$window.width()){if(x===T){this._oCalcedPos=sap.m.PlacementType.Top;}else if(x===v){this._oCalcedPos=sap.m.PlacementType.Bottom;}}else{if(M===s){this._oCalcedPos=r?sap.m.PlacementType.Right:sap.m.PlacementType.Left;}else if(M===u){this._oCalcedPos=r?sap.m.PlacementType.Left:sap.m.PlacementType.Right;}}}};c.width=function(e){if(sap.ui.Device.browser.msie){var w=window.getComputedStyle(e,null).getPropertyValue("width");return Math.ceil(parseFloat(w));}else{return q(e).width();}};c.outerWidth=function(e,i){var w=c.width(e),p=parseInt(q(e).css("padding-left"),10),d=parseInt(q(e).css("padding-right"),10),f=parseInt(q(e).css("border-left-width"),10),g=parseInt(q(e).css("border-right-width"),10);var o=w+p+d+f+g;if(i){var m=parseInt(q(e).css("margin-left"),10),M=parseInt(q(e).css("margin-right"),10);o=o+m+M;}return o;};c.prototype._getPositionParams=function($,d,e,f){var o=window.getComputedStyle($[0]),g=window.getComputedStyle(e[0]),p={};p._$popover=$;p._$parent=q(this._getOpenByDomRef());p._$arrow=d;p._$content=e;p._$scrollArea=f;p._$header=$.children(".sapMPopoverHeader");p._$subHeader=$.children(".sapMPopoverSubHeader");p._$footer=$.children(".sapMPopoverFooter");p._fWindowTop=this._$window.scrollTop();p._fWindowRight=this._$window.width();p._fWindowBottom=(c._bIOS7&&sap.ui.Device.orientation.landscape&&window.innerHeight)?window.innerHeight:this._$window.height();p._fWindowLeft=this._$window.scrollLeft();p._fDocumentWidth=p._fWindowLeft+p._fWindowRight;p._fDocumentHeight=p._fWindowTop+p._fWindowBottom;p._fArrowHeight=d.outerHeight(true);p._fWidth=c.outerWidth($[0]);p._fHeight=$.outerHeight();p._fHeaderHeight=p._$header.length>0?p._$header.outerHeight(true):0;p._fSubHeaderHeight=p._$subHeader.length>0?p._$subHeader.outerHeight(true):0;p._fFooterHeight=p._$footer.length>0?p._$footer.outerHeight(true):0;p._fOffset=$.offset();p._fOffsetX=this._getOffsetX();p._fOffsetY=this._getOffsetY();p._fMarginTop=p._fWindowTop+this._marginTop;p._fMarginRight=this._marginRight;p._fMarginBottom=this._marginBottom;p._fMarginLeft=p._fWindowLeft+this._marginLeft;p._fPopoverBorderTop=parseFloat(o.borderTopWidth);p._fPopoverBorderRight=parseFloat(o.borderRightWidth);p._fPopoverBorderBottom=parseFloat(o.borderBottomWidth);p._fPopoverBorderLeft=parseFloat(o.borderLeftWidth);p._fContentMarginTop=parseFloat(g.marginTop);p._fContentMarginBottom=parseFloat(g.marginBottom);return p;};c.prototype._recalculateMargins=function(s,p){var r=sap.ui.getCore().getConfiguration().getRTL();switch(s){case sap.m.PlacementType.Left:if(r){p._fMarginLeft=p._$parent.offset().left+c.outerWidth(p._$parent[0],false)+this._arrowOffset+p._fOffsetX;}else{p._fMarginRight=p._fDocumentWidth-p._$parent.offset().left+this._arrowOffset+p._fOffsetX;}break;case sap.m.PlacementType.Right:if(r){p._fMarginRight=p._fDocumentWidth-p._$parent.offset().left+this._arrowOffset-p._fOffsetX;}else{p._fMarginLeft=p._$parent.offset().left+c.outerWidth(p._$parent[0],false)+this._arrowOffset+p._fOffsetX;}break;case sap.m.PlacementType.Top:p._fMarginBottom=p._fDocumentHeight-p._$parent.offset().top+this._arrowOffset+p._fOffsetY;break;case sap.m.PlacementType.Bottom:p._fMarginTop=p._$parent.offset().top+p._$parent.outerHeight()+this._arrowOffset+p._fOffsetY;break;}};c.prototype._getPopoverPositionCss=function(p){var L,r,t,i,d=p._fDocumentWidth-p._fOffset.left-p._fWidth,e=p._fDocumentHeight-p._fOffset.top-p._fHeight,E=(p._fDocumentWidth-p._fMarginRight-p._fMarginLeft)<p._fWidth,f=(p._fDocumentHeight-p._fMarginTop-p._fMarginBottom)<p._fHeight,o=p._fOffset.left<p._fMarginLeft,O=d<p._fMarginRight,g=p._fOffset.top<p._fMarginTop,h=e<p._fMarginBottom,R=sap.ui.getCore().getConfiguration().getRTL();if(E){L=p._fMarginLeft;r=p._fMarginRight;}else{if(o){L=p._fMarginLeft;if(R){r="";}}else if(O){r=p._fMarginRight;L="";}}if(f){t=p._fMarginTop;i=p._fMarginBottom;}else{if(g){t=p._fMarginTop;}else if(h){i=p._fMarginBottom;t="";}}return{top:t,bottom:Math.max(i-p._fWindowTop,i),left:L,right:typeof r==="number"?r-p._fWindowLeft:r};};c.prototype._getContentDimensionsCss=function(p){var o={},A=p._$content.height(),m=this._getMaxContentWidth(p),M=this._getMaxContentHeight(p);M=Math.max(M,0);o["max-width"]=m+"px";if(this.getContentHeight()||(A>M)){o["height"]=Math.min(M,A)+"px";}else{o["height"]="";o["max-height"]=M+"px";}return o;};c.prototype._getMaxContentWidth=function(p){return p._fDocumentWidth-p._fMarginLeft-p._fMarginRight-p._fPopoverBorderLeft-p._fPopoverBorderRight;};c.prototype._getMaxContentHeight=function(p){return p._fDocumentHeight-p._fMarginTop-p._fMarginBottom-p._fHeaderHeight-p._fSubHeaderHeight-p._fFooterHeight-p._fContentMarginTop-p._fContentMarginBottom-p._fPopoverBorderTop-p._fPopoverBorderBottom;};c.prototype._isScrollbarNeeded=function(p){if(p._$scrollArea.outerWidth(true)<=p._$content.width()){return true;}return false;};c.prototype._getArrowOffsetCss=function(s,p){var i,r=sap.ui.getCore().getConfiguration().getRTL();p._fWidth=c.outerWidth(p._$popover[0]);p._fHeight=p._$popover.outerHeight();if(s===sap.m.PlacementType.Left||s===sap.m.PlacementType.Right){i=p._$parent.offset().top-p._$popover.offset().top-p._fPopoverBorderTop+p._fOffsetY+0.5*(p._$parent.outerHeight(false)-p._$arrow.outerHeight(false));i=Math.max(i,this._arrowOffsetThreshold);i=Math.min(i,p._fHeight-this._arrowOffsetThreshold-p._$arrow.outerHeight());return{"top":i};}else if(s===sap.m.PlacementType.Top||s===sap.m.PlacementType.Bottom){if(r){i=p._$popover.offset().left+c.outerWidth(p._$popover[0],false)-(p._$parent.offset().left+c.outerWidth(p._$parent[0],false))+p._fPopoverBorderRight+p._fOffsetX+0.5*(c.outerWidth(p._$parent[0],false)-c.outerWidth(p._$arrow[0],false));i=Math.max(i,this._arrowOffsetThreshold);i=Math.min(i,p._fWidth-this._arrowOffsetThreshold-c.outerWidth(p._$arrow[0],false));return{"right":i};}else{i=p._$parent.offset().left-p._$popover.offset().left-p._fPopoverBorderLeft+p._fOffsetX+0.5*(c.outerWidth(p._$parent[0],false)-c.outerWidth(p._$arrow[0],false));i=Math.max(i,this._arrowOffsetThreshold);i=Math.min(i,p._fWidth-this._arrowOffsetThreshold-c.outerWidth(p._$arrow[0],false));return{"left":i};}}};c.prototype._getArrowPositionCssClass=function(s){switch(s){case sap.m.PlacementType.Left:return"sapMPopoverArrRight";case sap.m.PlacementType.Right:return"sapMPopoverArrLeft";case sap.m.PlacementType.Top:return"sapMPopoverArrDown";case sap.m.PlacementType.Bottom:return"sapMPopoverArrUp";}};c.prototype._getArrowStyleCssClass=function(p){var A=p._$arrow.position(),f=p._$footer.position(),n=this._getSingleNavContent(),o=this._getSinglePageContent(),i=0;if(n||o){o=o||n.getCurrentPage();if(o){i=o._getAnyHeader().$().outerHeight();}}if((A.top+p._fArrowHeight)<(p._fHeaderHeight+p._fSubHeaderHeight)||((A.top+p._fArrowHeight)<i)){return"sapMPopoverHeaderAlignArr";}else if((A.top<(p._fHeaderHeight+p._fSubHeaderHeight))||(A.top<i)||(p._$footer.length&&((A.top+p._fArrowHeight)>f.top)&&(A.top<f.top))){return"sapMPopoverCrossArr";}else if(p._$footer.length&&(A.top>f.top)){return"sapMPopoverFooterAlignArr";}};c.prototype._getCalculatedPlacement=function(){return this._oCalcedPos||this.getPlacement();};c.prototype._adjustPositionAndArrow=function(){var e=this.oPopup.getOpenState();if(!(e===sap.ui.core.OpenState.OPEN||e===sap.ui.core.OpenState.OPENING)){return;}var $=this.$(),d=this.$("arrow"),f=this.$("cont"),g=this.$("scroll"),s=this._getCalculatedPlacement(),p=this._getPositionParams($,d,f,g);this._recalculateMargins(s,p);$.css(this._getPopoverPositionCss(p));f.css(this._getContentDimensionsCss(p));if(this._isScrollbarNeeded(p)){g.css("display","block");}if(this.getShowArrow()){d.removeAttr("style");d.css(this._getArrowOffsetCss(s,p));d.addClass(this._getArrowPositionCssClass(s));if(s===sap.m.PlacementType.Left||s===sap.m.PlacementType.Right){var A=this._getArrowStyleCssClass(p);if(A){d.addClass(A);}}$.css("overflow","visible");}this._afterAdjustPositionAndArrowHook();};c.prototype._adaptPositionParams=function(){if(this.getShowArrow()){this._marginLeft=10;this._marginRight=10;this._marginBottom=10;this._arrowOffset=18;this._offsets=["0 -18","18 0","0 18","-18 0"];this._myPositions=["center bottom","begin center","center top","end center"];this._atPositions=["center top","end center","center bottom","begin center"];}else{this._marginTop=0;this._marginLeft=0;this._marginRight=0;this._marginBottom=0;this._arrowOffset=0;this._offsets=["0 0","0 0","0 0","0 0"];this._myPositions=["begin bottom","begin center","begin top","end center"];this._atPositions=["begin top","end center","begin bottom","begin center"];}};c.prototype._afterAdjustPositionAndArrowHook=function(){};c.prototype._isPopupElement=function(d){var p=this._getOpenByDomRef();return!!(q(d).closest(sap.ui.getCore().getStaticAreaRef()).length)||!!(q(d).closest(p).length);};c.prototype._getAnyHeader=function(){if(this.getCustomHeader()){return this.getCustomHeader();}else{if(this.getShowHeader()){this._createInternalHeader();return this._internalHeader;}}};c.prototype._createInternalHeader=function(){if(!this._internalHeader){var t=this;this._internalHeader=new B(this.getId()+"-intHeader");this.setAggregation("_internalHeader",this._internalHeader);this._internalHeader.addEventDelegate({onAfterRendering:function(){t._restoreFocus();}});return true;}else{return false;}};c.prototype._openAnimation=function(r,R,o){var t=this;if(c._bIE9){o();}else{var O=false,T=function(){if(O||!t.oPopup||t.oPopup.getOpenState()!==sap.ui.core.OpenState.OPENING){return;}r.unbind("webkitTransitionEnd transitionend");o();O=true;};setTimeout(function(){r.addClass("sapMPopoverTransparent");r.css("display","block");setTimeout(function(){r.bind("webkitTransitionEnd transitionend",T);r.removeClass("sapMPopoverTransparent");setTimeout(function(){T();},300);},sap.ui.Device.browser.firefox?50:0);},0);}};c.prototype._closeAnimation=function(r,R,f){if(c._bIE9){f();}else{var d=false,t=function(){if(d){return;}r.unbind("webkitTransitionEnd transitionend");setTimeout(function(){f();d=true;r.removeClass("sapMPopoverTransparent");},0);};r.bind("webkitTransitionEnd transitionend",t).addClass("sapMPopoverTransparent");setTimeout(function(){t();},300);}};c.prototype._getInitialFocusId=function(){return this.getInitialFocus()||this._getFirstVisibleButtonId()||this._getFirstFocusableContentElementId()||this.getId();};c.prototype._getFirstVisibleButtonId=function(){var o=this.getBeginButton(),e=this.getEndButton(),s="";if(o&&o.getVisible()){s=o.getId();}else if(e&&e.getVisible()){s=e.getId();}return s;};c.prototype._getFirstFocusableContentElementId=function(){var r="";var $=this.$("cont");var f=$.firstFocusableDomRef();if(f){r=f.id;}return r;};c.prototype._restoreFocus=function(){if(this.isOpen()){var f=this._getInitialFocusId(),o=sap.ui.getCore().byId(f);q.sap.focus(o?o.getFocusDomRef():q.sap.domById(f));}};c.prototype._registerContentResizeHandler=function(){if(!this._sResizeListenerId){this._sResizeListenerId=sap.ui.core.ResizeHandler.register(this.getDomRef("scroll"),this._fnOrientationChange);}};c.prototype._deregisterContentResizeHandler=function(){if(this._sResizeListenerId){sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);this._sResizeListenerId=null;}};c.prototype._storeScrollPosition=function(){var $=this.$("cont");if($.length>0){this._oScrollPosDesktop={x:$.scrollLeft(),y:$.scrollTop()};}};c.prototype._restoreScrollPosition=function(){if(!this._oScrollPosDesktop){return;}var $=this.$("cont");if($.length>0){$.scrollLeft(this._oScrollPosDesktop.x).scrollTop(this._oScrollPosDesktop.y);this._oScrollPosDesktop=null;}};c.prototype._repositionOffset=function(){var e=this.oPopup.getOpenState(),L,p;if(!(e===sap.ui.core.OpenState.OPEN)){return this;}L=this.oPopup._oLastPosition;p=q.inArray(this.getPlacement(),this._placements);if(p===-1){return this;}if(p<4){L.offset=this._calcOffset(this._offsets[p]);this.oPopup._applyPosition(L);}else{this._calcPlacement();}return this;};c.prototype._getOpenByDomRef=function(){if(!this._oOpenBy){return null;}if(this._oOpenBy instanceof sap.ui.core.Element){return(this._oOpenBy.getPopupAnchorDomRef&&this._oOpenBy.getPopupAnchorDomRef())||this._oOpenBy.getFocusDomRef();}else{return this._oOpenBy;}};c.prototype.setPlacement=function(p){this.setProperty("placement",p,true);var i=q.inArray(p,this._placements);if(i<=3){this._oCalcedPos=p;}return this;};c.prototype.setTitle=function(t){if(t){this.setProperty("title",t,true);if(this._headerTitle){this._headerTitle.setText(t);}else{this._headerTitle=new sap.m.Title(this.getId()+"-title",{text:this.getTitle(),level:"H1"});this._createInternalHeader();this._internalHeader.addContentMiddle(this._headerTitle);}}return this;};c.prototype.setBeginButton=function(o){var O=this.getBeginButton();if(O===o){return this;}this._createInternalHeader();this._beginButton=o;if(o){if(O){this._internalHeader.removeAggregation("contentLeft",O,true);}this._internalHeader.addAggregation("contentLeft",o);}else{this._internalHeader.removeContentLeft(O);}return this;};c.prototype.setEndButton=function(o){var O=this.getEndButton();if(O===o){return this;}this._createInternalHeader();this._endButton=o;if(o){if(O){this._internalHeader.removeAggregation("contentRight",O,true);}this._internalHeader.insertAggregation("contentRight",o,1,true);this._internalHeader.invalidate();}else{this._internalHeader.removeContentRight(O);}return this;};c.prototype.setLeftButton=function(v){if(!(v instanceof a)){v=sap.ui.getCore().byId(v);}this.setBeginButton(v);return this.setAssociation("leftButton",v);};c.prototype.setRightButton=function(v){if(!(v instanceof a)){v=sap.ui.getCore().byId(v);}this.setEndButton(v);return this.setAssociation("rightButton",v);};c.prototype.setShowHeader=function(v){if(v===this.getShowHeader()||this.getCustomHeader()){return this;}if(v){if(this._internalHeader){this._internalHeader.$().show();}}else{if(this._internalHeader){this._internalHeader.$().hide();}}this.setProperty("showHeader",v,true);return this;};c.prototype.setModal=function(m,M){if(m===this.getModal()){return this;}this.oPopup.setModal(m,q.trim("sapMPopoverBLayer "+M||""));this.setProperty("modal",m,true);return this;};c.prototype.setOffsetX=function(v){this.setProperty("offsetX",v,true);return this._repositionOffset();};c.prototype.setOffsetY=function(v){this.setProperty("offsetY",v,true);return this._repositionOffset();};c.prototype.setEnableScrolling=function(v){this.setHorizontalScrolling(v);this.setVerticalScrolling(v);var o=this.getEnableScrolling();if(o===v){return this;}this.setProperty("enableScrolling",v,true);return this;};c.prototype.setVerticalScrolling=function(v){this._bVScrollingEnabled=v;var o=this.getVerticalScrolling();if(o===v){return this;}this.$().toggleClass("sapMPopoverVerScrollDisabled",!v);this.setProperty("verticalScrolling",v,true);if(this._oScroller){this._oScroller.setVertical(v);}return this;};c.prototype.setHorizontalScrolling=function(v){this._bHScrollingEnabled=v;var o=this.getHorizontalScrolling();if(o===v){return this;}this.$().toggleClass("sapMPopoverHorScrollDisabled",!v);this.setProperty("horizontalScrolling",v,true);if(this._oScroller){this._oScroller.setHorizontal(v);}return this;};c.prototype.getScrollDelegate=function(){return this._oScroller;};c.prototype.setAggregation=function(A,o,s){if(A==="beginButton"||A==="endButton"){var f="set"+A.charAt(0).toUpperCase()+A.slice(1);return this[f](o);}else{return C.prototype.setAggregation.apply(this,arguments);}};c.prototype.getAggregation=function(A,d){if(A==="beginButton"||A==="endButton"){var s=this["_"+A];return s||d||null;}else{return C.prototype.getAggregation.apply(this,arguments);}};c.prototype.destroyAggregation=function(A,s){if(A==="beginButton"||A==="endButton"){var d=this["_"+A];if(d){d.destroy();this["_"+A]=null;}return this;}else{return C.prototype.destroyAggregation.apply(this,arguments);}};c.prototype.invalidate=function(o){if(this.isOpen()){C.prototype.invalidate.apply(this,arguments);}return this;};c.prototype.addAggregation=function(A,o,s){if(A==="content"){this._bContentChanged=true;}C.prototype.addAggregation.apply(this,arguments);};c.prototype._getAllContent=function(){return this.getContent();};return c;},true);
