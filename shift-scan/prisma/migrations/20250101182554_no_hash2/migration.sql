-- CreateEnum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'FormType') THEN
    CREATE TYPE "FormType" AS ENUM ('MEDICAL', 'INSPECTION', 'MANAGER', 'LEAVE', 'SAFETY', 'INJURY');
  END IF;
END $$;

-- CreateEnum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TimeOffRequestType') THEN
    CREATE TYPE "TimeOffRequestType" AS ENUM ('FAMILY_MEDICAL', 'MILITARY', 'PAID_VACATION', 'NON_PAID_PERSONAL', 'SICK');
  END IF;
END $$;

-- CreateEnum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Permission') THEN
    CREATE TYPE "Permission" AS ENUM ('USER', 'MANAGER', 'ADMIN', 'SUPERADMIN');
  END IF;
END $$;

-- CreateEnum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'EquipmentTags') THEN
    CREATE TYPE "EquipmentTags" AS ENUM ('TRUCK', 'TRAILER', 'EQUIPMENT', 'VEHICLE');
  END IF;
END $$;

-- CreateEnum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'EquipmentStatus') THEN
    CREATE TYPE "EquipmentStatus" AS ENUM ('OPERATIONAL', 'NEEDS_REPAIR', 'NEEDS_MAINTENANCE');
  END IF;
END $$;

-- CreateEnum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'FormStatus') THEN
    CREATE TYPE "FormStatus" AS ENUM ('PENDING', 'APPROVED', 'DENIED', 'TEMPORARY');
  END IF;
END $$;

-- CreateEnum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'IsActive') THEN
    CREATE TYPE "IsActive" AS ENUM ('ACTIVE', 'INACTIVE');
  END IF;
END $$;

-- CreateEnum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'WorkType') THEN
    CREATE TYPE "WorkType" AS ENUM ('MECHANIC', 'TRUCK_DRIVER', 'LABOR', 'TASCO');
  END IF;
END $$;

-- CreateEnum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Priority') THEN
    CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
  END IF;
END $$;

-- CreateTable