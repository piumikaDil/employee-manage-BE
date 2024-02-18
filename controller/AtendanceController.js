const BASE_URL = "http://localhost:2500/employee";
const ATTENDANVE_BASE_URL = "http://localhost:2500/attendance";
const btnId = "btn-mark";

export class AtendanceController {
  constructor() {
    $(document).ready(() => {
      var utc = new Date().toJSON().slice(0, 10).replace(/-/g, "/");
      this.loadAllEmployees();
    });

    $(".mark-btn").click(this.markAttendence.bind(this));
    $("#btnSearchName").click(this.handleSearchAttendance.bind(this));
    $("#clearSearchName").click(this.handleBtnClear.bind(this));
  }

  handleBtnClear() {
    $("#nameSearch").val("");
    this.loadAllEmployees();
  }

  markAttendence() {
    const $row = $("#myTable tbody tr:first");

    $("#attendanceTable>tr").click((tag) => {
      if (tag.target.localName === "button") {
        let id = $row.find("td:eq(0)").text();
        let name = $row.find("td:eq(1)").text();
        let date = $row.find("td:eq(2)").text();
        let inTime = $row.find("td:eq(3)").find("input").val();
        let outTime = $row.find("td:eq(4)").find("input").val();

        let dataToSend = {
          employeeId: id,
          employeeName: name,
          inTime: inTime,
          outTime: outTime,
          date: date,
        };

        fetch(ATTENDANVE_BASE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        })
          .then((response) => response.json())
          .then((data) => {
            new Alert().saveUpdateAlert(cusId, "Attendance Marked!");
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    });
  }

  async loadAllEmployees() {
    await fetch(BASE_URL, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        $("#attendanceTable").empty();
        for (let i = 0; i < data.length; i++) {

          const row = `<tr><td>${data[i]._id}</td>
              <td>${data[i].employeeName}</td>
              <td>${new Date().toJSON().slice(0, 10).replace(/-/g, "/")}</td>
              <td><input type="time" style="width: 110px" id="inTime"  /></td>
              <td><input type="time" style="width: 110px"  /></td>
              <td><button class="btn btn-primary mark-btn">Mark</button></td>`;

          $("#attendanceTable").append(row);
        }
        $(".mark-btn").click(() => {
          this.markAttendence();
        });
      });
  }

  async handleSearchAttendance() {
    let searchName = $("#nameSearch").val();
    await fetch(BASE_URL + "/" + searchName, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          $("#attendanceTable").empty();
          let row = `<tr><td colspan="7">No Record Found</td></tr>`;
          $("#attendanceTable").append(row);
        } else {
          console.log("Success:", data);
          $("#attendanceTable").empty();
          for (let i = 0; i < data.length; i++) {
            const row = `<tr><td>${data[i]._id}</td>
              <td>${data[i].employeeName}</td>
              <td>${new Date().toJSON().slice(0, 10).replace(/-/g, "/")}</td>
              <td><input type="time" style="width: 110px" id="inTime"  /></td>
              <td><input type="time" style="width: 110px"  /></td>
              <td><button class="btn btn-primary mark-btn">Mark</button></td>`;

            $("#attendanceTable").append(row);
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

new AtendanceController();
