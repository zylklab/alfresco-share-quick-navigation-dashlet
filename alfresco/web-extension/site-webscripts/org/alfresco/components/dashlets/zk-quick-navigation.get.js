<import resource="classpath:/alfresco/templates/org/alfresco/import/alfresco-util.js">


/*
 * cargamos config dashlet
 */
var conf = new XML(config.script);

// showInBrowse
if (conf.showInBrowse[0]){
	model.showInBrowse = conf.showInBrowse[0].toString();	
}else{
	model.showInBrowse = true;
}

// showInSite
if (conf.showInSite[0]){
	model.showInSite = conf.showInSite[0].toString();	
}else{
	model.showInSite = true;
}

// repositoryRootPath
model.repositoryRootPath = AlfrescoUtil.getRootNode();
	

logger.log("Config | showInBrowse: " + model.showInBrowse);
logger.log("Config | showInSite:  " + model.showInSite);
logger.log("Config | repositoryRootPath:  " + model.repositoryRootPath);