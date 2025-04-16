/*
  Warnings:

  - You are about to drop the column `department` on the `attendants` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `attendants` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_attendants" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "attendants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_attendants" ("createdAt", "id", "updatedAt", "userId") SELECT "createdAt", "id", "updatedAt", "userId" FROM "attendants";
DROP TABLE "attendants";
ALTER TABLE "new_attendants" RENAME TO "attendants";
CREATE UNIQUE INDEX "attendants_userId_key" ON "attendants"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
