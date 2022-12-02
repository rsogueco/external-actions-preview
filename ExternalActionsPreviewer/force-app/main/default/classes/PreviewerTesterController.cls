public with sharing class PreviewerTesterController {
    public PreviewerTesterController() {}

    @AuraEnabled(cacheable=false)
    public static String invokeExternalAction(String actionSelector, Map<String,String> actionParams, List<Map<String, String>> inputParams) {
        Invocable.Action action;
        if (actionParams.get('isStandard') == 'true') {
            action = Invocable.Action.createStandardAction(actionType);
        } else {
            action = Invocable.Action.createCustomAction(actionParams.get('type'), actionSelector);
        }
        //loop through action params and set them
        for (Map<String,String> param : inputParams) {
            action.setInvocationParameter(param.get('id'), param.get('value'));
        }
        String returnMessage;
        try {
            List<Invocable.Action.Result> results = action.invoke();
            if (results.size() > 0) {
                if (results[0].isSuccess()) {
                    System.debug('Result is: ' + results[0].getOutputParameters().get('output'));
                    returnMessage = 'Success!';
                } else {
                    System.debug('Result Errors are: ' + results[0].getErrors()[0].getMessage());
                    returnMessage = results[0].getErrors()[0].getMessage();
                }
        }
               
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return returnMessage;
    }
}