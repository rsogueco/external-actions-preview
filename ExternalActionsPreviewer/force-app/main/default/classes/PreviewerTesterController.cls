public with sharing class PreviewerTesterController {
    public PreviewerTesterController() {}

    @AuraEnabled(cacheable=false)
    public static String invokeExternalAction(String actionSelector, Map<String,String> actionParams, List<Map<String, String>> inputParams) {
        Invocable.Action action;
        if (actionParams.get('isStandard') == 'true') {
            HttpRequest standardActionRequest = createStandardIaRestRequest(actionParams.get('type'), inputParams);

            Http h = new Http();
            HttpResponse res = h.send(standardActionRequest);
            System.debug('========== res.getBody(): ' + res.getBody());
            return res.getBody();
        } else {
            action = Invocable.Action.createCustomAction(actionParams.get('type'), actionSelector);
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

    private static HttpRequest createStandardIaRestRequest(String type, List<Map<String, String>> inputParams) {
        HttpRequest req = new HttpRequest();
        String baseUrl = 'callout:ExternalActionsPreviewerNC';
        String endpoint = baseUrl + '/actions/standard/' + type;

        Map<String,String> requestParams = new Map<String,String>();
        //loop through action params and set them
        for (Map<String,String> param : inputParams) {
            requestParams.put(param.get('id'), param.get('value'));
        }
        List<Map<String,String>> requestParamList = new List<Map<String,String>>();
        requestParamList.add(requestParams);
        Map<String,List<Map<String,String>>> inputs = new Map<String,List<Map<String,String>>>();

        inputs.put('inputs', requestParamList);

        System.debug('========== endpoint: ' + endpoint);
        System.debug('========== body: ' + JSON.serialize(inputs));

        req.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionID());
        req.setHeader('Content-Type', 'application/json');
        req.setEndpoint(endpoint);
        req.setBody(JSON.serialize(inputs));
        req.setMethod('POST');

        return req;
    }
}