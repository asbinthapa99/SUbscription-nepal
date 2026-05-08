import { asyncHandler } from "../../utils/async-handler.js";
import { listPublicTools } from "./tools.service.js";

export const listTools = asyncHandler(async (_req, res) => {
  const tools = await listPublicTools();

  res.json({ tools });
});
