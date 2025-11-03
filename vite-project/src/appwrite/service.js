import config from "../config/config.js";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(config.url)
      .setProject(config.projectId);

    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }
  

  // ✅ Create Post
  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      const result = await this.databases.createDocument({
        databaseId: config.database,
        collectionId: config.collection,
        documentId: slug,
        data: {
          title,
          featuredImage,
          content,
          status,
          userId,
        },
      });
      return result;
    } catch (error) {
      console.log("Error creating post:", error);
      throw error;
    }
  }

  // ✅ Update Post
  async updatePost(slug, { title, content, featuredImage, status }) {
    try {
      return await this.databases.updateDocument({
        databaseId: config.database,
        collectionId: config.collection,
        documentId: slug,
        data: {
          title,
          content,
          featuredImage,
          status,
        },
      });
    } catch (error) {
      console.log("Appwrite service :: updatePost :: error", error);
    }
  }

  // ✅ Delete Post
  async deletePost(slug) {
    try {
      await this.databases.deleteDocument({
        databaseId: config.database,
        collectionId: config.collection,
        documentId: slug,
      });
      return true;
    } catch (error) {
      console.log("Appwrite service :: deletePost :: error", error);
      return false;
    }
  }

  // ✅ Get Single Post
  async getPost(slug) {
    try {
      return await this.databases.getDocument({
        databaseId: config.database,
        collectionId: config.collection,
        documentId: slug,
      });
    } catch (error) {
      console.log("Appwrite service :: getPost :: error", error);
      return false;
    }
  }

  // ✅ Get Multiple Posts
  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.databases.listDocuments({
        databaseId: config.database,
        collectionId: config.collection,
        queries,
      });
    } catch (error) {
      console.log("Appwrite service :: getPosts :: error", error);
      return false;
    }
  }

  // ✅ Upload File
  async uploadFile(file) {
    try {
      return await this.bucket.createFile({
        bucketId: config.bucket,
        fileId: ID.unique(),
        file,
      });
    } catch (error) {
      console.log("Appwrite service :: uploadFile :: error", error);
      return false;
    }
  }

  // ✅ Delete File
  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile({
        bucketId: config.bucket,
        fileId,
      });
      return true;
    } catch (error) {
      console.log("Appwrite service :: deleteFile :: error", error);
      return false;
    }
  }

  // ✅ Get File Preview
  getFilePreview(fileId) {
    return this.bucket.getFileView({
      bucketId: config.bucket,
      fileId,
    });
  }
}

const service = new Service();
export default service;
