const { jsPDF } = window.jspdf;

const BASE_URL = "http://localhost:2500/payment";

export class PaymentDetails {
  constructor() {
    $(document).ready(() => {
      this.loadAllPaymentDetails();
      $(".close, .modal").on("click", function () {
        $("#employersModal").hide();
      });

      $(".modal-content").on("click", function (event) {
        event.stopPropagation(); // Prevent modal from closing on click inside the modal
      });
    });
  }

  viewPaymentData() {
    $("#payDetailsTable>tr").click(async (tag) => {
      if (tag.target.localName === "button") {
        let id = $(tag.target).closest("tr").find("td:eq(0)").text();
        console.log("id", id);
        const respObj = {};

        await fetch(`${BASE_URL}/${id}`, {
          method: "GET",
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("data", data);
            const payData_employersList = $("#payData_employersList");
            payData_employersList.empty();
            data.forEach((employer) => {
              const row = `<tr>
            <td>${employer.employeeId}</td>
            <td>${employer.employeeName}</td>
            <td>${employer.netPay}</td>
            <td><button class="btn payData_print-btn btn-primary" data-employer-id="${employer.employeeId}">Print</button></td>
          </tr>`;

              payData_employersList.append(row);

              respObj[employer.employeeId] = employer;
            });

            $(".payData_print-btn").click((event) => {
              const employerId = $(event.target).data("employer-id");
              console.log("employerId", employerId);
              this.generatePDF(employerId, respObj);
            });
            $("#employersModal").css("display", "block");
          });
      }
    });
  }

  generatePDF(employerId, respObj) {
    const doc = new jsPDF("p", "mm", "a5"); // A5 paper format

    const employerData = respObj[employerId];

    const paymentDate = new Date().toJSON().slice(0, 10).replace(/-/g, "/");

    // Set Company Name
    const companyName = "ABMS";

    // Define table data
    const tableData = [
      ["Net Pay", employerData.netPay],
      ["Over Time Pay", employerData.overTimePay],
      ["Total Days", employerData.totalDays],
      ["Total Overtime", employerData.totalOvertime],
    ];

    // Add company name as plain text
    doc.text(`Company Name: ${companyName}`, 10, 10);

    // Add other details as plain text
    doc.text(`Employee ID: ${employerData.employeeId}`, 10, 20);
    doc.text(`Employee Name: ${employerData.employeeName}`, 10, 30);
    doc.text(`Payment Date: ${paymentDate}`, 10, 40);

    // Add table
    doc.autoTable({
      startY: 50, // Adjust the starting Y position for the table
      head: [["Description", "Amount"]],
      body: tableData,
    });

    doc.save(`employer_${employerId}_payment_${paymentDate}.pdf`);
  }

  async loadAllPaymentDetails() {
    await fetch(BASE_URL, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("payment details ", data);
        $("#payDetailsTable").empty();
        for (const element of data) {
          // console.log(data)
          const date = element.startDate;
          const onlyDate = date.split("T")[0];

          const endDate = element.endDate;
          const onlyEndDate = endDate.split("T")[0];
          const row = `<tr><td>${element._id}</td>
          <td>${onlyDate}</td>
          <td>${onlyEndDate}</td>
          <td>${element.siteId}</td>
          <td><button class="btn btn-warning mt-2 m-1 w-100 view-payments-btn"
              data-bs-target="#empPaymentModal"
              data-bs-toggle="modal"
              type="button">View Data</button></td>
          
          `;

          $("#payDetailsTable").append(row);
        }

        $(".view-payments-btn").click(() => {
          this.viewPaymentData();
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    this.tblClickEventsI();
    this.generateItemID();
  }
}
new PaymentDetails();
