'use client';
import { Toggle } from '@/components';
import { statusController } from '@/lib/api/StatusController';
import { useAppSettings } from '@/redux';
import styles from '@/styles/Pages/Admin.module.scss';
import { Flex, Stack, Switch, Title } from '@mantine/core';
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
    <Stack gap="xs">
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
    </Stack>
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
    <Flex
      w="100%"
      align="center"
      justify="space-between"
      bg="dark"
      px="md"
      py="sm"
    >
      <Title order={4}>{name}</Title>
      <Switch checked={status} onChange={() => onChange(keyValue, !status)} />
    </Flex>
  );
}

export default Modules;
