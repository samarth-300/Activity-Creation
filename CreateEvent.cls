public with sharing class CreateEvent {
    @AuraEnabled
    public static Event saveEvent(string eventInputs){
       
       	   Wrapper eventInputParameters = (Wrapper) JSON.deserialize(eventInputs, Wrapper.class);
           
           Event e= new Event();
           e.Location = eventInputParameters.Location;
           e.Subject = eventInputParameters.Subject;
           e.EndDateTime = eventInputParameters.EndDateTime;
           e.StartDateTime = eventInputParameters.StartDateTime;
           e.Description = eventInputParameters.Description;
    
        insert e;
        return e;
    }
    public Class Wrapper { // Custom class created for saveTask parameter
        @AuraEnabled public String Location; 
        @AuraEnabled public Datetime StartDateTime; 
        @AuraEnabled public string Subject; 
        @AuraEnabled public Datetime EndDateTime;
        @AuraEnabled public String Description; 
    }
}