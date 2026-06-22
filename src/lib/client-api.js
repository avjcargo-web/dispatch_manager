export async function apiRequest(url, options = {}) {
  const requestOptions = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    cache: "no-store",
  };

  const response = await fetch(url, requestOptions);
  let payload = {};

  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  if (!response.ok) {
    const details = Array.isArray(payload.details) ? ` ${payload.details.join(" ")}` : "";
    throw new Error(payload.error ? `${payload.error}${details}` : "Something went wrong.");
  }

  return payload;
}

export function formatDriverName(driver) {
  if (!driver) {
    return "";
  }

  const firstName = driver.first_name?.trim() ?? "";
  const lastName = driver.last_name?.trim() ?? "";

  if (!lastName || firstName === lastName) {
    return firstName;
  }

  return `${firstName} ${lastName}`.trim();
}

export function splitDriverName(driverName) {
  const normalized = driverName.trim().replace(/\s+/g, " ");
  const segments = normalized.split(" ");
  const firstName = segments[0] ?? "";
  const lastName = segments.length > 1 ? segments.slice(1).join(" ") : firstName;

  return {
    first_name: firstName,
    last_name: lastName,
  };
}
