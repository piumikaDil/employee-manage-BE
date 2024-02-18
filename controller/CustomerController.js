import { Alert } from "../util/alert.js";
import { Validation } from "../util/validation.js";

const BASE_URL = "http://localhost:2500/employee";
const SITE_BASE_URL = "http://localhost:2500/site";
let myArray1 = [];
const selectSaveDropdown = $("#cmbSite");
const selectUpdateDropdown = $("#cmbUpSite");
export class CustomerController {
  constructor() {
    this.alert = new Alert();
    // this.regEmployeeName = /^[A-z ]{3,20}$/;
    this.regEmployeeName = /^[a-zA-Z '-]+$/;
    this.regEmployeeNIC = /^\d{12}([Vv]|[Xx])$/;
    this.regExSalary = /^[0-9]{1,}[.]?[0-9]{1,2}$/;
    this.validation = new Validation();
    this.customerValidations = [
      {
        reg: this.regEmployeeName,
        field: $("#txtEmployeeName"),
        error: "Employee Name Pattern is Wrong : A-z 3-20",
      },
      {
        reg: this.regEmployeeNIC,
        field: $("#txtEmployeeNIC"),
        error: "Employee NIC is Wrong.",
      },
    ];

    this.customerValidationsUpdate = [
      {
        reg: this.regEmployeeName,
        field: $("#txtEmployeeName"),
        error: "Employee Name Pattern is Wrong : A-z 3-20",
      },
      {
        reg: this.regEmployeeNIC,
        field: $("#txtEmployeeNIC"),
        error: "Employee NIC is Wrong.",
      },
    ];

    $(document).ready(() => {
      this.loadAllCustomers();
      this.generateCustomerID();
      this.loadSitesForDropdown();
      this.loadSitesForUpDropdown();
    });

    $("#txtCustomerId").focus();

    this.txtCustomerId = $("#txtCustomerId");
    this.txtEmployeeNIC = $("#txtEmployeeNIC");
    this.txtCustomerName = $("#txtEmployeeName");
    this.txtCustomerAddress = $("#txtCustomerAddress");
    this.txtCustomerSalary = $("#txtCustomerSalary");
    this.searchCustomerIdInput = $("#searchCustomerId");
    this.searchCustomerIdInput.on(
      "keydown",
      this.handleSearchCustomer.bind(this)
    );
    this.searchCIdDeleteInput = $("#searchCIdDelete");
    this.searchCustomerIdInput.on(
      "keydown",
      this.handleSearchCustomer.bind(this)
    );

    // $("#btnSearchCus").click(this.handleSaveCustomer.bind(this));
    $("#btnSearchCus").click(this.handleSearchCus.bind(this));
    $("#btnUclearC").click(this.clearCUTextFields.bind(this));
    $("#btnClearC").click(this.clearTextFieldsC.bind(this));
    $("#bntUpdateCustomer").click(this.handleUpdateCustomer.bind(this));
    $("#searchCusId").keypress(this.handleSearchCusIdKeyPress.bind(this));
    $("#btnSearchCus").keypress(this.handleSearchCusKeyPress.bind(this));
    $("#clearSearchCus").click(this.clearCUTextFields.bind(this));
    $("#btnCSave").click(this.employeeVallidationAndSave.bind(this));

    this.txtCustomerId.on("keydown", this.handleCustomerIdKeyDown.bind(this));
    this.txtCustomerName.on(
      "keydown",
      this.handleCustomerNameKeyDown.bind(this)
    );
    this.txtCustomerAddress.on(
      "keydown",
      this.handleCustomerAddressKeyDown.bind(this)
    );
    this.txtCustomerSalary.on(
      "keydown",
      this.handleCustomerSalaryKeyDown.bind(this)
    );
    this.searchCIdDeleteInput.on(
      "keyup",
      this.handleSearchCIdDeleteKeyUp.bind(this)
    );
    $("#btnDeleteCustomer").click(() => {
      const deleteID = this.searchCIdDeleteInput.val();
      this.alert.yesNoAlertDelete(deleteID);
    });
  }

  handleSaveCustomer() {
    const cusId = $("#txtEmployeeId").val();
    const name = $("#txtEmployeeName").val();
    const category = $("#cmbCategory").val();
    const site = $("#cmbSite").val();
    const nic = $("#txtEmployeeNIC").val();
    const ot = $("#txtEmployeeOT").val();
    const salary = $("#txtEmployeeSalary").val();
    console.log(nic);

    let dataToSend = {
      _id: cusId,
      employeeName: name,
      category: category,
      site: site,
      salary: salary,
      otRate: ot,
      nic: nic,
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
        console.log("Success:", data);
        this.generateCustomerID();
        this.loadAllCustomers();
        new Alert().saveUpdateAlert(cusId, "Saved!");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    this.clearTextFieldsC();

    // $("#txtCustomerId").val(this.generateCustomerID());
    // this.loadAllCustomers();
  }

  employeeVallidationAndSave() {
    if (!this.validation.checkValidity(this.customerValidations)) {
      alert("wardine pago!");
    } else {
      this.handleSaveCustomer();
    }
  }

  async loadSitesForDropdown() {
    fetch(SITE_BASE_URL, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("site date : ", data);
        for (let i = 0; i < data.length; i++) {
          const roomOption = document.createElement("option");
          roomOption.setAttribute("value", `${data[i]._id}`);
          roomOption.textContent = `${data[i].name}`;
          selectSaveDropdown.append(roomOption);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  async loadSitesForUpDropdown() {
    fetch(SITE_BASE_URL, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("site date : ", data);
        for (let i = 0; i < data.length; i++) {
          const roomOption = document.createElement("option");
          roomOption.setAttribute("value", `${data[i]._id}`);
          roomOption.textContent = `${data[i].name}`;
          selectUpdateDropdown.append(roomOption);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  handleUpdateCustomer() {
    let employeeId = $("#searchCustomerId").val();
    const name = $("#nameUpdate").val();
    const category = $("#cmbUpCategory").val();
    const site = $("#cmbUpsite").val();
    const nic = $("#nicUpdate").val();
    const ot = $("#otUpdate").val();
    const salary = $("#salaryUpdate").val();

    let dataToSend = {
      _id: employeeId,
      employeeName: name,
      category: category,
      site: site,
      salary: salary,
      otRate: ot,
      nic: nic,
    };

    console.log(dataToSend);
    fetch(BASE_URL + "/" + employeeId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data) {
          unSucsessUpdateAlert(employeeId);
        }
        console.log("Success:", data);
        new Alert().saveUpdateAlert(employeeId, "Updated!");
        this.loadAllCustomers();
        this.validation.aveUpdateAlert(CustomerId, "updated.");
        this.clearCUTextFields();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  async handleSearchCus() {
    let searchName = $("#searchCusId").val();
    await fetch(BASE_URL + "/" + searchName, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          $("#customerTable").empty();
          let row = `<tr><td colspan="7">No Record Found</td></tr>`;
          $("#customerTable").append(row);
        } else {
          console.log("Success employeeeeeeeeee:", data);
          $("#customerTable").empty();
          for (let i = 0; i < data.length; i++) {
            const row = `<tr><td>${data[i]._id}</td>
          <td>${data[i].employeeName}</td>
          <td>${data[i].category}</td>
          <td>${data[i].site}</td>
          <td>${data[i].nic}</td>
          <td>${data[i].salary}</td>
          <td>${data[i].otRate}</td>`;

            $("#customerTable").append(row);
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  clearCUTextFields() {
    $("#searchCusId").val("");
    this.loadAllCustomers();
  }

  handleSearchCustomer(event) {
    if (
      event.key === "Enter" &&
      check(regExCusID, this.searchCustomerIdInput.val())
    ) {
      $("#nameUpdate").focus();
    } else {
      focusText(this.searchCustomerIdInput);
    }
  }

  clearTextFieldsC() {
    $("#txtEmployeeName").val("");
    $("#cmbCategory").val("");
    $("#cmbSite").val("");
    $("#txtEmployeeNIC").val("");
    $("#txtEmployeeOT").val("");
    $("#txtEmployeeSalary").val("");

    this.validation.checkValidity(this.customerValidations);
  }

  async deleteCustomer(customerID) {
    await fetch(BASE_URL + "/" + customerID, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    this.loadAllCustomers();
  }

  async loadAllCustomersForOption() {}

  async loadAllCustomers() {
    await fetch(BASE_URL, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success employeeeeeeeeee:", data);
        $("#customerTable").empty();
        for (let i = 0; i < data.length; i++) {
          // console.log(data)
          // myArray1.push(data[i]._id);
          const row = `<tr><td>${data[i]._id}</td>
          <td>${data[i].employeeName}</td>
          <td>${data[i].category}</td>
          <td>${data[i].site}</td>
          <td>${data[i].nic}</td>
          <td>${data[i].salary}</td>
          <td>${data[i].otRate}</td>`;

          $("#customerTable").append(row);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    this.blindClickEvents();
    this.dblRowClickEventsCus();
    this.loadAllCustomersForOption();
  }

  dblRowClickEventsCus() {
    $("#customerTable>tr").on("dblclick", function () {
      let deleteCusID = $(this).children().eq(0).text();
      console.log(deleteCusID);
      const newAlert = new Alert().yesNoAlertDelete(deleteCusID);
    });
  }

  blindClickEvents() {
    $("#customerTable>tr").click(function (e) {
      let id = $(this).children().eq(0).text();
      let name = $(this).children().eq(1).text();
      let category = $(this).children().eq(2).text();
      let site = $(this).children().eq(3).text();
      let nic = $(this).children().eq(4).text();
      let salary = $(this).children().eq(5).text();
      let ot = $(this).children().eq(6).text();

      $("#searchCustomerId").val(id);
      $("#nameUpdate").val(name);
      $("#cmbUpCategory").val(category);
      $("#cmbUpsite").val(site);
      $("#nicUpdate").val(nic);
      $("#otUpdate").val(ot);
      $("#salaryUpdate").val(salary);

      $("#searchCIdDelete").val(id);
      $("#disabledNameDelete").val(name);
      $("#disabledNICDelete").val(nic);
    });
  }

  updateCustomers(CustomerId) {
    // let customer = this.searchCustomer(CustomerId);
    // if (customer != null) {
    //   const id = customer.id;
    //   const name = $("#nameUpdate").val();
    //   const address = $("#addressUpdate").val();
    //   const salary = $("#salaryUpdate").val();
    //   const res = this.db.update(new Customer(id, name, address, salary));
    //   this.loadAllCustomers();
    //   return res;
    // } else {
    //   return false;
    // }
  }

  handleSearchCusKeyPress(event) {
    if (event.which === 13) {
      this.searchCustomerIdInput.focus();
    }
  }

  handleSearchCusIdKeyPress(event) {
    if (event.which === 13) {
      $("#btnSearchCus").focus();
    }
  }

  handleCustomerIdKeyDown(event) {
    if (
      event.key === "Enter" &&
      check(this.regExCusID, this.txtCustomerId.val())
    ) {
      this.txtCustomerName.focus();
    } else {
      focusText(this.txtCustomerId);
    }
  }

  handleCustomerNameKeyDown(event) {
    if (
      event.key === "Enter" &&
      check(this.regExCusName, this.txtCustomerName.val())
    ) {
      focusText(this.txtEmployeeNIC);
    }
  }

  handleCustomerAddressKeyDown(event) {
    if (
      event.key === "Enter" &&
      check(this.regExCusAddress, this.txtCustomerAddress.val())
    ) {
      focusText(this.txtCustomerSalary);
    }
  }

  handleCustomerSalaryKeyDown(event) {
    if (
      event.key === "Enter" &&
      check(this.regExSalary, this.txtCustomerSalary.val())
    ) {
      $("#btnCSave").focus();
    }
  }

  searchCustomer(cusId) {
    // for (let customer of this.customers) {
    //   if (customer.id === cusId) {
    //     return customer;
    //   }
    // }
    // return null;
  }

  async generateCustomerID() {
    await fetch(BASE_URL, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        myArray1.length = 0;
        if (myArray1.length === 0) {
          $("#txtEmployeeId").val(1);
        }
        console.log("Success:", data);
        for (let i = 0; i < data.length; i++) {
          myArray1.push(data[i]._id);
          let lastId = Number(myArray1[myArray1.length - 1]);
          console.log(lastId);
          let newId = lastId + 1;
          $("#txtEmployeeId").val(newId);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  handleSearchCIdDeleteKeyUp(event) {
    // if (event.keyCode === 13) {
    //   let result = this.customers.find(
    //     ({ id }) => id === this.searchCIdDeleteInput.val()
    //   );
    //   console.log(result);
    //   if (result != null) {
    //     this.searchCIdDeleteInput.val(result.id);
    //     $("#disabledNameDelete").val(result.name);
    //     $("#disabledAddressDelete").val(result.address);
    //     $("#disabledSalaryDelete").val(result.salary);
    //   } else {
    //     emptyMassage();
    //     this.clearCDTextFields();
    //   }
    // }
  }
}
new CustomerController();
