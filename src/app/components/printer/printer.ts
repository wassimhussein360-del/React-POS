export class PrintOrderComponent {
  constructor(public order: any, public isEn: boolean, public isThermal: boolean) {
    this.printOrder();
  }

  printOrder() {
    const printWindow: any = window.open("", "_blank");
    const receipt = document.getElementById(`receipt_` + this.order.id);

    // Thermal-specific styling
    const thermalStyles = `
      <style>
        body {
    
          width: ${this.isThermal ? "80mm" : "auto"}; 
          font-family: ${this.isThermal ? "'Monospace', 'Courier New', Courier" : "inherit"};
          font-size: ${this.isThermal ? "12px" : "inherit"};
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
       
          padding: 2mm;
        }
        * {
          color: ${this.isThermal ? "#000 !important" : "inherit"};
          background: ${this.isThermal ? "transparent !important" : "inherit"};
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        .thermal-hide {
          display: ${this.isThermal ? "none" : "block"};
        }
        .barcode {
          width: 100%;
          text-align: center;
          margin: 2mm 0;
        }
      </style>
    `;

    // Thermal-specific content modifications
    const thermalContent = "";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="${this.isEn ? "ltr" : "rtl"}">
        <head>
          <title>Receipt #${this.order.id}</title>
          ${
            !this.isThermal
              ? `
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/css/bootstrap.min.css">
            <link rel="stylesheet" href="path/to/your/global-styles.css">
          `
              : ""
          }
          ${thermalStyles}
               <style>
            * {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .border-collapse {
              border-collapse: separate; /* Ensures spacing works */
              border-spacing: 10px;
              width: 100%
            }
            .border-collapse th {
              color: white;
            }
            .border-collapse td,
            .border-collapse th {
              font-weight: 700;
              text-align: center;
            }
             
            .invoice-table td {
              color: rgba(128, 128, 128, 0.685);
              font-size: 0.9rem;
            }
            .invoice-table td:first-child {
              padding-right: ${this.isEn ? "1.5rem" : 0};
              padding-left: ${this.isEn ? 0 : "1.5rem"};
              font-weight: bolder;
            }
            .metadata-table div {
              border-collapse: separate; /* Ensures spacing works */
              border-spacing: 10px;
              font-size: ${this.isThermal ? "12px" : "1rem"};
             ${this.isThermal ? "" : "height: 30px;"} 
          
              display: flex;
              align-items: center;
              gap: 1rem;
            }
               .metadata-table svg{

               ${this.isThermal ? "width: 12px; height: 12px;" : ""}
               
               }
               .metadata-table aside {
               margin-bottom: 2rem
               }
          </style>
        </head>
        <body class="${this.isThermal ? "p-2" : ""}">
          ${thermalContent}
          ${receipt?.innerHTML}
          ${this.isThermal ? this.addThermalFooter() : ""}
        </body>
      </html>
    `);

    // Thermal print timing
    setTimeout(
      () => {
        printWindow.print();
        printWindow.document.close();
        printWindow.close();
      },
      this.isThermal ? 500 : 1000
    ); // Shorter delay for thermal
  }

  addThermalFooter(): string {
    return `
      <div style="text-align: center; margin-top: 5mm">
        ${""}
      </div>
      <div style="text-align: center; font-size: 10px">
        Printed at: ${new Date().toLocaleString()}
      </div>
    `;
  }
}
