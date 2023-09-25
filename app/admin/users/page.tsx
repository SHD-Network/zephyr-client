'use client';
import { userController } from '@/lib/api';
import { statusController } from '@/lib/api/StatusController';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { TbEye, TbPencil } from 'react-icons/tb';
import { ListUsersResponse } from '@/@types/lib/api/UserControllerTypes';
import {
  ActionIcon,
  Divider,
  Flex,
  Stack,
  Switch,
  Table,
  Title,
  Tooltip,
} from '@mantine/core';
import { useClipboard } from '@mantine/hooks';

function Users() {
  const clipboard = useClipboard({ timeout: 500 });
  const [settings, setSettings] = useState({
    allowInvite: false,
    allowRegistration: false,
  });
  const [allUsers, setAllUsers] = useState<ListUsersResponse>();

  const loadPage = useCallback(async () => {
    loadAccountSettings();
    fetchUsers();
  }, []);

  async function loadAccountSettings() {
    const settingsData = await statusController.getAccountSettings();
    setSettings(settingsData);
  }

  async function updateSettings(key: string, value: boolean) {
    const updatedSettings = await statusController.updateAccountSettings(
      key,
      value,
    );
    setSettings(updatedSettings);
  }

  async function fetchUsers() {
    const users = await userController.listUsers();
    setAllUsers(users);
  }

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  return (
    <Stack>
      <Setting
        name="Allow registration invites"
        keyValue="allowInvite"
        status={settings.allowInvite}
        onChange={updateSettings}
      />
      <Setting
        name="Allow anyone to register"
        keyValue="allowRegistration"
        status={settings.allowRegistration}
        onChange={updateSettings}
      />
      <Divider />
      <Flex align="center" justify="space-between">
        <Title order={3}>All users</Title>
      </Flex>
      <Table striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>User ID</Table.Th>
            <Table.Th>Username</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {allUsers?.users.map((user, index) => {
            return (
              <Table.Tr key={index}>
                <Tooltip
                  position="top-start"
                  label={clipboard.copied ? 'Copied!' : 'Click to copy'}
                >
                  <Table.Td
                    onClick={() => clipboard.copy(user.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {user.id}
                  </Table.Td>
                </Tooltip>
                <Tooltip
                  position="top-start"
                  label={clipboard.copied ? 'Copied!' : 'Click to copy'}
                >
                  <Table.Td
                    onClick={() => clipboard.copy(user.username)}
                    style={{ cursor: 'pointer' }}
                  >
                    {user.username}
                  </Table.Td>
                </Tooltip>
                <Tooltip
                  position="top-start"
                  label={clipboard.copied ? 'Copied!' : 'Click to copy'}
                >
                  <Table.Td
                    onClick={() => clipboard.copy(user.email)}
                    style={{ cursor: 'pointer' }}
                  >
                    {user.email}
                  </Table.Td>
                </Tooltip>
                <Table.Td>
                  <Flex align="center" style={{ gap: '5px' }}>
                    <Tooltip label="View user">
                      <Link href={`/admin/users/${user.id}`}>
                        <ActionIcon>
                          <TbEye />
                        </ActionIcon>
                      </Link>
                    </Tooltip>
                    <Tooltip label="Edit user">
                      <Link href={`/admin/users/${user.id}/edit`}>
                        <ActionIcon>
                          <TbPencil />
                        </ActionIcon>
                      </Link>
                    </Tooltip>
                  </Flex>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Stack>
  );
}

type SettingProps = {
  name: string;
  keyValue: string;
  status: boolean;
  onChange: (keyValue: string, status: boolean) => void;
};

function Setting({ name, status, onChange, keyValue }: SettingProps) {
  return (
    <Flex align="center" gap="md">
      <Title order={4}>{name}</Title>
      <Switch checked={status} onChange={() => onChange(keyValue, !status)} />
    </Flex>
  );
}

export default Users;
