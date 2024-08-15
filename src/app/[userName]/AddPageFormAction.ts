"use server";

type AddPageFormResponse = {
  success?: { message: string };
  error?: { message: string };
};

export async function requestAddPage(
  prevState: AddPageFormResponse,
  formData: FormData
): Promise<AddPageFormResponse> {
  console.log("🔥", formData.get("url"));
  return {};
}
