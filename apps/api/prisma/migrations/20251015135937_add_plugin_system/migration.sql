-- CreateEnum
CREATE TYPE "PluginStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ERROR', 'UPDATING', 'INSTALLING');

-- CreateEnum
CREATE TYPE "PluginAction" AS ENUM ('INSTALL', 'UNINSTALL', 'ACTIVATE', 'DEACTIVATE', 'UPDATE', 'ERROR', 'VALIDATE', 'DOWNLOAD');

-- CreateEnum
CREATE TYPE "LogStatus" AS ENUM ('SUCCESS', 'FAILED', 'WARNING', 'INFO');

-- CreateTable
CREATE TABLE "plugins" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "authorEmail" TEXT,
    "homepage" TEXT,
    "repository" TEXT,
    "status" "PluginStatus" NOT NULL DEFAULT 'INACTIVE',
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "minAppVersion" TEXT NOT NULL,
    "maxAppVersion" TEXT,
    "dependencies" JSONB NOT NULL DEFAULT '[]',
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "manifestPath" TEXT NOT NULL,
    "mainEntry" TEXT NOT NULL,
    "assetsPath" TEXT,
    "marketplaceId" TEXT,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION,
    "category" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "checksum" TEXT NOT NULL,
    "signature" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "installedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastActivated" TIMESTAMP(3),
    "lastChecked" TIMESTAMP(3),

    CONSTRAINT "plugins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plugin_routes" (
    "id" TEXT NOT NULL,
    "pluginId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "handler" TEXT NOT NULL,
    "middleware" JSONB NOT NULL DEFAULT '[]',
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "description" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plugin_routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plugin_menu_items" (
    "id" TEXT NOT NULL,
    "pluginId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "icon" TEXT,
    "path" TEXT NOT NULL,
    "position" TEXT NOT NULL DEFAULT 'header',
    "order" INTEGER NOT NULL DEFAULT 100,
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plugin_menu_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plugin_logs" (
    "id" TEXT NOT NULL,
    "pluginId" TEXT NOT NULL,
    "action" "PluginAction" NOT NULL,
    "status" "LogStatus" NOT NULL,
    "message" TEXT NOT NULL,
    "details" JSONB,
    "errorStack" TEXT,
    "userId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plugin_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plugin_conflicts" (
    "id" TEXT NOT NULL,
    "plugin1Id" TEXT NOT NULL,
    "plugin2Id" TEXT NOT NULL,
    "conflictType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'warning',
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolution" TEXT,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "plugin_conflicts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "plugins_name_key" ON "plugins"("name");

-- CreateIndex
CREATE UNIQUE INDEX "plugins_marketplaceId_key" ON "plugins"("marketplaceId");

-- CreateIndex
CREATE INDEX "plugins_status_idx" ON "plugins"("status");

-- CreateIndex
CREATE INDEX "plugins_marketplaceId_idx" ON "plugins"("marketplaceId");

-- CreateIndex
CREATE INDEX "plugins_name_idx" ON "plugins"("name");

-- CreateIndex
CREATE INDEX "plugin_routes_pluginId_idx" ON "plugin_routes"("pluginId");

-- CreateIndex
CREATE INDEX "plugin_routes_path_idx" ON "plugin_routes"("path");

-- CreateIndex
CREATE UNIQUE INDEX "plugin_routes_pluginId_path_method_key" ON "plugin_routes"("pluginId", "path", "method");

-- CreateIndex
CREATE INDEX "plugin_menu_items_pluginId_idx" ON "plugin_menu_items"("pluginId");

-- CreateIndex
CREATE INDEX "plugin_menu_items_position_idx" ON "plugin_menu_items"("position");

-- CreateIndex
CREATE INDEX "plugin_logs_pluginId_idx" ON "plugin_logs"("pluginId");

-- CreateIndex
CREATE INDEX "plugin_logs_action_idx" ON "plugin_logs"("action");

-- CreateIndex
CREATE INDEX "plugin_logs_status_idx" ON "plugin_logs"("status");

-- CreateIndex
CREATE INDEX "plugin_logs_createdAt_idx" ON "plugin_logs"("createdAt");

-- CreateIndex
CREATE INDEX "plugin_conflicts_plugin1Id_idx" ON "plugin_conflicts"("plugin1Id");

-- CreateIndex
CREATE INDEX "plugin_conflicts_plugin2Id_idx" ON "plugin_conflicts"("plugin2Id");

-- CreateIndex
CREATE INDEX "plugin_conflicts_resolved_idx" ON "plugin_conflicts"("resolved");

-- AddForeignKey
ALTER TABLE "plugin_routes" ADD CONSTRAINT "plugin_routes_pluginId_fkey" FOREIGN KEY ("pluginId") REFERENCES "plugins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plugin_menu_items" ADD CONSTRAINT "plugin_menu_items_pluginId_fkey" FOREIGN KEY ("pluginId") REFERENCES "plugins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plugin_logs" ADD CONSTRAINT "plugin_logs_pluginId_fkey" FOREIGN KEY ("pluginId") REFERENCES "plugins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plugin_logs" ADD CONSTRAINT "plugin_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
