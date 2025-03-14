import prisma from '@/lib/prisma/client';

/**
 * Fetch all vessels with related data
 */
export async function getAllVessels() {
  try {
    const vessels = await prisma.vessel.findMany({
      include: {
        seller: {
          include: {
            user: true
          }
        },
        vendor: true,
        motors: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return vessels;
  } catch (error) {
    console.error('Failed to fetch vessels:', error);
    return [];
  }
}

/**
 * Get a single vessel by ID
 */
export async function getVesselById(id) {
  try {
    const vessel = await prisma.vessel.findUnique({
      where: { id },
      include: {
        seller: {
          include: {
            user: true
          }
        },
        vendor: true,
        motors: true
      }
    });
    return vessel;
  } catch (error) {
    console.error(`Failed to fetch vessel with id ${id}:`, error);
    return null;
  }
}

/**
 * Record a view event for a vessel
 */
export async function recordVesselView(vesselId, buyerId = null, metadata = {}) {
  try {
    const [viewEvent, updatedVessel] = await prisma.$transaction([
      // Create view event
      prisma.viewEvent.create({
        data: {
          vesselId,
          buyerId,
          ipAddress: metadata.ipAddress,
          userAgent: metadata.userAgent
        }
      }),
      // Increment vessel view count
      prisma.vessel.update({
        where: { id: vesselId },
        data: {
          views: {
            increment: 1
          }
        }
      })
    ]);
    return { viewEvent, updatedVessel };
  } catch (error) {
    console.error(`Failed to record view for vessel ${vesselId}:`, error);
    return null;
  }
} 