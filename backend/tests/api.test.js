import "dotenv/config";
import assert from "node:assert/strict";
import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";

let server;
let baseUrl;

const runId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const prefix = `api-test-${runId}`;
const emails = [
  `${prefix}-one@example.com`,
  `${prefix}-two@example.com`
];
const created = {
  userIds: [],
  postIds: [],
  commentIds: [],
  reportIds: [],
  resourceTitles: [],
  groupIds: [],
  conversationIds: []
};

function listen(appServer) {
  return new Promise((resolve) => {
    const httpServer = appServer.listen(0, "127.0.0.1", () => resolve(httpServer));
  });
}

function close(appServer) {
  return new Promise((resolve, reject) => {
    appServer.close((error) => error ? reject(error) : resolve());
  });
}

async function api(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    ...(options.headers || {})
  };
  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail = data.detail ? ` (${data.detail})` : "";
    throw new Error(`${options.method || "GET"} ${path} failed with ${response.status}: ${data.message || "No error message"}${detail}`);
  }

  return data;
}

async function ensureCategory() {
  return prisma.category.upsert({
    where: { name: "Kitchen Help" },
    update: {
      icon: "KH",
      description: "Recipes, meal planning, groceries, cooking basics, kitchen organization, and food storage."
    },
    create: {
      name: "Kitchen Help",
      icon: "KH",
      description: "Recipes, meal planning, groceries, cooking basics, kitchen organization, and food storage."
    }
  });
}

async function resetResourceSequence() {
  await prisma.$executeRaw`
    SELECT setval(pg_get_serial_sequence('"Resource"', 'id'), COALESCE((SELECT MAX(id) FROM "Resource"), 1), true)
  `;
}

async function cleanup() {
  const users = await prisma.user.findMany({
    where: { email: { in: emails } },
    select: { id: true }
  });
  const userIds = Array.from(new Set(created.userIds.concat(users.map((user) => user.id))));

  await prisma.userWarning.deleteMany({
    where: {
      OR: [
        { userId: { in: userIds } },
        { moderatorId: { in: userIds } }
      ]
    }
  });
  await prisma.report.deleteMany({
    where: {
      OR: [
        { id: { in: created.reportIds } },
        { reporterId: { in: userIds } },
        { targetId: { in: created.postIds.concat(created.commentIds).concat(created.groupIds).concat(created.conversationIds) } }
      ]
    }
  });
  await prisma.blockedUser.deleteMany({
    where: {
      OR: [
        { blockerId: { in: userIds } },
        { blockedId: { in: userIds } }
      ]
    }
  });
  await prisma.group.deleteMany({
    where: { id: { in: created.groupIds } }
  });
  await prisma.directConversation.deleteMany({
    where: { id: { in: created.conversationIds } }
  });
  await prisma.resource.deleteMany({
    where: {
      OR: [
        { title: { in: created.resourceTitles } },
        { title: { startsWith: prefix } }
      ]
    }
  });
  await prisma.post.deleteMany({
    where: { id: { in: created.postIds } }
  });
  await prisma.user.deleteMany({
    where: { id: { in: userIds } }
  });
}

async function setup() {
  process.env.NODE_ENV = "test";
  process.env.EMAIL_PROVIDER = "console";
  process.env.FRONTEND_URL = "http://127.0.0.1:5500";
  await ensureCategory();
  await resetResourceSequence();
  server = await listen(app);
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}/api`;
}

async function teardown() {
  await cleanup();
  if (server) await close(server);
  await prisma.$disconnect();
}

async function testPublicRoutes() {
  const health = await api("/health");
  assert.equal(health.status, "ok");

  const categories = await api("/categories");
  assert.ok(categories.some((category) => category.name === "Kitchen Help"));
}

async function testApiFlow() {
  const firstSignup = await api("/users/signup", {
    method: "POST",
    body: {
      fullName: "API Test One",
      username: `${prefix}-one`,
      email: emails[0],
      password: "secret123"
    }
  });
  const secondSignup = await api("/users/signup", {
    method: "POST",
    body: {
      fullName: "API Test Two",
      username: `${prefix}-two`,
      email: emails[1],
      password: "secret123"
    }
  });
  created.userIds.push(firstSignup.user.id, secondSignup.user.id);
  assert.equal(firstSignup.user.emailVerified, false);
  assert.ok(firstSignup.verificationToken);

  const verify = await api("/users/verify-email", {
    method: "POST",
    body: { token: firstSignup.verificationToken }
  });
  assert.equal(verify.message, "Email verified successfully.");

  const login = await api("/users/login", {
    method: "POST",
    body: { email: emails[0], password: "secret123" }
  });
  assert.equal(login.user.email, emails[0]);
  assert.ok(login.token);

  const me = await api("/users/me", { token: login.token });
  assert.equal(me.id, firstSignup.user.id);
  assert.equal(me.emailVerified, true);

  await api("/users/change-password", {
    method: "POST",
    token: login.token,
    body: {
      currentPassword: "secret123",
      newPassword: "secret456"
    }
  });

  const changedLogin = await api("/users/login", {
    method: "POST",
    body: { email: emails[0], password: "secret456" }
  });
  assert.ok(changedLogin.token);

  const forgot = await api("/users/forgot-password", {
    method: "POST",
    body: { email: emails[1] }
  });
  assert.ok(forgot.resetToken);

  await api("/users/reset-password", {
    method: "POST",
    body: {
      token: forgot.resetToken,
      password: "secret789"
    }
  });

  const secondLogin = await api("/users/login", {
    method: "POST",
    body: { email: emails[1], password: "secret789" }
  });
  assert.ok(secondLogin.token);

  await prisma.user.update({
    where: { id: firstSignup.user.id },
    data: { role: "ADMIN" }
  });

  const updatedProfile = await api(`/users/${firstSignup.user.id}`, {
    method: "PATCH",
    token: changedLogin.token,
    body: {
      fullName: "API Test One Updated",
      username: `${prefix}-one-updated`,
      email: emails[0],
      bio: "Updated from backend API test.",
      profileImage: ""
    }
  });
  assert.equal(updatedProfile.fullName, "API Test One Updated");

  const post = await api("/posts", {
    method: "POST",
    token: changedLogin.token,
    body: {
      categoryName: "Kitchen Help",
      text: `${prefix} post`,
      imageUrl: "",
      type: "THOUGHT"
    }
  });
  created.postIds.push(Number(post.id));
  assert.equal(post.text, `${prefix} post`);

  await api(`/posts/${post.id}/like`, { method: "POST", token: changedLogin.token, body: {} });
  await api(`/posts/${post.id}/save`, { method: "POST", token: changedLogin.token, body: {} });

  const comment = await api(`/posts/${post.id}/comments`, {
    method: "POST",
    token: changedLogin.token,
    body: { commentText: `${prefix} comment` }
  });
  created.commentIds.push(comment.id);
  assert.equal(comment.text, `${prefix} comment`);

  const editedComment = await api(`/posts/${post.id}/comments/${comment.id}`, {
    method: "PUT",
    token: changedLogin.token,
    body: { commentText: `${prefix} edited comment` }
  });
  assert.equal(editedComment.text, `${prefix} edited comment`);

  await api(`/posts/${post.id}/comments/${comment.id}`, {
    method: "DELETE",
    token: changedLogin.token
  });

  const editedPost = await api(`/posts/${post.id}`, {
    method: "PUT",
    token: changedLogin.token,
    body: {
      categoryName: "Kitchen Help",
      text: `${prefix} edited post`,
      imageUrl: "",
      type: "THOUGHT"
    }
  });
  assert.equal(editedPost.text, `${prefix} edited post`);

  const resourceTitle = `${prefix} resource`;
  created.resourceTitles.push(resourceTitle);
  const resource = await api("/resources", {
    method: "POST",
    token: changedLogin.token,
    body: {
      categoryName: "Kitchen Help",
      type: "ARTICLE",
      title: resourceTitle,
      description: "A test resource.",
      url: "https://example.com"
    }
  });
  assert.equal(resource.title, resourceTitle);

  const group = await api("/groups", {
    method: "POST",
    token: changedLogin.token,
    body: {
      name: `${prefix} group`,
      description: "A test group."
    }
  });
  created.groupIds.push(group.dbId);
  assert.equal(group.name, `${prefix} group`);

  const groupMessage = await api(`/groups/${group.dbId}/messages`, {
    method: "POST",
    token: changedLogin.token,
    body: { messageText: `${prefix} group message` }
  });
  assert.equal(groupMessage.text, `${prefix} group message`);

  const directConversation = await api("/direct-conversations", {
    method: "POST",
    token: changedLogin.token,
    body: { userId: secondSignup.user.id }
  });
  created.conversationIds.push(directConversation.dbId);
  assert.equal(directConversation.userId, secondSignup.user.id);

  const directMessage = await api(`/direct-conversations/${directConversation.dbId}/messages`, {
    method: "POST",
    token: changedLogin.token,
    body: { messageText: `${prefix} direct message` }
  });
  assert.equal(directMessage.text, `${prefix} direct message`);

  const report = await api("/moderation/reports", {
    method: "POST",
    token: secondLogin.token,
    body: {
      targetType: "POST",
      targetId: Number(post.id),
      reason: "Testing report creation."
    }
  });
  created.reportIds.push(report.id);
  assert.ok(report.id);

  const adminReports = await api("/moderation/reports", { token: changedLogin.token });
  assert.ok(adminReports.some((item) => item.id === report.id && item.status === "PENDING"));

  const reviewed = await api(`/moderation/reports/${report.id}`, {
    method: "PATCH",
    token: changedLogin.token,
    body: {
      status: "REVIEWED",
      moderatorNote: "Reviewed in API test."
    }
  });
  assert.equal(reviewed.status, "REVIEWED");

  const warned = await api(`/moderation/reports/${report.id}/warn`, {
    method: "POST",
    token: changedLogin.token,
    body: {
      message: "Please follow community rules.",
      moderatorNote: "Warning sent in API test."
    }
  });
  assert.equal(warned.report.status, "ACTION_TAKEN");

  await api("/moderation/blocks", {
    method: "POST",
    token: changedLogin.token,
    body: { userId: secondSignup.user.id }
  });

  const usersAfterBlock = await api("/users", { token: changedLogin.token });
  assert.ok(usersAfterBlock.every((user) => user.id !== secondSignup.user.id));

  await api(`/moderation/blocks/${secondSignup.user.id}`, {
    method: "DELETE",
    token: changedLogin.token
  });

  const removalReport = await api("/moderation/reports", {
    method: "POST",
    token: secondLogin.token,
    body: {
      targetType: "POST",
      targetId: Number(post.id),
      reason: "Testing content removal."
    }
  });
  created.reportIds.push(removalReport.id);

  const removed = await api(`/moderation/reports/${removalReport.id}/target`, {
    method: "DELETE",
    token: changedLogin.token,
    body: { moderatorNote: "Removed in API test." }
  });
  assert.equal(removed.status, "ACTION_TAKEN");
}

async function runTest(name, fn) {
  process.stdout.write(`Running: ${name}\n`);
  await fn();
  process.stdout.write(`Passed: ${name}\n`);
}

try {
  await setup();
  await runTest("public health and categories routes", testPublicRoutes);
  await runTest("auth, posts, comments, resources, chat, reports, and blocking flow", testApiFlow);
  process.stdout.write("All backend API tests passed.\n");
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
} finally {
  await teardown().catch((error) => {
    process.stderr.write(`Cleanup failed: ${error.stack || error.message}\n`);
    process.exitCode = 1;
  });
}
