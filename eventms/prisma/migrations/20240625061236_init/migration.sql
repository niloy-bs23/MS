-- CreateTable
CREATE TABLE "Events" (
    "eventId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "organizerId" TEXT NOT NULL,
    "availability" BOOLEAN NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("eventId")
);
