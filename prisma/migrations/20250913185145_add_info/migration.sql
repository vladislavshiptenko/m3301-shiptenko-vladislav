-- CreateEnum
CREATE TYPE "public"."District" AS ENUM ('October', 'Soviet', 'Leninsky', 'Kirovsky', 'Seversk', 'Other');

-- CreateEnum
CREATE TYPE "public"."Condition" AS ENUM ('PartTime', 'Shift', 'NightShift', 'Watch', 'FullTime', 'Remote', 'NotFullTime', 'Flexible');

-- CreateEnum
CREATE TYPE "public"."Education" AS ENUM ('Secondary', 'SecondarySpecialized', 'Higher', 'Student');

-- AlterTable
ALTER TABLE "public"."resume" ADD COLUMN     "condition" "public"."Condition" NOT NULL DEFAULT 'FullTime',
ADD COLUMN     "district" "public"."District" NOT NULL DEFAULT 'October',
ADD COLUMN     "education" "public"."Education" NOT NULL DEFAULT 'Higher';

-- AlterTable
ALTER TABLE "public"."vacancies" ADD COLUMN     "condition" "public"."Condition" NOT NULL DEFAULT 'FullTime',
ADD COLUMN     "district" "public"."District" NOT NULL DEFAULT 'October',
ADD COLUMN     "education" "public"."Education" NOT NULL DEFAULT 'Higher';
