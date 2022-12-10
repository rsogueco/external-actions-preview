import { createElement } from "lwc";
import ExternalActionSelector from "c/externalActionSelector";

describe("pi_ea_utils-external-action-selector", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("should successfully render", () => {
    // Arrange
    const element = createElement("pi_ea_utils-external-action-selector", {
      is: ExternalActionSelector
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const div = element.shadowRoot.querySelector("div");
    expect(div).not.toBeNull();
  });
});
