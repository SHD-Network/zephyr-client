'use client';
import { PublicKey } from '@/@types/lib/api/UserControllerTypes';
import { userController } from '@/lib/api';
import styles from '@/styles/Layouts/MessagesLayout.module.scss';
import { useState } from 'react';
import { TbX } from 'react-icons/tb';

type NewMessageProps = {
  skipIntro?: boolean;
};

function NewMessage({ skipIntro = false }: NewMessageProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [intro, setIntro] = useState(!skipIntro);
  const [recipients, setRecipients] = useState<
    {
      id: string;
      name: string | null;
      username: string;
      publicKey: {
        keyValue: {
          data: ArrayBuffer;
        };
      };
    }[]
  >([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userSearchResults, setUserSearchResults] = useState<
    ({
      id: string;
      name: string | null;
      username: string;
    } & PublicKey)[]
  >([]);

  function addRecipient(user: {
    id: string;
    name: string | null;
    username: string;
    publicKey: {
      keyValue: {
        data: ArrayBuffer;
      };
    };
  }) {
    console.log(user);
    const newRecipients = [...recipients, user];
    setRecipients(newRecipients);
  }

  function removeRecipient(id: string) {
    const currentRecipients = [...recipients];
    const newRecipients = currentRecipients.filter((recipient) => {
      return recipient.id !== id;
    });
    setRecipients(newRecipients);
  }

  let timer: any;
  const timeoutVal = 500;

  async function searchUsers() {
    if (userSearchTerm === '') {
      setUserSearchResults([]);
      return;
    }

    const searchResults = await userController.searchUsers(userSearchTerm);
    setUserSearchResults(searchResults.users);
  }

  function keyUpHandler() {
    window.clearTimeout(timer);
    timer = setTimeout(() => {
      searchUsers();
    }, timeoutVal);
  }

  function keyDownHandler() {
    window.clearTimeout(timer);
  }

  return intro ? (
    <div className={`${styles.messagesLayout} ${styles.empty}`}>
      You have no messages
      <p onClick={() => setIntro(false)}>Start a conversation</p>
    </div>
  ) : (
    <div className={`${styles.messagesLayout} ${styles.empty}`}>
      <div className={styles.newMessage}>
        <div className={styles.recipients}>
          {recipients.map((recipient) => (
            <div key={recipient.id} className={styles.chip}>
              {recipient.username}
              <div
                className={styles.remove}
                onClick={() => removeRecipient(recipient.id)}
              >
                <TbX size={12} />
              </div>
            </div>
          ))}
          <input
            type="text"
            placeholder="Start typing a username..."
            value={userSearchTerm}
            onChange={(e) => setUserSearchTerm(e.target.value)}
            onKeyUp={keyUpHandler}
            onKeyDown={keyDownHandler}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {userSearchResults.length > 0 && searchFocused ? (
            <UserSearchResults
              results={userSearchResults}
              onClick={addRecipient}
            />
          ) : null}
        </div>
        <div className={styles.messageWindow} />
        <div className={styles.messageInput}>
          <textarea></textarea>
        </div>
      </div>
    </div>
  );
}

type UserSearchResultsProps = {
  results: ({
    id: string;
    name: string | null;
    username: string;
  } & PublicKey)[];
  onClick: (user: {
    id: string;
    name: string | null;
    username: string;
    publicKey: {
      keyValue: {
        data: ArrayBuffer;
      };
    };
  }) => void;
};

function UserSearchResults({ results, onClick }: UserSearchResultsProps) {
  return (
    <div className={styles.searchResults}>
      {results.map((result, index) => {
        return (
          <div
            key={index}
            className={styles.result}
            onClick={() => onClick(result)}
          >
            @{result.username}
          </div>
        );
      })}
    </div>
  );
}

export default NewMessage;
