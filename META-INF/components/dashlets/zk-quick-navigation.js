/**
 * zk-quick-navigation-dashlet
 **/
	
(function(){
	
	Alfresco.dashlet.QuickNavigation = function QuickNavigation_constructor(htmlId){
		Alfresco.dashlet.QuickNavigation.superclass.constructor.call(this, htmlId);
	}
	
	
	YAHOO.extend(Alfresco.dashlet.QuickNavigation, Alfresco.component.SimpleDocList,{

		/*****************************************************************
		 * getNavigationUrl
		 * 
		 * Generación de la URL a consumir
		 * Depende de los parámetros
		 * 		- showInBrowse: se muestra en el browse | detail
		 * 		- showInSite: se muestra en el repo | site (si es site)
		 ******************************************************************/
		getNavigationUrl: function(resultData){

			var fullRepoPath 	= resultData.fullRepoPath;
			var nodePath 		= resultData.path;
			var nodeRef 		= resultData.nodeRef;
			var isSiteNode 		= resultData.isSiteNode;
			
			Alfresco.logger.info("repoRootNode " + this.options.repositoryRootPath);
			var options = {};

			var siteId;
			if (isSiteNode && this.options.showInSite){
				siteId = nodePath.split("/")[3];
				options.site = siteId;
			}
			
			/*
			 * normalizamos fullRepoPath
			 *  - isSiteNode: quitamos los primeros 3 cachos: /Espacio de empresa/Sites/${site} (op: /documentLibrary)
			 *  - this.options.repoRootNode: no hay que hacer nada, ya se trata en servidor
			 *  - no hay repoRootNode: quitamos el primer cacho: /Company Home
			 */
			Alfresco.logger.info("nodePath: " + fullRepoPath +  " | sitePath: " + siteId);
			if (isSiteNode && siteId != undefined){
				fullRepoPath = fullRepoPath.replace(/(\/[^\/]+){1,4}/, "");
			
			// quitamos el primer cacho: /Company Home/
			}else if (this.options.repositoryRootPath == undefined || this.options.repositoryRootPath == ""){
				fullRepoPath = fullRepoPath.replace(/\/[^\/]+/, "");	
			}			
			
			fullRepoPath = encodeURIComponent(fullRepoPath);
			Alfresco.logger.info("nodePath post-norm: " + fullRepoPath);
			
			
			/* 
			 * TOFIX.
			 * ñapa: el Alfresco.util.siteURL es dependiente de contexto, así que se lo vamos a quitar, 
			 * y luego lo restauramos
			 */
			var retUrl;
			var CURRENT_SITE = Alfresco.constants.SITE; 
			Alfresco.constants.SITE = "";
			
			// -- showInBrowse
	    	if (this.options.showInBrowse){
	    		
	    		// -- showInSite
	    		if (this.options.showInSite && isSiteNode && siteId != undefined){
	    			retUrl = Alfresco.util.siteURL("documentlibrary#filter=path|" + fullRepoPath + "&page=1", options);
	    			
	    		}else{
	    			retUrl = Alfresco.util.siteURL("repository#filter=path|" + fullRepoPath + "&page=1", options);	    			
	    		}
				
	    	// -- showInDetail
			}else{
				
				// -- showInSite (ambas opciones)
				retUrl = Alfresco.util.siteURL("folder-details?nodeRef=" + nodeRef, options);	
			}
	    	
	    	// restore
	    	Alfresco.constants.SITE = CURRENT_SITE;
	    	
	    	return retUrl;
		},
	
		
		/*****************************************************************
		 * onReady
		 *****************************************************************/
		onReady: function(){
			
			var dashlet = this;
			
			//=====================
			// autocomplete
			//=====================
			
			// ds
			var ds = new YAHOO.util.XHRDataSource(Alfresco.constants.PROXY_URI + "zk-filesystemsuggestion/suggest/spaces");
			ds.responseType = YAHOO.util.XHRDataSource.TYPE_JSON;
			ds.responseSchema = {
				resultsList : "data",
			    fields: [ "path","nodeRef","fullRepoPath","isSiteNode"]
			};

			// autoComplente
			var autoComplente= new YAHOO.widget.AutoComplete(this.id + "-dataInput",this.id + "-dataContainer", ds);
			autoComplente.allowBrowserAutocomplete = false;
			autoComplente.forceSelection = true;
			autoComplente.minQueryLength = 3;
			autoComplente.maxResultsDisplayed = 10;
			autoComplente.generateRequest = function(sQuery) {
			    return "?query=" + sQuery + "&repositoryRootPath=" + dashlet.options.repositoryRootPath + "&includeSites=" + dashlet.options.showInSite;
			};

			// autoComplente - resultRender
			autoComplente.resultTypeList = false;
			autoComplente.formatResult = function(oResultData, sQuery, sResultMatch) {
				return "<a href='" + dashlet.getNavigationUrl(oResultData) + "'>" + sResultMatch + "</a>"; 
			};
			
			// autoComplente - loading
			autoComplente.dataRequestEvent.subscribe( function(ev, aArgs ){
				var ac=aArgs[0];
				var mySpan = document.getElementById(dashlet.id + '-indicator');
				mySpan.style.display = 'block';
				mySpan.innerHTML ='<span id="indicator"><img src="'  + Alfresco.constants.URL_RESCONTEXT + '/components/dashlets/loading.gif" /></span>';
			});
			
			// autoComplente - noResults
			autoComplente.dataReturnEvent.subscribe(function(sType, aArgs) {
				var aResults = aArgs[2];
				var mySpan = document.getElementById(dashlet.id + '-indicator');
				if(aResults.length == 0) {
					mySpan.style.display = 'block';
					mySpan.innerHTML = dashlet.msg('noResults');
				}else{
					mySpan.style.display = 'none';
				}
			});
			
			
			//=====================			
			// selectionHandler
			//=====================
		    var selectionHandler = function(sType, aArgs) {
		    	window.location = dashlet.getNavigationUrl(aArgs[2]);
		    };
		    
		    autoComplente.itemSelectEvent.subscribe(selectionHandler);
		}
		
	});
})();