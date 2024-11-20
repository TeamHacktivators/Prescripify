"use client";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

const modelClient = generateClient<Schema>();
export default modelClient;
