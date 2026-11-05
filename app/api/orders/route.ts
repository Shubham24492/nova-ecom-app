import { NextRequest, NextResponse } from "next/server";
import sql from "mssql";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const items = Array.isArray(body.items) ? body.items : [];
  const customerEmail = typeof body.customerEmail === "string" ? body.customerEmail : "guest@example.com";
  const total = items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);

  if (!items.length) return NextResponse.json({ message: "Your cart is empty." }, { status: 400 });

  const connectionString = process.env.AZURE_SQL_CONNECTION_STRING;
  let orderId = Math.floor(100000 + Math.random() * 900000);

  if (connectionString) {
    try {
      const pool = await sql.connect(connectionString);
      const result = await pool.request()
        .input("CustomerEmail", sql.NVarChar(255), customerEmail)
        .input("Total", sql.Decimal(10, 2), total)
        .input("Status", sql.NVarChar(30), "Placed")
        .query("INSERT INTO Orders (CustomerEmail, Total, Status) OUTPUT INSERTED.OrderId VALUES (@CustomerEmail, @Total, @Status)");
      orderId = result.recordset[0].OrderId;
      await pool.close();
    } catch (error) {
      console.error("Azure SQL order error", error);
      return NextResponse.json({ message: "The order could not be saved to Azure SQL." }, { status: 502 });
    }
  } else {
    console.log("Demo order placed", { orderId, customerEmail, total });
  }

  return NextResponse.json({ orderId, customerEmail, total, status: "Placed" }, { status: 201 });
}
