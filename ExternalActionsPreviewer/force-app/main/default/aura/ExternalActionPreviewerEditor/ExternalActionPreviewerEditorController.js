({
  init: function () {},

  handleRecordChange: function (cmp, event, helper) {
    if (event.getType() === "force:recordChange") {
      cmp.set("v.recordChangeDatetime", Date.now());
    }
  },

  handleSchemaSave: function (component, event, helper) {
    component.find("recordHandler").saveRecord(
      $A.getCallback(function (saveResult) {
        // use the recordUpdated event handler to handle generic logic when record is changed
        if (saveResult.state === "SUCCESS" || saveResult.state === "DRAFT") {
          // handle component related logic in event handler
        } else if (saveResult.state === "INCOMPLETE") {
          console.log("User is offline, device doesn't support drafts.");
        } else if (saveResult.state === "ERROR") {
          console.log(
            "Problem saving record, error: " + JSON.stringify(saveResult.error)
          );
        } else {
          console.log(
            "Unknown problem, state: " +
              saveResult.state +
              ", error: " +
              JSON.stringify(saveResult.error)
          );
        }
      })
    );
  }
});
