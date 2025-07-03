// src/app/api/institutions/route.js
import {
  getInstitutions,
  createInstitution,
  updateInstitution,
  deleteInstitution
} from "@/controller/institutionController";

export async function GET(request) {
  return await getInstitutions(request);
}

export async function POST(request) {
  return await createInstitution(request);
}

export async function PUT(request) {
  return await updateInstitution(request);
}

export async function DELETE(request) {
  return await deleteInstitution(request);
}