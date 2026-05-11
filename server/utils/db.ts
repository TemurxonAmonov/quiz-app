import mongoose from "mongoose";

let isConnected = false;

function resolveMongoUri(uri: string) {
  if (!uri.startsWith("mongodb+srv://")) {
    return uri;
  }

  try {
    const parsed = new URL(uri);

    if (parsed.hostname !== "quiz-app.6rsrba3.mongodb.net") {
      return uri;
    }

    const hosts = ["ac-iedfkql-shard-00-00.6rsrba3.mongodb.net:27017", "ac-iedfkql-shard-00-01.6rsrba3.mongodb.net:27017", "ac-iedfkql-shard-00-02.6rsrba3.mongodb.net:27017"].join(",");

    const dbName = parsed.pathname.replace(/^\//, "") || "quiz-db";
    const params = new URLSearchParams(parsed.searchParams);
    params.set("authSource", "admin");
    params.set("replicaSet", "atlas-o4qzzj-shard-0");
    params.set("tls", "true");
    params.set("retryWrites", "true");
    params.set("w", "majority");

    return `mongodb://${parsed.username}:${parsed.password}@${hosts}/${dbName}?${params.toString()}`;
  } catch {
    return uri;
  }
}

export async function connectDB() {
  if (isConnected) return;

  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is not defined");

  await mongoose.connect(resolveMongoUri(uri));
  isConnected = true;
  console.log("MongoDB connected");
}
