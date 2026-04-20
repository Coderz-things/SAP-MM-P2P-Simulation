// --- 1. PURCHASE REQUISITION (PR) LOGIC ---
function savePR() {
    const item = document.getElementById('item').value;
    const prNumber = "PR-" + (Math.floor(Math.random() * 900) + 100);
    
    let prList = JSON.parse(localStorage.getItem('sap_prs')) || [];
    prList.push({ 
        id: prNumber, 
        item: item, 
        status: 'Requested', 
        date: new Date().toLocaleDateString() 
    });
    
    localStorage.setItem('sap_prs', JSON.stringify(prList));
    alert("SAP PR Created Successfully: " + prNumber);
    window.location.href = "../index.html";
}

// --- 2. PURCHASE ORDER (PO) LOGIC ---
function savePO() {
    const vendor = document.getElementById('vendor').value;
    const qty = document.getElementById('qty').value;
    const poNumber = "PO-" + (Math.floor(Math.random() * 900) + 100);

    let orders = JSON.parse(localStorage.getItem('sap_orders')) || [];
    orders.push({ 
        id: poNumber, 
        vendor: vendor, 
        quantity: parseInt(qty), 
        status: "Created", 
        date: new Date().toLocaleDateString() 
    });

    localStorage.setItem('sap_orders', JSON.stringify(orders));
    alert("SAP PO Generated: " + poNumber);
    window.location.href = "../index.html";
}

// --- 3. MIGO: Goods Receipt Logic (SMART LOGIC ADDED) ---
function findPO() {
    let poNum = document.getElementById('searchPO').value;
    let orders = JSON.parse(localStorage.getItem('sap_orders')) || [];
    let found = orders.find(o => o.id === poNum);

    if (found) {
        document.getElementById('gr-section').style.display = 'block';
        document.getElementById('v-name').innerText = found.vendor;
        document.getElementById('v-qty').innerText = found.quantity;
    } else {
        alert("PO Number not found!");
    }
}

function processGR() {
    let poNum = document.getElementById('searchPO').value;
    let recQty = document.getElementById('receivedQty').value;
    let orders = JSON.parse(localStorage.getItem('sap_orders')) || [];

    let updatedOrders = orders.map(o => {
        if (o.id === poNum) {
            o.receivedQty = recQty;
            // Smart Logic: Check for mismatch
            if (parseInt(recQty) < parseInt(o.quantity)) {
                o.status = "Partially Received"; // Kam maal aaya
            } else {
                o.status = "Goods Received"; // Pura maal aaya
            }
        }
        return o;
    });

    localStorage.setItem('sap_orders', JSON.stringify(updatedOrders));
    alert("Goods Receipt Posted! Inventory Updated.");
    window.location.href = "../index.html";
}

// --- 4. MIRO: Invoice Verification Logic ---
function verifyInvoice() {
    let poNum = document.getElementById('miroSearch').value;
    let orders = JSON.parse(localStorage.getItem('sap_orders')) || [];
    let found = orders.find(o => o.id === poNum);

    if(found) {
        document.getElementById('miro-details').style.display = 'block';
        document.getElementById('p-qty').innerText = found.quantity;
        document.getElementById('g-qty').innerText = found.receivedQty || 0;

        let msg = document.getElementById('status-msg');
        if(found.status === "Goods Received" && parseInt(found.quantity) === parseInt(found.receivedQty)) {
            msg.innerText = "3-Way Match Successful!";
            msg.style.color = "green";
            document.getElementById('pay-btn').style.display = "block";
        } else {
            msg.innerText = "Match Failed: GR pending or Quantity mismatch!";
            msg.style.color = "red";
            document.getElementById('pay-btn').style.display = "none";
        }
    } else {
        alert("PO Number not found in system.");
    }
}

// --- 5. PAYMENT POSTING ---
function postPayment() {
    let poNum = document.getElementById('miroSearch').value;
    let orders = JSON.parse(localStorage.getItem('sap_orders')) || [];

    let updatedOrders = orders.map(o => {
        if (o.id === poNum) {
            o.status = "Paid & Closed";
        }
        return o;
    });

    localStorage.setItem('sap_orders', JSON.stringify(updatedOrders));
    alert("Payment Successful! SAP FI Document Generated.");
    window.location.href = "../index.html";
}

// --- 6. DASHBOARD DISPLAY (WITH SMART COLORS) ---
function displayDashboard() {
    let orders = JSON.parse(localStorage.getItem('sap_orders')) || [];
    let prs = JSON.parse(localStorage.getItem('sap_prs')) || [];
    let tableBody = document.querySelector("#activity-table tbody");
    
    // Counts update karna
    if(document.getElementById("pr-count")) document.getElementById("pr-count").innerText = prs.length;
    if(document.getElementById("po-count")) document.getElementById("po-count").innerText = orders.length;

    // Smart logic: Sirf wo orders jo delivery ho gaye par payment baki hai
    let pendingCount = orders.filter(o => o.status === "Goods Received" || o.status === "Partially Received").length;
    if(document.getElementById("pending-count")) {
        document.getElementById("pending-count").innerText = pendingCount;
    }

    if(tableBody) {
        let allActivity = [...orders, ...prs];
        
        tableBody.innerHTML = allActivity.map(act => {
            let bgColor = "#95a5a6"; 
            if (act.status === "Paid & Closed") bgColor = "#269c98"; // Green
            else if (act.status === "Goods Received") bgColor = "#b4b929"; // Olive Green
            else if (act.status === "Partially Received") bgColor = "#e74c3c"; // Red Alert
            else if (act.status === "Created") bgColor = "#e68722"; // Orange
            else if (act.status === "Requested") bgColor = "#ad449b"; // Purple

            return `
                <tr>
                    <td>${act.id}</td>
                    <td>${act.vendor ? act.vendor : act.item}</td>
                    <td>
                        <span class="badge" style="background:${bgColor}; color:white; padding:5px 12px; border-radius:15px; font-size:11px; font-weight:bold;">
                            ${act.status}
                        </span>
                    </td>
                    <td>${act.date}</td>
                </tr>
            `;
        }).join('');
    }
}

// --- 7. SYSTEM RESET ---
function resetSystem() {
    if (confirm("Are you sure you want to clear all SAP data?")) {
        localStorage.clear();
        alert("System Reset Successful!");
        location.reload();
    }
}
// --- PR Fetch Logic ---
function fetchPRData() {
    let prNum = document.getElementById('refPR').value;
    let prs = JSON.parse(localStorage.getItem('sap_prs')) || [];
    let foundPR = prs.find(p => p.id === prNum);

    if (foundPR) {
        document.getElementById('pr-status').innerText = "✅ PR Found: Item requested is '" + foundPR.item + "'";
        document.getElementById('pr-status').style.color = "green";
    } else {
        alert("PR Number not found! Please check your dashboard.");
        document.getElementById('pr-status').innerText = "❌ PR not found.";
        document.getElementById('pr-status').style.color = "red";
    }
}
// Dashboard load hote hi data dikhane ke liye
window.onload = displayDashboard;