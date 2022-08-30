public with sharing class CreateTask {

    @AuraEnabled
    public static Task saveTask(string taskInputs){
       
       	   Wrapper taskInputParameters = (Wrapper) JSON.deserialize(taskInputs, Wrapper.class);
           
           Task t= new Task();
           t.Subject = taskInputParameters.Subject;
           t.ActivityDate =	taskInputParameters.ActivityDate;
           t.Description = taskInputParameters.Description;
    
        insert t;
        return t;
    }
    public Class Wrapper { 
        @AuraEnabled public String Subject; 
        @AuraEnabled public integer Phone; 
        @AuraEnabled public date ActivityDate; 
        @AuraEnabled public String Description;
       
    }
}