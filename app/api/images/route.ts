import { BlobServiceClient } from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity";
import { NextResponse } from "next/server";

export async function GET() {
  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME ?? "product-images";

  if (!accountName) {
    return NextResponse.json({ images: [], source: "local-static-content" });
  }

  try {
    const client = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      new DefaultAzureCredential(),
    );
    const container = client.getContainerClient(containerName);
    const images = [];
    for await (const blob of container.listBlobsFlat()) {
      images.push({ name: blob.name, url: container.getBlobClient(blob.name).url });
    }
    return NextResponse.json({ images, source: "azure-blob-storage" });
  } catch (error) {
    console.error("Blob Storage error", error);
    return NextResponse.json({ message: "Unable to list Blob Storage images." }, { status: 502 });
  }
}
