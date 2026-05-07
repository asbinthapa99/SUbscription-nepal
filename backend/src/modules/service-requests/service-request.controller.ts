import { asyncHandler } from "../../utils/async-handler.js";
import {
  createServiceRequest,
  listServiceRequests,
  updateServiceRequestStatus
} from "./service-request.service.js";
import {
  createServiceRequestSchema,
  updateServiceRequestStatusSchema
} from "./service-request.validation.js";

export const submitServiceRequest = asyncHandler(async (req, res) => {
  const input = createServiceRequestSchema.parse(req.body);
  const serviceRequest = await createServiceRequest({
    ...input,
    userId: req.user?.id
  });

  res.status(201).json({ serviceRequest });
});

export const listAdminServiceRequests = asyncHandler(async (_req, res) => {
  const serviceRequests = await listServiceRequests();

  res.json({ serviceRequests });
});

export const updateAdminServiceRequestStatus = asyncHandler(async (req, res) => {
  const input = updateServiceRequestStatusSchema.parse(req.body);
  const id = String(req.params.id);
  const serviceRequest = await updateServiceRequestStatus(id, input.status);

  res.json({ serviceRequest });
});
