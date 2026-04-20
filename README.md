# SAP-MM-P2P-Simulation
Here project link : https://coderz-things.github.io/SAP-MM-P2P-Simulation/
📌 Project OverviewThis project is a web-based high-fidelity simulation of the Procure-to-Pay (P2P) life cycle, commonly managed within the SAP Materials Management (MM) module. It bridges the gap between theoretical supply chain concepts and practical ERP execution by providing a real-time link between internal requisitions and financial verification.The application allows users to experience the complete procurement journey: from identifying a need (PR) to a legally binding order (PO), physical goods receipt (MIGO), and finally, financial settlement (MIRO).

 Tech StackFrontend: HTML5 & CSS3 (Fiori-inspired UI/UX).Logic Engine: JavaScript ES6 (Procurement state management & validation).Data Persistence: LocalStorage (Ensures data integrity across browser sessions).Icons: FontAwesome 6.0.

🚀 Key FeaturesDynamic Procurement Dashboard: A centralized "Launchpad" that tracks all document statuses (Requested, Created, Goods Received, Paid).Three-Way Match Logic: An automated financial engine that validates if Purchase Order Qty = Goods Receipt Qty = Invoice Qty before authorizing payment.Automated Data Flow: Seamlessly fetch data from Purchase Requisitions (PR) to create Purchase Orders (PO), reducing manual data entry errors.Smart Status Indicators: Visual color-coded badges and real-time count updates for "Pending Payments" and "Total Documents".

🔄 The P2P WorkflowPR (ME51N): Create an internal demand for materials.
PO (ME21N): Convert the demand into a formal contract with a vendor.
MIGO (Goods Receipt): Record the physical arrival of items and update inventory status.
MIRO (Invoice): Verify the "Three-Way Match" and post the final payment.

🚧 Challenges OvercomeData Continuity: Successfully linked multiple procurement stages (PR → PO → MIGO → MIRO) using client-side localStorage to simulate a database environment.ERP Layout Design: Implemented a complex, enterprise-grade layout that remains responsive and lightweight using utility-first design principles.
