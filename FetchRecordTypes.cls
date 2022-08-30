public class FetchRecordTypes {
    @AuraEnabled
    public static List<Sobject> getTaskRecordTypes(){
        List<Sobject> taskRecordTypes = [SELECT Id,Name,IsActive,CreatedById FROM RecordType WHERE SobjectType = 'Task'];
        system.debug(taskRecordTypes);
        return taskRecordTypes;
    }
    
    @AuraEnabled
    public static List<Sobject> getEventRecordTypes(){
        List<Sobject> eventRecordTypes = [SELECT Id,Name,IsActive,CreatedById FROM RecordType WHERE SobjectType = 'Event'];
        system.debug(eventRecordTypes);
        return eventRecordTypes;
    }
           
}