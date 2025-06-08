-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_admins" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "accessCode" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_admins" ("accessCode", "createdAt", "id", "updatedAt", "userId") SELECT "accessCode", "createdAt", "id", "updatedAt", "userId" FROM "admins";
DROP TABLE "admins";
ALTER TABLE "new_admins" RENAME TO "admins";
CREATE UNIQUE INDEX "admins_accessCode_key" ON "admins"("accessCode");
CREATE UNIQUE INDEX "admins_userId_key" ON "admins"("userId");
CREATE TABLE "new_attendants" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "accessCode" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "attendants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_attendants" ("accessCode", "createdAt", "id", "updatedAt", "userId") SELECT "accessCode", "createdAt", "id", "updatedAt", "userId" FROM "attendants";
DROP TABLE "attendants";
ALTER TABLE "new_attendants" RENAME TO "attendants";
CREATE UNIQUE INDEX "attendants_userId_key" ON "attendants"("userId");
CREATE UNIQUE INDEX "attendants_accessCode_key" ON "attendants"("accessCode");
CREATE TABLE "new_doctors" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "specialty" TEXT NOT NULL,
    "crm" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "doctors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_doctors" ("createdAt", "crm", "id", "specialty", "updatedAt", "userId") SELECT "createdAt", "crm", "id", "specialty", "updatedAt", "userId" FROM "doctors";
DROP TABLE "doctors";
ALTER TABLE "new_doctors" RENAME TO "doctors";
CREATE UNIQUE INDEX "doctors_userId_key" ON "doctors"("userId");
CREATE UNIQUE INDEX "doctors_crm_key" ON "doctors"("crm");
CREATE TABLE "new_patients" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "bloodType" TEXT,
    "allergies" TEXT,
    "medications" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "patients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_patients" ("allergies", "bloodType", "createdAt", "id", "medications", "updatedAt", "userId") SELECT "allergies", "bloodType", "createdAt", "id", "medications", "updatedAt", "userId" FROM "patients";
DROP TABLE "patients";
ALTER TABLE "new_patients" RENAME TO "patients";
CREATE UNIQUE INDEX "patients_userId_key" ON "patients"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
