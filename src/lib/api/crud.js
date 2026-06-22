import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { resources } from "@/lib/api/resources";

function json(data, status = 200) {
  return NextResponse.json(data, { status });
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function parseId(id) {
  const numericId = Number(id);
  return Number.isInteger(numericId) && numericId > 0 ? numericId : null;
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

function normalizeString(value, field) {
  if (typeof value !== "string") {
    return { error: `${field} must be a string.` };
  }

  return { value: value.trim() };
}

function normalizeFieldValue(fieldName, rules, incomingValue) {
  if (incomingValue === null) {
    if (rules.nullable) {
      return { value: null };
    }

    return { error: `${fieldName} cannot be null.` };
  }

  if (rules.type === "string") {
    const normalized = normalizeString(incomingValue, fieldName);

    if (normalized.error) {
      return normalized;
    }

    if (rules.required && normalized.value.length === 0) {
      return { error: `${fieldName} is required.` };
    }

    if (rules.maxLength && normalized.value.length > rules.maxLength) {
      return { error: `${fieldName} must be ${rules.maxLength} characters or fewer.` };
    }

    return { value: normalized.value.length === 0 && rules.nullable ? null : normalized.value };
  }

  if (rules.type === "number") {
    const numericValue = Number(incomingValue);

    if (!Number.isInteger(numericValue) || numericValue <= 0) {
      return { error: `${fieldName} must be a positive integer.` };
    }

    return { value: numericValue };
  }

  if (rules.type === "enum") {
    if (typeof incomingValue !== "string" || !rules.values.includes(incomingValue)) {
      return { error: `${fieldName} must be one of: ${rules.values.join(", ")}.` };
    }

    return { value: incomingValue };
  }

  if (rules.type === "datetime") {
    if (typeof incomingValue !== "string" || Number.isNaN(Date.parse(incomingValue))) {
      return { error: `${fieldName} must be a valid datetime string.` };
    }

    return { value: incomingValue };
  }

  return { value: incomingValue };
}

function validatePayload(resourceKey, payload, options = {}) {
  const resource = resources[resourceKey];
  const fields = resource.fields;
  const sanitized = {};
  const errors = [];
  const { partial = false } = options;

  for (const [fieldName, rules] of Object.entries(fields)) {
    const hasValue = Object.prototype.hasOwnProperty.call(payload, fieldName);

    if (!hasValue) {
      if (!partial && rules.required) {
        errors.push(`${fieldName} is required.`);
      }

      continue;
    }

    const result = normalizeFieldValue(fieldName, rules, payload[fieldName]);

    if (result.error) {
      errors.push(result.error);
      continue;
    }

    sanitized[fieldName] = result.value;
  }

  const unknownFields = Object.keys(payload).filter(
    (key) => !Object.prototype.hasOwnProperty.call(fields, key)
  );

  if (unknownFields.length > 0) {
    errors.push(`Unknown fields: ${unknownFields.join(", ")}.`);
  }

  if (partial && Object.keys(sanitized).length === 0 && errors.length === 0) {
    errors.push("Provide at least one valid field to update.");
  }

  return {
    errors,
    values: sanitized,
  };
}

async function getResourceRow(resourceKey, id) {
  const resource = resources[resourceKey];
  const rows = await query(`SELECT * FROM ${resource.table} WHERE id = ? LIMIT 1`, [id]);
  return rows[0] ?? null;
}

function handleDatabaseError(error) {
  if (error?.code === "ER_DUP_ENTRY") {
    return json({ error: "A record with the same unique value already exists." }, 409);
  }

  if (error?.code === "ER_NO_REFERENCED_ROW_2") {
    return json({ error: "One or more related records do not exist." }, 400);
  }

  console.error("API database error:", error);
  return json({ error: "Internal server error." }, 500);
}

export async function listRecords(resourceKey) {
  const resource = resources[resourceKey];

  try {
    const rows = await query(`SELECT * FROM ${resource.table} ORDER BY ${resource.orderBy}`);
    return json({ data: rows });
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function getRecord(resourceKey, idParam) {
  const id = parseId(idParam);

  if (!id) {
    return json({ error: "Invalid record id." }, 400);
  }

  try {
    const row = await getResourceRow(resourceKey, id);

    if (!row) {
      return json({ error: "Record not found." }, 404);
    }

    return json({ data: row });
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function createRecord(resourceKey, request) {
  const resource = resources[resourceKey];
  const parsed = await readJsonBody(request);

  if (parsed.error) {
    return json({ error: parsed.error }, 400);
  }

  const validation = validatePayload(resourceKey, parsed.body);

  if (validation.errors.length > 0) {
    return json({ error: "Validation failed.", details: validation.errors }, 400);
  }

  const fieldNames = Object.keys(validation.values);
  const placeholders = fieldNames.map(() => "?").join(", ");
  const values = fieldNames.map((field) => validation.values[field]);

  try {
    const result = await query(
      `INSERT INTO ${resource.table} (${fieldNames.join(", ")}) VALUES (${placeholders})`,
      values
    );

    const createdRecord = await getResourceRow(resourceKey, result.insertId);

    return json(
      {
        message: `${resourceKey.slice(0, -1)} created successfully.`,
        data: createdRecord,
      },
      201
    );
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function updateRecord(resourceKey, idParam, request) {
  const resource = resources[resourceKey];
  const id = parseId(idParam);

  if (!id) {
    return json({ error: "Invalid record id." }, 400);
  }

  const parsed = await readJsonBody(request);

  if (parsed.error) {
    return json({ error: parsed.error }, 400);
  }

  const validation = validatePayload(resourceKey, parsed.body, { partial: true });

  if (validation.errors.length > 0) {
    return json({ error: "Validation failed.", details: validation.errors }, 400);
  }

  const updates = Object.keys(validation.values).map((field) => `${field} = ?`);
  const values = Object.keys(validation.values).map((field) => validation.values[field]);

  try {
    const existingRecord = await getResourceRow(resourceKey, id);

    if (!existingRecord) {
      return json({ error: "Record not found." }, 404);
    }

    await query(`UPDATE ${resource.table} SET ${updates.join(", ")} WHERE id = ?`, [...values, id]);

    const updatedRecord = await getResourceRow(resourceKey, id);

    return json({
      message: `${resourceKey.slice(0, -1)} updated successfully.`,
      data: updatedRecord,
    });
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function deleteRecord(resourceKey, idParam) {
  const resource = resources[resourceKey];
  const id = parseId(idParam);

  if (!id) {
    return json({ error: "Invalid record id." }, 400);
  }

  try {
    const existingRecord = await getResourceRow(resourceKey, id);

    if (!existingRecord) {
      return json({ error: "Record not found." }, 404);
    }

    await query(`DELETE FROM ${resource.table} WHERE id = ?`, [id]);

    return json({
      message: `${resourceKey.slice(0, -1)} deleted successfully.`,
    });
  } catch (error) {
    return handleDatabaseError(error);
  }
}
