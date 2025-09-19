const ALLOWED_STATUS = ["pending", "in-progress", "completed"];

function validateTaskPayload(data, isUpdate = false) {
  const errors = [];
  if (!isUpdate) {
    if (!data.title?.trim()) errors.push("Title is required.");
    if (!data.description?.trim()) errors.push("Description is required.");
  } else {
    if ("title" in data && !data.title.trim()) errors.push("Title cannot be empty.");
    if ("description" in data && !data.description.trim()) errors.push("Description cannot be empty.");
  }
  if ("status" in data && !ALLOWED_STATUS.includes(data.status)) {
    errors.push(`Status must be one of: ${ALLOWED_STATUS.join(", ")}`);
  }
  return errors;
}

module.exports = { validateTaskPayload, ALLOWED_STATUS };
