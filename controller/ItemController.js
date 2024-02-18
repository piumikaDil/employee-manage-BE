// import { DB } from "../db/DB.js";
// import { Item } from "../model/Item.js";
import { Alert } from "../util/alert.js";
import { Validation } from "../util/validation.js";
const BASE_URL = "http://localhost:2500/site";

let myArray1 = [];

export class ItemController {
  constructor() {
    this.validation = new Validation();
    // this.alert = new Alert();
    $("#txtItemsId").focus();
    $(document).ready(() => {
      this.loadAllItems();
      this.generateItemID();
    });
    $("#btnViewAllItems").click(this.handleViewAll.bind(this));
    $("#btnISave").click(this.siteValidationAndSave.bind(this));
    $("#txtItemsId,#txtItemName,#txtItemQty,#txtItemPrice").on(
      "keydown",
      this.handleItemFieldKeyDown.bind(this)
    );
    $("#txtItemsId,#txtItemName,#txtItemQty,#txtItemPrice").on(
      "keyup",
      this.handleItemFieldKeyUp.bind(this)
    );
    $("#txtItemsId,#txtItemName,#txtItemQty,#txtItemPrice").on(
      "blur",
      this.handleItemFieldBlur.bind(this)
    );
    $("#txtItemsId").on("keydown", this.handleItemIdKeyDown.bind(this));
    $("#txtItemName").on("keydown", this.handleItemNameKeyDown.bind(this));
    $("#txtItemQty").on("keydown", this.handleItemQtyKeyDown.bind(this));
    $("#txtItemPrice").on("keydown", this.handleItemPriceKeyDown.bind(this));
    $("#btnUclearI").click(this.clearUTextFields.bind(this));
    $("#searchDItemId").keyup(this.handleSearchDItemIdKeyUp.bind(this));
    $("#btnDeleteItems").click(() => {
      const dleteId = $("#searchDItemId").val();
      new Alert().yesNoAlertSiteDelete(dleteId);
    });
    $("#btnSearchItem").click(this.handleSearchItem.bind(this));
    $("#ItemIdSearch").keypress(this.handleItemIdSearchKeyPress.bind(this));
    $("#btnSearchItem").keypress(this.handleSearchItemKeyPress.bind(this));
    $("#clearSearchItem").click(this.handleClearSearchItem.bind(this));
    $("#btnUpdateItem").click(this.siteValidationAndUpdate.bind(this));
    $("#btnClearI").click(this.clearTextFieldsI.bind(this));
    $("#searchItemId,#updateItemName,#updateItemQty,#updateItemPrice").on(
      "keydown",
      this.handleUpdateItemFieldKeyDown.bind(this)
    );
    $("#searchItemId,#updateItemName,#updateItemQty,#updateItemPrice").on(
      "keyup",
      this.handleUpdateItemFieldKeyUp.bind(this)
    );
    $("#searchItemId,#updateItemName,#updateItemQty,#updateItemPrice").on(
      "blur",
      this.handleUpdateItemFieldBlur.bind(this)
    );
    $("#searchItemId").on("keydown", this.handleSearchItemIdKeyDown.bind(this));
    $("#updateItemName").on(
      "keydown",
      this.handleUpdateItemNameKeyDown.bind(this)
    );
    $("#updateItemQty").on(
      "keydown",
      this.handleUpdateItemQtyKeyDown.bind(this)
    );
    $("#updateItemPrice").on(
      "keydown",
      this.handleUpdateItemPriceKeyDown.bind(this)
    );
    $("#btnDclearI").click(this.clearCDTextFields.bind(this));
  }

  regExSiteName = /^[a-zA-Z0-9 ]+$/;
  regExSiteAddress = /^[a-zA-Z0-9\s.,'-]+$/;
  regExContact = /^(?:\+?94|0)(?:\d{9}|\d{2}-\d{7}|\d{3}-\d{6})+$/;

  itemsValidations = [
    {
      reg: this.regExSiteName,
      field: $("#txtSiteName"),
      error: "Wrong name.",
    },
    {
      reg: this.regExSiteAddress,
      field: $("#txtSiteAddress"),
      error: "Wrong address.",
    },
    {
      reg: this.regExContact,
      field: $("#txtCNO"),
      error: "Wrong number.",
    },
  ];

  itemsValidationsUpdate = [
    {
      reg: this.regExSiteName,
      field: $("#updateSiteName"),
      error: "Wrong name.",
    },
    {
      reg: this.regExSiteAddress,
      field: $("#updateSiteAddress"),
      error: "Wrong address.",
    },
    {
      reg: this.regExContact,
      field: $("#updateSiteContact"),
      error: "Wrogn number.",
    },
  ];

  handleViewAll() {
    this.loadAllItems();
    this.generateItemID();
  }

  dblRowClickEventsItem() {
    $("#ItemTable>tr").on("dblclick", function () {
      let deleteItemID = $(this).children().eq(0).text();
      yesNoAlertIDelete(deleteItemID);
    });
  }

  handleSaveItem() {
    const siteId = $("#txtSiteId").val();
    const name = $("#txtSiteName").val();
    const address = $("#txtSiteAddress").val();
    const conNo = $("#txtCNO").val();

    let dataToSend = {
      _id: siteId,
      name: name,
      address: address,
      contactNo: conNo,
    };

    console.log(dataToSend);

    fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success site:", data);
        // if(data.error.status === 500) {
        //   new Alert().unSucsessUpdateAlert("Save unsuccessfully...")
        // }
        new Alert().saveUpdateAlert(siteId, "Saved!");
        this.loadAllItems();
        this.clearTextFieldsI();
        this.generateItemID();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  siteValidationAndSave() {
    if (this.validation.checkValidity(this.itemsValidations)) {
      this.handleSaveItem();
    }
  }

  siteValidationAndUpdate() {
    if (this.validation.checkValidity(this.itemsValidationsUpdate)){
      this.handleUpdateItem();
    }
  }
  async loadAllItems() {
    await fetch(BASE_URL, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        $("#ItemTable").empty();
        for (let i = 0; i < data.length; i++) {
          // console.log(data)

          const row = `<tr><td>${data[i]._id}</td>
          <td>${data[i].name}</td>
          <td>${data[i].address}</td>
          <td>${data[i].contactNo}</td>
          `;

          $("#ItemTable").append(row);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    this.tblClickEventsI();
    this.generateItemID();
  }

  async generateItemID() {
    await fetch(BASE_URL, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        myArray1.length = 0;

        if (myArray1.length === 0) {
          $("#txtSiteId").val(1);
        }

        console.log("Success:", data);
        for (let i = 0; i < data.length; i++) {
          myArray1.push(data[i]._id);
          let lastId = Number(myArray1[myArray1.length - 1]);
          console.log("iteml id : ", lastId);
          let newId = lastId + 1;
          $("#txtSiteId").val(newId);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  async handleSearchItem() {
    let searchName = $("#ItemIdSearch").val();
    await fetch(BASE_URL + "/" + searchName, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          $("#ItemTable").empty();
          let row = `<tr><td colspan="4">No Record Found</td></tr>`;
          $("#ItemTable").append(row);
        } else {
          console.log("Success:", data);
          $("#ItemTable").empty();
          for (let i = 0; i < data.length; i++) {
            const row = `<tr><td>${data[i]._id}</td>
          <td>${data[i].name}</td>
          <td>${data[i].address}</td>
          <td>${data[i].contactNo}</td>`;

            $("#ItemTable").append(row);
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  handleUpdateItem() {
    let siteId = $("#searchSiteId").val();
    const name = $("#updateSiteName").val();
    const address = $("#updateSiteAddress").val();
    const contactNo = $("#updateSiteContact").val();

    let dataToSend = {
      _id: siteId,
      name: name,
      address: address,
      contactNo: contactNo,
    };

    console.log(dataToSend);

    fetch(BASE_URL + "/" + siteId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data) {
          unSucsessUpdateAlert(siteId);
        }
        console.log("Success:", data);
        new Alert().saveUpdateAlert(siteId, "Updated!");
        this.loadAllItems();
        this.clearUTextFields();
        this.validation.aveUpdateAlert(CustomerId, "updated.");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  handleItemFieldKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
    }
  }

  handleItemFieldKeyUp(event) {
    this.validation.checkValidity(this.itemsValidations);
  }

  handleItemFieldBlur(event) {
    this.validation.checkValidity(this.itemsValidations);
  }

  handleItemIdKeyDown(event) {
    if (event.key === "Enter" && check(this.regExItemCode, $("#txtItemsId"))) {
      $("#txtItemName").focus();
    } else {
      focusText($("#txtItemsId"));
    }
  }

  handleItemNameKeyDown(event) {
    if (event.key === "Enter" && check(this.regExItemName, $("#txtItemName"))) {
      focusText($("#txtItemQty"));
    }
  }

  handleItemQtyKeyDown(event) {
    if (event.key === "Enter" && check(this.regExItemPrice, $("#txtItemQty"))) {
      focusText($("#txtItemPrice"));
    }
  }

  handleItemPriceKeyDown(event) {
    if (
      event.key === "Enter" &&
      check(this.regExItemQtyOnHand, $("#txtItemPrice"))
    ) {
      if (event.which === 13) {
        $("#btnISave").focus();
      }
    }
  }

  handleSearchDItemIdKeyUp(event) {
    this.validation.checkValidity(this.itemsValidationsUpdate);
  }

  handleDeleteItems() {
    let deleteIID = $("#searchDItemId").val();
    yesNoAlertIDelete(deleteIID);
  }

  clearCDTextFields() {
    searchDItemId.value = "";
    DItemName.value = "";
    DItemQty.value = "";
    DItemPrice.value = "";
    this.clearUTextFields();
  }

  clearUTextFields() {
    $("#searchSiteId").val("");
    $("#updateSiteName").val("");
    $("#updateSiteAddress").val("");
    $("#updateSiteContact").val("");
    this.validation.checkValidity(this.itemsValidationsUpdate);
  }

  handleItemIdSearchKeyPress(event) {
    if (event.which === 13) {
      $("#ItemIdSearch").focus();
    }
  }

  handleSearchItemKeyPress(event) {
    if (event.which === 13) {
      $("#btnSearchItem").focus();
    }
  }

  handleClearSearchItem() {
    $("#ItemIdSearch").val("");
    this.loadAllItems();
    this.clearUTextFields();
    this.clearDTextFields();
  }

  clearTextFieldsI() {
    $("#txtSiteName").val("");
    $("#txtSiteAddress").val("");
    $("#txtCNO").val("");
    this.validation.checkValidity(this.itemsValidations);
  }

  handleUpdateItemFieldKeyDown(event) {}

  handleUpdateItemFieldKeyUp(event) {
    if (event.key === "Tab") {
      event.preventDefault();
    }
  }

  handleUpdateItemFieldBlur(event) {
    this.validation.checkValidity(this.itemsValidationsUpdate);
  }

  handleSearchItemIdKeyDown(event) {
    if (event.keyCode === 13) {
      let resultI = items.find(
        ({ code }) => code === $("#searchDItemId").val()
      );

      if (resultI != null) {
        $("#searchDItemId").val(resultI.code);
        $("#DItemName").val(resultI.name);
        $("#DItemQty").val(resultI.qty);
        $("#DItemPrice").val(resultI.price);
      } else {
        emptyMassage();
        this.clearCDTextFields();
      }
    }
  }

  handleUpdateItemNameKeyDown(event) {
    if (
      event.key === "Enter" &&
      check(this.regExItemName, $("#updateSiteName"))
    ) {
      focusText($("#updateSiteAddress"));
    }
  }

  handleUpdateItemQtyKeyDown(event) {
    if (
      event.key === "Enter" &&
      check(this.regExItemPrice, $("#updateSiteAddress"))
    ) {
      focusText($("#updateItemPrice"));
    }
  }

  handleUpdateItemPriceKeyDown(event) {
    if (
      event.key === "Enter" &&
      check(this.regExItemQtyOnHand, $("#updateItemPrice"))
    ) {
      if (event.which === 13) {
        $("#btnUpdateItem").focus();
      }
    }
  }

  async deleteItems(itemID) {
    await fetch(BASE_URL + "/" + itemID, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.loadAllItems();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  loadAllItemsForOption() {
    $("#cmbItemCode").empty();
    for (let item of this.items) {
      $("#cmbItemCode").append(`<option>${item.code}</option>`);
    }
  }

  tblClickEventsI() {
    $("#ItemTable>tr").click(function () {
      let code = $(this).children().eq(0).text();
      let name = $(this).children().eq(1).text();
      let address = $(this).children().eq(2).text();
      let contact = $(this).children().eq(3).text();

      $("#searchSiteId").val(code);
      $("#updateSiteName").val(name);
      $("#updateSiteAddress").val(address);
      $("#updateSiteContact").val(contact);

      $("#searchDItemId").val(code);
      $("#DItemName").val(name);
      $("#DItemQty").val(address);
      $("#DItemPrice").val(contact);
    });
  }
}

new ItemController();
