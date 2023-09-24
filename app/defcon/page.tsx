'use client';

import { Defcon } from '@/components';
import { defconController } from '@/lib/api/DefconController';
import useSWR from 'swr';

function DefconPage() {
  const { data: overall, isLoading: overallLoading } = useSWR(
    defconController.SWR.getOverallLevel,
    () => defconController.getOverallLevel(),
  );
  const { data: africa, isLoading: africaLoading } = useSWR(
    defconController.SWR.getAfricaLevel,
    () => defconController.getAfricaLevel(),
  );
  const { data: mideast, isLoading: mideastLoading } = useSWR(
    defconController.SWR.getMideastLevel,
    () => defconController.getMideastLevel(),
  );
  const { data: cyber, isLoading: cyberLoading } = useSWR(
    defconController.SWR.getCyberLevel,
    () => defconController.getCyberLevel(),
  );
  const { data: europe, isLoading: europeLoading } = useSWR(
    defconController.SWR.getEuropeLevel,
    () => defconController.getCyberLevel(),
  );
  const { data: asia, isLoading: asiaLoading } = useSWR(
    defconController.SWR.getAsiaLevel,
    () => defconController.getAsiaLevel(),
  );
  const { data: usa, isLoading: usaLoading } = useSWR(
    defconController.SWR.getUsaLevel,
    () => defconController.getUsaLevel(),
  );
  const { data: latam, isLoading: latamLoading } = useSWR(
    defconController.SWR.getLatamLevel,
    () => defconController.getLatamLevel(),
  );
  const { data: space, isLoading: spaceLoading } = useSWR(
    defconController.SWR.getSpaceLevel,
    () => defconController.getSpaceLevel(),
  );
  const { data: specOps, isLoading: specOpsLoading } = useSWR(
    defconController.SWR.getSpecOpsLevel,
    () => defconController.getSpecOpsLevel(),
  );

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {!overallLoading && (
        <Defcon level={overall.level} size={200} label="defcon" />
      )}

      {!africaLoading && (
        <Defcon level={africa.level} size={200} label="africa" />
      )}

      {!mideastLoading && (
        <Defcon level={mideast.level} size={200} label="mideast" />
      )}

      {!cyberLoading && <Defcon level={cyber.level} size={200} label="cyber" />}

      {!europeLoading && (
        <Defcon level={europe.level} size={200} label="europe" />
      )}

      {!asiaLoading && <Defcon level={asia.level} size={200} label="asia" />}

      {!usaLoading && <Defcon level={usa.level} size={200} label="usa" />}

      {!latamLoading && <Defcon level={latam.level} size={200} label="latam" />}

      {!spaceLoading && <Defcon level={space.level} size={200} label="space" />}

      {!specOpsLoading && (
        <Defcon level={specOps.level} size={200} label="specOps" />
      )}
    </div>
  );
}

export default DefconPage;
