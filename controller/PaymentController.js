import { Alert } from "../util/alert.js";

const BASE_URL = "http://localhost:2500/payment";
const SITE_BASE_URL = "http://localhost:2500/site";
const selectDropdown = $("#cmbSelectSite");

export class Paymentcotroller {
  constructor() {
    $(document).ready(() => {
      this.loadSitesForDropdown();
    });

    $("#btnPay").click(this.handleSavePayment.bind(this));
  }

  async loadSitesForDropdown() {
    fetch(SITE_BASE_URL, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          const roomOption = document.createElement("option");
          roomOption.setAttribute("value", `${data[i]._id}`);
          roomOption.textContent = `${data[i].name}`;
          selectDropdown.append(roomOption);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  handleSavePayment() {
    const startDate = $("#txtStartDate").val();
    const endDate = $("#txtEndDate").val();
    const siteId = $("#cmbSelectSite").val();

    let dataToSend = {
      startDate: startDate,
      endDate: endDate,
      siteId: siteId,
    };

    fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.error) {
          new Alert().saveUpdateAlert("Details Stored!");
          this.clearTextFields();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  clearTextFields() {
    $("#txtStartDate").val("");
    $("#txtEndDate").val("");
    $("#cmbSelectSite").val("");
  }
}
new Paymentcotroller();
