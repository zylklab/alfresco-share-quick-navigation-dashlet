// args
logger.log("-- args");
logger.log(args);
var query = args.query;
var repositoryRootPath = args.repositoryRootPath;
var includeSites = args.includeSites;

/* 
si repositoryRootPath

  si includeSites
  >> query en repositoryRootPath + sites
  
  no includeSites
  >> query en repositoryRootPath

no repositoryRootPath
  >> query generica
 */


//virtual XPATH no soportado
if (repositoryRootPath == "alfresco://company/home"){
	repositoryRootPath = "/app:company_home";
  
/*
 * quitamos la ultima "/" si tiene
 * el repository tampoco es que funcine bien el último "/" pero por proteger el ws
 */
}else{
  repositoryRootPath = repositoryRootPath.replace(/\/$/g,"");
}


//query
var query = "+@cm\\:name:\"" + query + "*\" " +
			"+TYPE:\\{http\\://www.alfresco.org/model/content/1.0\\}folder " +
			"-TYPE:\\{http\\://www.alfresco.org/model/wcmappmodel/1.0\\}webfolder " +
              
            // blacklist
			"-TYPE:\"cm:systemfolder\" -TYPE:\"fm:forums\" -TYPE:\"fm:forum\" -TYPE:\"fm:topic\" -TYPE:\"fm:post\" " +
			"AND -PATH:\"/app:company_home/st:sites/cm:surf-config//*\" " +
            "AND -PATH:\"/app:company_home/st:sites/*/cm:surf-config//*\"" +
            "AND -PATH:\"/app:company_home/st:sites/cm:swsdp\" " +
            "AND -PATH:\"/app:company_home/st:sites/cm:swsdp//*\"";

if (repositoryRootPath != undefined && repositoryRootPath != ""){
	if (includeSites == 'true'){     
		query = query + " AND ((PATH:\"" + repositoryRootPath + "//*\" OR PATH:\"" + repositoryRootPath + "\") OR (PATH:\"/app:company_home/st:sites//*\"))";
	}else{
		query = query + " AND (PATH:\"" + repositoryRootPath + "//*\" OR PATH:\"" + repositoryRootPath + "\")";
	}
}
logger.log("-- query\n" + query);

// search
model.matches = search.luceneSearch(query)

/* 
 * repositoryPath; generamos repositoryDisplayPath para generar el fullPath
 * fullPath = path - repositoryDisplayPath
 */
model.repositoryDisplayPath = "";
if (repositoryRootPath != undefined && repositoryRootPath != ""){	
    var repoRootNode = search.luceneSearch("PATH:\"" + repositoryRootPath + "\"");
	if (repoRootNode != ""){
		repoRootNode = repoRootNode[0];
		model.repositoryDisplayPath = repoRootNode.displayPath + "/" + repoRootNode.name;  
		logger.log("\n-- repositoryDisplayPath: " + model.repositoryDisplayPath);
	}
}