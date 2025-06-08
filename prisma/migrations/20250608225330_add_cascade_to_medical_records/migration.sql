-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_medical_records" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patientId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diagnosis" TEXT NOT NULL,
    "prescription" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "medical_records_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "medical_records_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_medical_records" ("createdAt", "date", "diagnosis", "doctorId", "id", "notes", "patientId", "prescription", "updatedAt") SELECT "createdAt", "date", "diagnosis", "doctorId", "id", "notes", "patientId", "prescription", "updatedAt" FROM "medical_records";
DROP TABLE "medical_records";
ALTER TABLE "new_medical_records" RENAME TO "medical_records";
CREATE INDEX "medical_records_patientId_idx" ON "medical_records"("patientId");
CREATE INDEX "medical_records_doctorId_idx" ON "medical_records"("doctorId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
