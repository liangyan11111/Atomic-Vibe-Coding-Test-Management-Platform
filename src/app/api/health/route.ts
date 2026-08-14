import { NextResponse } from 'next/server';
import { getTestCaseRepository, getDefectRepository, getTestPlanRepository } from '@/infrastructure/repositories';

export async function GET() {
  try {
    const tcRepo = getTestCaseRepository();
    const defRepo = getDefectRepository();
    const tpRepo = getTestPlanRepository();

    const [tcResult, defResult, tpResult] = await Promise.all([
      tcRepo.findByQuery({ page: 1, pageSize: 1, sortBy: 'createdAt', sortOrder: 'desc' }),
      defRepo.findByQuery({ page: 1, pageSize: 1 }),
      tpRepo.findByQuery({ page: 1, pageSize: 1 }),
    ]);

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        repositories: 'initialized',
      },
      stats: {
        testCases: tcResult.total,
        defects: defResult.total,
        testPlans: tpResult.total,
      },
    });
  } catch {
    return NextResponse.json({ status: 'unhealthy', timestamp: new Date().toISOString() }, { status: 503 });
  }
}
