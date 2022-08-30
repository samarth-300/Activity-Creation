public with sharing class fetchLookup {

    private static List<RecentlyViewed> queryRecentByType(String objectName , List<String> restrictedIds) {
        string recentItemQuery;
        recentItemQuery = 'SELECT Id FROM RecentlyViewed WHERE Type ='+ '\''+ objectName + '\'' +' AND Id NOT IN :restrictedIds LIMIT 5';
        system.debug('recentItemQuery'+recentItemQuery);
        List<SObject> recentRecords = new List<SObject>();
        recentRecords=database.query(recentItemQuery);
        system.debug('recentRecords'+recentRecords);
        return recentRecords;
 
	}
    
	@AuraEnabled(cacheable=true)
	public static String getRecent(Searchable searcher, List<String> restrictedIds) {
		Set<Id> recentIds = new Set<Id>();
		for(RecentlyViewed rv : queryRecentByType(searcher.objectName, restrictedIds)) {
			recentIds.add(rv.Id);
		}
        system.debug('recentIds'+recentIds);

		List<String> expr = new List<String>();
		expr.add('SELECT ' + String.join(searcher.fields, ', '));
		expr.add('FROM ' + String.escapeSingleQuotes(searcher.objectName));
		expr.add('WHERE Id IN (\'' + String.join(new List<Id>(recentIds), '\', \'') + '\')');
		system.debug('expr'+expr);
		return JSON.serialize(Database.query(String.join(expr, ' ')));
	}

	@AuraEnabled(cacheable=true)
	public static String getRecords(Searchable searcher, List<String> restrictedIds) { // called when text is entered in textbox
		String find = 'FIND \'' + String.escapeSingleQuotes(searcher.searchTerm) + '*\' IN ALL FIELDS';
		String returning = 'RETURNING ' + getReturning(searcher.objectName, searcher.fields);
		String limitter = 'LIMIT ' + 5;
		String query = find + ' ' + returning + ' ' + limitter; //query = FIND 'test*' IN ALL FIELDS RETURNING Account (Name, Phone, Website) LIMIT 5
        //FIND {test*} IN ALL FIELDS RETURNING Account (Name, Phone, Website) LIMIT 5 
        system.debug('--get records query'+query);
		return JSON.serialize(System.Search.query(query));
	}

	private static String getReturning(String objectName, List<String> fields) { // Returns --> Account (Name, Phone, Website)
		List<String> returning = new List<String>();
		String objectWithFields = objectName + (fields.isEmpty() ? '' : joinReturnFields(fields));
		returning.add(objectWithFields);
		return String.join(returning, ', ');
	}

	private static String joinReturnFields(List<String> fields) { // Joins the List of fields into a string
        //List<String> finalList = new List<String>();
        String tempString;
        tempString = String.escapeSingleQuotes(String.join(fields, ', ')) + ' WHERE id NOT IN :restrictedIds';
        system.debug('tempString'+tempString);
		return ' (' + tempString + ')';
	}

	public class Searchable { // wrapper class

		@AuraEnabled
		public String searchTerm {get;set;}
		@AuraEnabled
		public String objectName {get;set;}
		@AuraEnabled
		public List<String> fields {get;set;}
	}
}