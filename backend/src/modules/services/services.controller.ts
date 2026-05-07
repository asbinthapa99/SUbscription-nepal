import { asyncHandler } from "../../utils/async-handler.js";
import { listPublicServices } from "./services.service.js";

export const listServices = asyncHandler(async (_req, res) => {
  const services = await listPublicServices();

  res.json({ services });
});
