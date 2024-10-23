import { useRef } from "react";

const VoucherModal = ({ isModalOpen, closeModal, voucherDetails }) => {
  const voucherRef = useRef();

  const handlePrint = () => {
    const printContent = voucherRef.current;
    const newWindow = window.open("", "_blank", "width=800,height=600");
    newWindow.document.write(`
      <html>
        <head>
          <title>Voucher Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>${printContent.innerHTML}</body>
      </html>
    `);
    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
    newWindow.close();
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      className="p-6 bg-white mt-20 border rounded shadow-lg w-1/3 mx-auto"
    >
      <h2 className="text-xl font-semibold mb-4 text-center border-b pb-3">
        Voucher Details
      </h2>

      {/* Printable Content */}
      <div ref={voucherRef} className="space-y-2 pt-4">
        {voucherDetails && (
          <>
            <p className="flex justify-between">
              <strong>Voucher No:</strong> {voucherDetails.voucher_no}
            </p>
            <p className="flex justify-between">
              <strong>Posted Date:</strong> {voucherDetails.posted_date}
            </p>
            <p className="flex justify-between">
              <strong>Date:</strong> {voucherDetails.date}
            </p>
            <p className="flex justify-between">
              <strong>Reference:</strong> {voucherDetails.reference}
            </p>
            <p className="flex justify-between">
              <strong>Payment Method:</strong> {voucherDetails.payment_method}
            </p>
            <p className="flex justify-between">
              <strong>Paid Amount:</strong> {voucherDetails.paid_amount}
            </p>
            <p className="flex justify-between">
              <strong>Description:</strong> {voucherDetails.desc}
            </p>
            {voucherDetails.payment_method === "Bank Transfer" && (
              <>
                <p className="flex justify-between">
                  <strong>Bank Account:</strong> {voucherDetails.bank_account}
                </p>
                <p className="flex justify-between">
                  <strong>Transaction Number:</strong>{" "}
                  {voucherDetails.transaction_number}
                </p>
              </>
            )}
            {voucherDetails.payment_method === "Cheque" && (
              <>
                <p className="flex justify-between">
                  <strong>Cheque Number:</strong> {voucherDetails.cheque_number}
                </p>
                <p className="flex justify-between">
                  <strong>Bank Account:</strong> {voucherDetails.bank_account}
                </p>
              </>
            )}
          </>
        )}
      </div>

      {/* Buttons Section (No-Print) */}
      <div className="flex items-center justify-center gap-2 mt-12 no-print">
        <button
          onClick={closeModal}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
        <button
          onClick={handlePrint}
          className="bg-green-600 text-white font-semibold px-4 py-2 rounded"
        >
          Print
        </button>
      </div>
    </Modal>
  );
};

export default VoucherModal;
