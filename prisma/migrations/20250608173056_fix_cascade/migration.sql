-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_appointments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patientId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "attendantId" INTEGER,
    "date" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reason" TEXT,
    "notes" TEXT,
    "duration" INTEGER NOT NULL DEFAULT 30,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "appointments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "appointments_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "appointments_attendantId_fkey" FOREIGN KEY ("attendantId") REFERENCES "attendants" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_appointments" ("attendantId", "createdAt", "date", "doctorId", "duration", "id", "notes", "patientId", "reason", "status", "updatedAt") SELECT "attendantId", "createdAt", "date", "doctorId", "duration", "id", "notes", "patientId", "reason", "status", "updatedAt" FROM "appointments";
DROP TABLE "appointments";
ALTER TABLE "new_appointments" RENAME TO "appointments";
CREATE INDEX "appointments_patientId_idx" ON "appointments"("patientId");
CREATE INDEX "appointments_doctorId_idx" ON "appointments"("doctorId");
CREATE INDEX "appointments_attendantId_idx" ON "appointments"("attendantId");
CREATE INDEX "appointments_date_idx" ON "appointments"("date");
CREATE INDEX "appointments_status_idx" ON "appointments"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
