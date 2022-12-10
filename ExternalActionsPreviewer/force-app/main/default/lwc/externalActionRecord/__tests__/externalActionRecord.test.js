import { createElement } from "lwc";
import ExternalActionRecord from "c/externalActionRecord";

describe("pi_ea_utils-external-action-record", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("should successfully render", () => {
    // Arrange
    const element = createElement("pi_ea_utils-external-action-record", {
      is: ExternalActionRecord
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const card = element.shadowRoot.querySelector("lightning-card");
    expect(card).not.toBeNull();
  });
});
