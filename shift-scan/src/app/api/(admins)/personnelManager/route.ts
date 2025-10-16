import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { Permission } from "../../../../../prisma/generated/prisma";

export const dynamic = "force-dynamic";

interface FilterConditions {
  permission?: Permission | { in: string[] };
  accountSetup?: boolean | { in: boolean[] };
  hasCrews?: boolean;
  accessLevelConditions?: Array<{
    truckView?: boolean;
    tascoView?: boolean;
    mechanicView?: boolean;
    laborView?: boolean;
  }>;
}

export async function GET(req: Request) {
  try {
    // Authenticate the user
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query params for pagination
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";
    const search = searchParams.get("search")?.trim() || "";
    
    // Parse filter parameters
    const rolesParam = searchParams.get("roles");
    const accessLevelParam = searchParams.get("accessLevel");
    const accountSetupParam = searchParams.get("accountSetup");
    const crewsParam = searchParams.get("crews");
    
    const roles = rolesParam ? rolesParam.split(',') : [];
    const accessLevels = accessLevelParam ? accessLevelParam.split(',') : [];
    const accountSetupValues = accountSetupParam ? accountSetupParam.split(',') : [];
    const crewsValues = crewsParam ? crewsParam.split(',') : [];

    // Build filter conditions
    const buildFilterConditions = (): FilterConditions => {
      const conditions: FilterConditions = {};
      
      // Role filter
      if (roles.length > 0) {
        conditions.permission = { in: roles };
      }
      
      // Access level filter - handle multiple access levels
      if (accessLevels.length > 0) {
        const accessConditions = [];
        if (accessLevels.includes('truckView')) {
          accessConditions.push({ truckView: true });
        }
        if (accessLevels.includes('tascoView')) {
          accessConditions.push({ tascoView: true });
        }
        if (accessLevels.includes('mechanicView')) {
          accessConditions.push({ mechanicView: true });
        }
        if (accessLevels.includes('laborView')) {
          accessConditions.push({ laborView: true });
        }
        if (accessConditions.length > 0) {
          conditions.accessLevelConditions = accessConditions;
        }
      }
      
      // Account setup filter
      if (accountSetupValues.length > 0) {
        // Convert string values to boolean and ensure they're valid
        const booleanValues = [];
        for (const val of accountSetupValues) {
          if (val === 'true') {
            booleanValues.push(true);
          } else if (val === 'false') {
            booleanValues.push(false);
          }
        }
        
        if (booleanValues.length > 0) {
          if (booleanValues.length === 1) {
            // Single value filter
            conditions.accountSetup = booleanValues[0];
          } else {
            // Multiple values filter
            conditions.accountSetup = { in: booleanValues };
          }
        }
      }
      
      // Crews filter
      if (crewsValues.length > 0) {
        if (crewsValues.includes('hasCrews') && !crewsValues.includes('noCrews')) {
          // Only "Has Crews" selected
          conditions.hasCrews = true;
        } else if (crewsValues.includes('noCrews') && !crewsValues.includes('hasCrews')) {
          // Only "No Crews" selected
          conditions.hasCrews = false;
        }
        // If both are selected or neither, don't apply any crew filter (show all)
      }
      
      return conditions;
    };

    const filterConditions = buildFilterConditions();

    let users, total, pageSize, page, skip, totalPages;

    if (status === "inactive") {
      page = undefined;
      pageSize = undefined;
      skip = undefined;
      totalPages = 1;
      
      const whereCondition: Record<string, unknown> = {
        terminationDate: {
          not: null,
        },
      };
      
      // Add basic filter conditions
      if (filterConditions.permission) {
        whereCondition.permission = filterConditions.permission;
      }
      if (filterConditions.accountSetup !== undefined) {
        whereCondition.accountSetup = filterConditions.accountSetup;
      }
      if (filterConditions.hasCrews !== undefined) {
        if (filterConditions.hasCrews) {
          whereCondition.Crews = {
            some: {},
          };
        } else {
          whereCondition.Crews = {
            none: {},
          };
        }
      }
      
      // Handle OR conditions for search and access levels
      if (search || filterConditions.accessLevelConditions) {
        const searchConditions: Record<string, unknown>[] = [];
        const accessConditions = filterConditions.accessLevelConditions || [];
        
        if (search) {
          searchConditions.push(
            { username: { contains: search, mode: "insensitive" } },
            { firstName: { contains: search, mode: "insensitive" } },
            { middleName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { secondLastName: { contains: search, mode: "insensitive" } },
            {
              Contact: {
                phoneNumber: { contains: search, mode: "insensitive" },
              },
            }
          );
        }
        
        if (search && accessConditions.length > 0) {
          // Both search and access level filters
          whereCondition.AND = [
            { OR: searchConditions },
            { OR: accessConditions }
          ];
        } else if (searchConditions.length > 0) {
          // Only search
          whereCondition.OR = searchConditions;
        } else if (accessConditions.length > 0) {
          // Only access level
          whereCondition.OR = accessConditions;
        }
      }

      users = await prisma.user.findMany({
        where: whereCondition,
        select: {
          id: true,
          username: true,
          firstName: true,
          middleName: true,
          lastName: true,
          secondLastName: true,
          image: true,
          email: true,
          DOB: true,
          terminationDate: true,
          accountSetup: true,
          permission: true,
          truckView: true,
          tascoView: true,
          mechanicView: true,
          laborView: true,
          Crews: {
            select: {
              id: true,
              name: true,
              leadId: true,
            },
          },
          Contact: {
            select: {
              phoneNumber: true,
              emergencyContact: true,
              emergencyContactNumber: true,
            },
          },
        },
        orderBy: {
          lastName: "asc",
        },
      });
      total = users.length;
    } else {
      page = parseInt(searchParams.get("page") || "1", 10);
      pageSize = parseInt(searchParams.get("pageSize") || "25", 10);
      skip = (page - 1) * pageSize;
      
      const whereCondition: Record<string, unknown> = {
        terminationDate: null,
      };
      
      // Add basic filter conditions
      if (filterConditions.permission) {
        whereCondition.permission = filterConditions.permission;
      }
      if (filterConditions.accountSetup !== undefined) {
        whereCondition.accountSetup = filterConditions.accountSetup;
      }
      if (filterConditions.hasCrews !== undefined) {
        if (filterConditions.hasCrews) {
          whereCondition.Crews = {
            some: {},
          };
        } else {
          whereCondition.Crews = {
            none: {},
          };
        }
      }
      
      // Handle OR conditions for search and access levels
      if (search || filterConditions.accessLevelConditions) {
        const searchConditions: Record<string, unknown>[] = [];
        const accessConditions = filterConditions.accessLevelConditions || [];
        
        if (search) {
          searchConditions.push(
            { username: { contains: search, mode: "insensitive" } },
            { firstName: { contains: search, mode: "insensitive" } },
            { middleName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { secondLastName: { contains: search, mode: "insensitive" } },
            {
              Contact: {
                phoneNumber: { contains: search, mode: "insensitive" },
              },
            }
          );
        }
        
        if (search && accessConditions.length > 0) {
          // Both search and access level filters
          whereCondition.AND = [
            { OR: searchConditions },
            { OR: accessConditions }
          ];
        } else if (searchConditions.length > 0) {
          // Only search
          whereCondition.OR = searchConditions;
        } else if (accessConditions.length > 0) {
          // Only access level
          whereCondition.OR = accessConditions;
        }
      }
      
      // Count for pagination
      total = await prisma.user.count({
        where: whereCondition,
      });
      totalPages = Math.ceil(total / pageSize);
      
      users = await prisma.user.findMany({
        where: whereCondition,
        select: {
          id: true,
          username: true,
          firstName: true,
          middleName: true,
          lastName: true,
          secondLastName: true,
          image: true,
          email: true,
          DOB: true,
          terminationDate: true,
          accountSetup: true,
          permission: true,
          truckView: true,
          tascoView: true,
          mechanicView: true,
          laborView: true,
          Crews: {
            select: {
              id: true,
              name: true,
              leadId: true,
            },
          },
          Contact: {
            select: {
              phoneNumber: true,
              emergencyContact: true,
              emergencyContactNumber: true,
            },
          },
        },
        orderBy: {
          lastName: "asc",
        },
        skip,
        take: pageSize,
      });
    }

    // Post-process to add crew lead names
    const userIds = new Set<string>();
    users.forEach(user => {
      user.Crews?.forEach(crew => {
        if (crew.leadId) {
          userIds.add(crew.leadId);
        }
      });
    });

    const crewLeads = await prisma.user.findMany({
      where: {
        id: {
          in: Array.from(userIds),
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    const leadMap = new Map<string, string>();
    crewLeads.forEach(lead => {
      leadMap.set(lead.id, `${lead.firstName} ${lead.lastName}`);
    });

    // Add lead names to crews
    const usersWithCrewLeads = users.map(user => ({
      ...user,
      Crews: user.Crews?.map(crew => ({
        ...crew,
        leadName: leadMap.get(crew.leadId) || 'Unknown',
      })),
    }));

    return NextResponse.json({
      users: usersWithCrewLeads,
      total,
      page,
      pageSize,
      totalPages,
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching user summary:", error);
    
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch personnel summary";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
