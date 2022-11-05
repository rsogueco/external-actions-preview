public class PreviewerSelectorController {
    @AuraEnabled
    public static List<Map<Id, String>> fetchExternalActionsByName(String queryName) {
        List<Map<Id, String>> externalActions = new List<Map<Id, String>>();
        for (MarketingAppExtAction maea : [SELECT Id, ActionName FROM MarketingAppExtAction WHERE ActionName LIKE :(queryName + '%')]) {
            externalActions.add(new Map<Id, String>{
               maea.Id => maea.ActionName
            });
        }
        return externalActions;
    }

    @AuraEnabled
    public static MarketingAppExtAction fetchExternalActionDetails(Id marketingAppExtActionId) {
        MarketingAppExtAction maea = [SELECT Id, ActionSchema FROM MarketingAppExtAction WHERE Id = :marketingAppExtActionId];
        return maea;
    }
}