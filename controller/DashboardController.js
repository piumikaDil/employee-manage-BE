// import { DB } from "../db/DB.js";
// import { Item } from "../model/Item.js";
// import { Order } from "../model/Order.js";
// import { Customer } from "../model/Customer.js";
import { CustomerController } from "./CustomerController.js";

export default class DashboardController {
  constructor() {
    // this.db = new DB();
    this.loadDashboard();
    $(document).ready(function () {
      $("#HomeSection").css("display", "none");
      $("#CustomerSection").css("display", "block");
      $("#ItemSection").css("display", "none");
      $("#OrderSection").css("display", "none");
      $("#OrderDetails").css("display", "none");
      $("#PaymentSection").css("display", "none");
      $("#PayDetailsSection").css("display", "none");
    });

    $("#homeBtn").click(function () {
      $("#HomeSection").css("display", "block");
      $("#CustomerSection").css("display", "none");
      $("#ItemSection").css("display", "none");
      $("#OrderSection").css("display", "none");
      $("#OrderDetails").css("display", "none");
      $("#PayDetailsSection").css("display", "none");
    });

    $("#customerBtn").click(function () {
      $("#HomeSection").css("display", "none");
      $("#CustomerSection").css("display", "block");
      $("#ItemSection").css("display", "none");
      $("#OrderSection").css("display", "none");
      $("#OrderDetails").css("display", "none");
      $("#PaymentSection").css("display", "none");
      $("#PayDetailsSection").css("display", "none");
    });

    $("#itemBtn").click(function () {
      $("#HomeSection").css("display", "none");
      $("#CustomerSection").css("display", "none");
      $("#ItemSection").css("display", "block");
      $("#OrderSection").css("display", "none");
      $("#OrderDetails").css("display", "none");
      $("#PaymentSection").css("display", "none");
      $("#PayDetailsSection").css("display", "none");
    });

    $("#orderBtn").click(function () {
      $("#HomeSection").css("display", "none");
      $("#CustomerSection").css("display", "none");
      $("#ItemSection").css("display", "none");
      $("#OrderSection").css("display", "block");
      $("#OrderDetails").css("display", "none");
      $("#PayDetailsSection").css("display", "none");
       $("#PaymentSection").css("display", "none");
    });

    $("#paymentBtn").click(function () {
      $("#HomeSection").css("display", "none");
      $("#CustomerSection").css("display", "none");
      $("#ItemSection").css("display", "none");
      $("#OrderSection").css("display", "none");
      $("#PaymentSection").css("display", "block");
       $("#PayDetailsSection").css("display", "none");
    });

     $("#paymentDetailsBtn").click(function () {
       $("#HomeSection").css("display", "none");
       $("#CustomerSection").css("display", "none");
       $("#ItemSection").css("display", "none");
       $("#OrderSection").css("display", "none");
       $("#PaymentSection").css("display", "none");
       $("#PayDetailsSection").css("display", "block");
     });
  }

  async loadDashboard() {
    // console.log(this.db);
    // const allOrders = await this.db.getAll(new Order());
    // const allCustomers = await this.db.getAll(new Customer());
    // const allItems = await this.db.getAll(new Item());
    // let revenue = 0;
    // allOrders.forEach((order) => {
    //   revenue += Number(order.subTotal);
    // });
    // console.log(allOrders);

    // $("#totalOrders").text(allOrders.length);
    // $("#totalCustomers").text(allCustomers.length);
    // $("#totalItems").text(allItems.length);
    // $("#totalRevenue").text(`LKR ${revenue}`);

    // this.loadChart(allOrders.length, revenue);
  }

  async loadChart(orderCount, revenue) {
    var ctx = document.getElementById("revenueChart").getContext("2d");
    var performanceChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Jun"],
        datasets: [
          {
            label: "Sales",
            data: [revenue],
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    var ctx = document.getElementById("performanceChart").getContext("2d");
    var performanceChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Jun"],
        datasets: [
          {
            label: "Revenue",
            data: [orderCount],
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}

new DashboardController();
