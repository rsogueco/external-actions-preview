import { createElement } from "lwc";
import ExternalActionEditor from "c/externalActionEditor";
import fetchExternalActionDetails from "@salesforce/apex/PreviewerSelectorController.fetchExternalActionDetails";
// import { subscribe, MessageContext, publish } from "lightning/messageService";
// import externalActionRecordSelected from "@salesforce/messageChannel/externalActionRecordSelected__c";

const windowSpy = jest.spyOn(global, "window", "get");
const mockWiredExternalActions = require("./data/fetchExternalActionDetailsData.json");
const mockActionSchema = require("./data/actionSchemaData.json");

jest.mock(
  "@salesforce/apex/PreviewerSelectorController.fetchExternalActionDetails",
  () => {
    const { createApexTestWireAdapter } = require("@salesforce/sfdx-lwc-jest");
    return {
      default: createApexTestWireAdapter(jest.fn())
    };
  },
  { virtual: true }
);

describe("pi_ea_utils-external-action-editor", () => {
  beforeAll(() => {
    const mockedFromTextArea = jest.fn((container) => ({
      getDoc: jest.fn(() => ({
        isClean: jest.fn(() => true),
        getValue: jest.fn(() => mockActionSchema),
        setValue: jest.fn((value) => {
          container.value = value;
          console.log("========== textarea.value:", container.value);
          container.dispatchEvent(new CustomEvent("change"));
        })
      }))
    }));
    const originalWindow = { ...window };

    windowSpy.mockImplementation(() => ({
      ...originalWindow,
      CodeMirror: {
        fromTextArea: mockedFromTextArea
      }
    }));
  });

  afterAll(() => {
    windowSpy.mockRestore();
  });

  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  async function flushPromises() {
    return Promise.resolve();
  }

  it("should render component", () => {
    // Arrange
    const element = createElement("pi_ea_utils-external-action-editor", {
      is: ExternalActionEditor
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const textarea = element.shadowRoot.querySelector(
      "textarea.codemirror-container"
    );
    expect(textarea).not.toBeNull();
  });

  // eslint-disable-next-line jest/no-commented-out-tests
  /*
  it("should handleMessage successfully", async () => {
    // Arrange
    const element = createElement("pi_ea_utils-external-action-editor", {
      is: ExternalActionEditor
    });

    // Act
    document.body.appendChild(element);
    expect(subscribe).toHaveBeenCalled();
    expect(subscribe.mock.calls[0][1]).toBe(externalActionRecordSelected);
    publish(MessageContext, externalActionRecordSelected, { recordId: "001" });
    await flushPromises();
    console.log("==========", fetchExternalActionDetails.getLastConfig());

    // Assert
    expect(fetchExternalActionDetails).toHaveBeenCalled();
  });
  */

  it("should fetchExternalActionDetails successfully", async () => {
    // Arrange
    const element = createElement("pi_ea_utils-external-action-editor", {
      is: ExternalActionEditor
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const textarea = element.shadowRoot.querySelector(
      "textarea.codemirror-container"
    );
    expect(textarea).not.toBeNull();
    expect(
      element.shadowRoot.querySelector("section.slds-is-expanded")
    ).toBeNull();

    // Act
    fetchExternalActionDetails.emit(mockWiredExternalActions);
    await flushPromises();

    // Assert
    expect(
      element.shadowRoot.querySelector("section.slds-is-expanded")
    ).not.toBeNull();
  });
});
