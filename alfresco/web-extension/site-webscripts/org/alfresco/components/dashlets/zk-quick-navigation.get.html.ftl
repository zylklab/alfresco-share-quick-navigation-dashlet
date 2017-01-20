<#assign id = args.htmlid>
<#assign jsid = args.htmlid?js_string>
<script type="text/javascript">//<![CDATA[
(function(){
	var dashlet = new Alfresco.dashlet.QuickNavigation("${jsid}").setOptions({
	
		// browse vs. detail view
		"showInBrowse":${showInBrowse},
		
		 // site documetlibrary vs. repo
		"showInSite":${showInSite},

		// root-node del repository (si hay definido)
		"repositoryRootPath": "${repositoryRootPath}"
		
	}).setMessages(${messages});
	
	YAHOO.util.Event.on("${id}" + "-dataInput", "focusout", function(e) {
    	YAHOO.log("target: " + e.target.id);
    	YAHOO.util.Dom.get("${id}" + "-indicator").style.display = 'none';
	});
})();
//]]></script>

<div class="dashlet zk-quick-navigation-dashlet">
   <div class="title" id="${id}-title">${msg("header")}</div>
   
   <div class="body" style="height:50px; scroll:none;">
      <div id="${id}-container" style="margin:10px; width: 90%; z-index:99;">
   			<input id="${id}-dataInput" type="text" size="90" style="width:90%;"/>
    		<div id="${id}-dataContainer">
    			<div id="${id}-indicator" style="display:none; padding-top:0.5em;"></div>
    		</div>
	  </div>
   </div>
</div>