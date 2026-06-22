import { NextResponse } from "next/server";
import { query } from "@/lib/db";

function json(data, status = 200) {
  return NextResponse.json(data, { status });
}

function parseId(id) {
  const numericId = Number(id);
  return Number.isInteger(numericId) && numericId > 0 ? numericId : null;
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

async function readJsonBody(request) {
  try {
    const body = await request.json();

    if (!isPlainObject(body)) {
      return { error: "Request body must be a JSON object." };
    }

    return { body };
  } catch {
    return { error: "Invalid JSON request body." };
  }
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function validateDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function validateTime(value) {
  return /^\d{2}:\d{2}(:\d{2})?$/.test(value);
}

function combineDateTime(date, time) {
  return `${date} ${time.length === 5 ? `${time}:00` : time}`;
}

function formatDriverName(row) {
  const firstName = row.driver_first_name?.trim() ?? "";
  const lastName = row.driver_last_name?.trim() ?? "";

  if (!lastName || firstName === lastName) {
    return firstName || null;
  }

  return `${firstName} ${lastName}`.trim();
}

function mapDispatchRow(row) {
  if (!row) {
    return null;
  }

  return {
    ...row,
    delivery_location: row.delivery_location ?? row.dropoff_location,
    driver_name: formatDriverName(row),
    customer_name: row.customer_name ?? null,
    container_number: row.container_number ?? null,
  };
}

function validateDispatchPayload(payload) {
  const errors = [];

  const normalized = {
    dispatch_type: normalizeText(payload.dispatch_type),
    customer_id: Number(payload.customer_id),
    driver_id: Number(payload.driver_id),
    container_id: Number(payload.container_id),
    pickup_location: normalizeText(payload.pickup_location),
    pickup_address: normalizeText(payload.pickup_address),
    pickup_date: normalizeText(payload.pickup_date),
    pickup_time: normalizeText(payload.pickup_time),
    delivery_location: normalizeText(payload.delivery_location),
    delivery_address: normalizeText(payload.delivery_address),
    delivery_date: normalizeText(payload.delivery_date),
    delivery_time: normalizeText(payload.delivery_time),
    status: normalizeText(payload.status),
    notes: normalizeText(payload.notes),
  };

  if (!normalized.dispatch_type) {
    errors.push("dispatch_type is required.");
  }

  if (!Number.isInteger(normalized.customer_id) || normalized.customer_id <= 0) {
    errors.push("customer_id must be a valid customer id.");
  }

  if (!Number.isInteger(normalized.driver_id) || normalized.driver_id <= 0) {
    errors.push("driver_id must be a valid driver id.");
  }

  if (!Number.isInteger(normalized.container_id) || normalized.container_id <= 0) {
    errors.push("container_id must be a valid container id.");
  }

  if (!normalized.pickup_location) {
    errors.push("pickup_location is required.");
  }

  if (!normalized.pickup_address) {
    errors.push("pickup_address is required.");
  }

  if (!validateDate(normalized.pickup_date)) {
    errors.push("pickup_date must be in YYYY-MM-DD format.");
  }

  if (!validateTime(normalized.pickup_time)) {
    errors.push("pickup_time must be in HH:MM or HH:MM:SS format.");
  }

  if (!normalized.delivery_location) {
    errors.push("delivery_location is required.");
  }

  if (!normalized.delivery_address) {
    errors.push("delivery_address is required.");
  }

  if (!validateDate(normalized.delivery_date)) {
    errors.push("delivery_date must be in YYYY-MM-DD format.");
  }

  if (!validateTime(normalized.delivery_time)) {
    errors.push("delivery_time must be in HH:MM or HH:MM:SS format.");
  }

  const allowedStatuses = ["pending", "assigned", "in_transit", "completed", "cancelled"];

  if (!allowedStatuses.includes(normalized.status)) {
    errors.push(`status must be one of: ${allowedStatuses.join(", ")}.`);
  }

  return {
    errors,
    values: normalized,
  };
}

function handleDatabaseError(error) {
  if (error?.code === "ER_DUP_ENTRY") {
    return json({ error: "A dispatch with the same identifier already exists." }, 409);
  }

  if (error?.code === "ER_NO_REFERENCED_ROW_2") {
    return json({ error: "One or more linked records do not exist." }, 400);
  }

  console.error("Dispatch API error:", error);
  return json({ error: "Internal server error." }, 500);
}

async function getDispatchRow(id) {
  const rows = await query(
    `
      SELECT
        d.*,
        c.company_name AS customer_name,
        dr.first_name AS driver_first_name,
        dr.last_name AS driver_last_name,
        ct.container_number
      FROM dispatches d
      LEFT JOIN customers c ON c.id = d.customer_id
      LEFT JOIN drivers dr ON dr.id = d.driver_id
      LEFT JOIN containers ct ON ct.id = d.container_id
      WHERE d.id = ?
      LIMIT 1
    `,
    [id]
  );

  return mapDispatchRow(rows[0] ?? null);
}

export async function listDispatches(request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) : null;
  const hasLimit = Number.isInteger(limit) && limit > 0;

  try {
    const rows = await query(
      `
        SELECT
          d.*,
          c.company_name AS customer_name,
          dr.first_name AS driver_first_name,
          dr.last_name AS driver_last_name,
          ct.container_number
        FROM dispatches d
        LEFT JOIN customers c ON c.id = d.customer_id
        LEFT JOIN drivers dr ON dr.id = d.driver_id
        LEFT JOIN containers ct ON ct.id = d.container_id
        ORDER BY d.created_at DESC, d.id DESC
        ${hasLimit ? `LIMIT ${limit}` : ""}
      `
    );

    return json({ data: rows.map(mapDispatchRow) });
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function getDispatchById(idParam) {
  const id = parseId(idParam);

  if (!id) {
    return json({ error: "Invalid dispatch id." }, 400);
  }

  try {
    const dispatch = await getDispatchRow(id);

    if (!dispatch) {
      return json({ error: "Dispatch not found." }, 404);
    }

    return json({ data: dispatch });
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function createDispatch(request) {
  const parsed = await readJsonBody(request);

  if (parsed.error) {
    return json({ error: parsed.error }, 400);
  }

  const validation = validateDispatchPayload(parsed.body);

  if (validation.errors.length > 0) {
    return json({ error: "Validation failed.", details: validation.errors }, 400);
  }

  const values = validation.values;
  const provisionalDispatchNumber = `TMP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const scheduledDate = combineDateTime(values.pickup_date, values.pickup_time);

  try {
    const result = await query(
      `
        INSERT INTO dispatches (
          dispatch_number,
          customer_id,
          driver_id,
          container_id,
          dispatch_type,
          pickup_location,
          pickup_address,
          pickup_date,
          pickup_time,
          delivery_location,
          delivery_address,
          delivery_date,
          delivery_time,
          dropoff_location,
          scheduled_date,
          status,
          notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        provisionalDispatchNumber,
        values.customer_id,
        values.driver_id,
        values.container_id,
        values.dispatch_type,
        values.pickup_location,
        values.pickup_address,
        values.pickup_date,
        values.pickup_time,
        values.delivery_location,
        values.delivery_address,
        values.delivery_date,
        values.delivery_time,
        values.delivery_location,
        scheduledDate,
        values.status,
        values.notes || null,
      ]
    );

    const dispatchNumber = `DSP-${String(result.insertId).padStart(5, "0")}`;

    await query("UPDATE dispatches SET dispatch_number = ? WHERE id = ?", [
      dispatchNumber,
      result.insertId,
    ]);

    const createdDispatch = await getDispatchRow(result.insertId);

    return json(
      {
        message: "Dispatch created successfully.",
        data: createdDispatch,
      },
      201
    );
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function updateDispatch(idParam, request) {
  const id = parseId(idParam);

  if (!id) {
    return json({ error: "Invalid dispatch id." }, 400);
  }

  const parsed = await readJsonBody(request);

  if (parsed.error) {
    return json({ error: parsed.error }, 400);
  }

  const validation = validateDispatchPayload(parsed.body);

  if (validation.errors.length > 0) {
    return json({ error: "Validation failed.", details: validation.errors }, 400);
  }

  try {
    const existingDispatch = await getDispatchRow(id);

    if (!existingDispatch) {
      return json({ error: "Dispatch not found." }, 404);
    }

    const values = validation.values;
    const scheduledDate = combineDateTime(values.pickup_date, values.pickup_time);

    await query(
      `
        UPDATE dispatches
        SET
          customer_id = ?,
          driver_id = ?,
          container_id = ?,
          dispatch_type = ?,
          pickup_location = ?,
          pickup_address = ?,
          pickup_date = ?,
          pickup_time = ?,
          delivery_location = ?,
          delivery_address = ?,
          delivery_date = ?,
          delivery_time = ?,
          dropoff_location = ?,
          scheduled_date = ?,
          status = ?,
          notes = ?
        WHERE id = ?
      `,
      [
        values.customer_id,
        values.driver_id,
        values.container_id,
        values.dispatch_type,
        values.pickup_location,
        values.pickup_address,
        values.pickup_date,
        values.pickup_time,
        values.delivery_location,
        values.delivery_address,
        values.delivery_date,
        values.delivery_time,
        values.delivery_location,
        scheduledDate,
        values.status,
        values.notes || null,
        id,
      ]
    );

    const updatedDispatch = await getDispatchRow(id);

    return json({
      message: "Dispatch updated successfully.",
      data: updatedDispatch,
    });
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function deleteDispatch(idParam) {
  const id = parseId(idParam);

  if (!id) {
    return json({ error: "Invalid dispatch id." }, 400);
  }

  try {
    const existingDispatch = await getDispatchRow(id);

    if (!existingDispatch) {
      return json({ error: "Dispatch not found." }, 404);
    }

    await query("DELETE FROM dispatches WHERE id = ?", [id]);

    return json({ message: "Dispatch deleted successfully." });
  } catch (error) {
    return handleDatabaseError(error);
  }
}
