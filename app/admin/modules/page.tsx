'use client';
import { Toggle } from '@/components';
import { statusController } from '@/lib/api/StatusController';
import { useAppSettings } from '@/redux';
import styles from '@/styles/Pages/Admin.module.scss';
import { useCallback, useEffect } from 'react';

function Modules() {
  const modules = useAppSettings((state) => state.modules);
  const setModules = useAppSettings((state) => state.setModules);

  const loadPage = useCallback(async () => {
    const allModules = await statusController.getEnabledModules();
    setModules(allModules);
  }, [setModules]);

  async function toggleModule(module: string, value: boolean) {
    const updatedModules = await statusController.updateModule(module, value);
    setModules(updatedModules);
  }

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  return (
    <section className={styles.modules}>
      <Module
        name="Calendar"
        keyValue="calendar"
        status={modules.calendar}
        onChange={toggleModule}
      />
      <Module
        name="Crops"
        keyValue="crops"
        status={modules.crops}
        onChange={toggleModule}
      />
      <Module
        name="DEFCON"
        keyValue="defcon"
        status={modules.defcon}
        onChange={toggleModule}
      />
      <Module
        name="Documents"
        keyValue="documents"
        status={modules.documents}
        onChange={toggleModule}
      />
      <Module
        name="Home Monitoring"
        keyValue="home_monitoring"
        status={modules.home_monitoring}
        onChange={toggleModule}
      />
      <Module
        name="Inventory"
        keyValue="inventory"
        status={modules.inventory}
        onChange={toggleModule}
      />
      <Module
        name="Mail"
        keyValue="mail"
        status={modules.mail}
        onChange={toggleModule}
      />
      <Module
        name="Maps"
        keyValue="maps"
        status={modules.maps}
        onChange={toggleModule}
      />
      <Module
        name="Messages"
        keyValue="messages"
        status={modules.messages}
        onChange={toggleModule}
      />
      <Module
        name="News"
        keyValue="news"
        status={modules.news}
        onChange={toggleModule}
      />
      <Module
        name="Pricing"
        keyValue="pricing"
        status={modules.pricing}
        onChange={toggleModule}
      />
      <Module
        name="Security"
        keyValue="security"
        status={modules.security}
        onChange={toggleModule}
      />
      <Module
        name="Wiki"
        keyValue="wiki"
        status={modules.wiki}
        onChange={toggleModule}
      />
    </section>
  );
}

type ModuleProps = {
  name: string;
  keyValue: string;
  status: boolean;
  onChange: (keyValue: string, status: boolean) => void;
};

function Module({ name, status, onChange, keyValue }: ModuleProps) {
  return (
    <div className={styles.module}>
      <h3>{name}</h3>
      <Toggle value={status} onChange={() => onChange(keyValue, !status)} />
    </div>
  );
}

export default Modules;
