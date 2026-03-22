require("dotenv").config();
const mongoose = require("mongoose");
const Client = require("./models/Client");
const Task = require("./models/Task");

const connectDB = async () => {
  await mongoose.connect(
    process.env.MONGODB_URI ||
      "mongodb://localhost:27017/compliance_tracker"
  );
  console.log("✅ MongoDB connected");
};

const clients = [
  {
    company_name: "Rajesh Exports Pvt Ltd",
    country: "India",
    entity_type: "Private Limited",
    contact_email: "finance@rajeshexports.com",
  },
  {
    company_name: "Sharma & Associates LLP",
    country: "India",
    entity_type: "LLP",
    contact_email: "accounts@sharmaassoc.com",
  },
  {
    company_name: "TechNova Solutions",
    country: "India",
    entity_type: "Private Limited",
    contact_email: "cfo@technovasol.com",
  },
  {
    company_name: "Green Earth NGO",
    country: "India",
    entity_type: "NGO",
    contact_email: "admin@greenearth.org",
  },
  {
    company_name: "Patel Brothers Trading",
    country: "India",
    entity_type: "Partnership",
    contact_email: "patelbrothers@gmail.com",
  },
];

const makeTasks = (clientId, index) => {
  const now = new Date();
  const past = (d) =>
    new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
  const future = (d) =>
    new Date(now.getTime() + d * 24 * 60 * 60 * 1000);

  const sets = [
    [
      { title: "Q4 Income Tax Filing", category: "Tax Filing", due_date: past(5), status: "Pending", priority: "Critical", description: "File ITR for FY2023-24" },
      { title: "GST Return March", category: "GST", due_date: past(2), status: "In Progress", priority: "High", description: "GSTR-1 and GSTR-3B for March" },
      { title: "ROC Annual Return", category: "ROC Filing", due_date: future(10), status: "Pending", priority: "High", description: "Annual return filing with ROC" },
      { title: "TDS Q4 Return", category: "TDS", due_date: future(5), status: "Completed", priority: "Medium", description: "File TDS return for Q4" },
      { title: "Statutory Audit FY24", category: "Audit", due_date: future(30), status: "Pending", priority: "High", description: "Conduct statutory audit" },
    ],
    [
      { title: "Partnership Deed Renewal", category: "ROC Filing", due_date: past(10), status: "Pending", priority: "Critical", description: "Renew and register updated deed" },
      { title: "GST Annual Return", category: "GST", due_date: past(1), status: "Pending", priority: "High", description: "GSTR-9 for FY2023-24" },
      { title: "April Payroll Processing", category: "Payroll", due_date: future(3), status: "In Progress", priority: "Medium", description: "Process monthly payroll" },
      { title: "TDS Certificate Issuance", category: "TDS", due_date: future(15), status: "Pending", priority: "Medium", description: "Issue Form 16 to employees" },
    ],
    [
      { title: "Advance Tax Q1 FY25", category: "Tax Filing", due_date: future(7), status: "Pending", priority: "High", description: "Pay advance tax for Q1" },
      { title: "GST Reconciliation", category: "GST", due_date: future(14), status: "In Progress", priority: "Medium", description: "Reconcile GSTR-2A with books" },
      { title: "Internal Audit Q1", category: "Audit", due_date: future(20), status: "Pending", priority: "Low", description: "Q1 internal audit" },
      { title: "Director KYC Update", category: "ROC Filing", due_date: past(3), status: "Completed", priority: "Low", description: "Update KYC on MCA portal" },
    ],
    [
      { title: "80G Renewal Application", category: "Annual Return", due_date: past(8), status: "Pending", priority: "Critical", description: "Apply for 80G renewal" },
      { title: "FCRA Annual Return", category: "Annual Return", due_date: future(25), status: "Pending", priority: "High", description: "File FCRA return" },
      { title: "12A Registration Renewal", category: "ROC Filing", due_date: future(45), status: "Pending", priority: "Medium", description: "12A renewal application" },
    ],
    [
      { title: "GST April Return", category: "GST", due_date: future(4), status: "Pending", priority: "High", description: "File GSTR-3B for April" },
      { title: "Profit Sharing Accounts", category: "Audit", due_date: future(18), status: "In Progress", priority: "Medium", description: "Prepare P&L for partner distribution" },
      { title: "TDS Q1 Return", category: "TDS", due_date: future(22), status: "Pending", priority: "Medium", description: "File Q1 TDS return" },
      { title: "Trade License Renewal", category: "Other", due_date: past(15), status: "Completed", priority: "High", description: "Renew municipal trade license" },
    ],
  ];

  return sets[index].map((t) => ({ ...t, client_id: clientId }));
};

const seed = async () => {
  try {
    await connectDB();

    await Client.deleteMany({});
    await Task.deleteMany({});
    console.log("🗑️  Cleared old data");

    const createdClients = await Client.insertMany(clients);
    console.log(`✅ Inserted ${createdClients.length} clients`);

    let total = 0;
    for (let i = 0; i < createdClients.length; i++) {
      const tasks = makeTasks(createdClients[i]._id, i);
      await Task.insertMany(tasks);
      total += tasks.length;
    }

    console.log(`✅ Inserted ${total} tasks`);
    console.log("🎉 Seed complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seed();