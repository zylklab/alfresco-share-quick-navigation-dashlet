{
  "data" :
  [
<#list matches as match>
    {
    "path"    		: "${match.displayPath}/${match.name}",
	"nodeRef" 		: "${match.nodeRef}",
	<#if match.qnamePath?contains("st:sites")>
    "fullRepoPath"  : "${match.displayPath}/${match.name}",
	"isSiteNode" 	: true
	<#else>
    "fullRepoPath"  : "${"${match.displayPath}/${match.name}"?replace(repositoryDisplayPath,"")}",
	"isSiteNode" 	: false
	</#if>
    }<#if match != matches?last>,</#if>
</#list>
  ]
}