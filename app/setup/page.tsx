'use client';
import { Window, Button } from '@/components';
import styles from '@/styles/Pages/Setup.module.scss';
import { useRouter } from 'next/navigation';
import { TbArrowNarrowRight } from 'react-icons/tb';

function SetupSplash() {
  const router = useRouter();
  function handleClick() {
    router.push('/setup/account');
  }

  return (
    <section className={styles.setupPage}>
      <div className={styles.content}>
        <div className={styles.titleWrapper}>
          <Window>
            <h1>Welcome to Zephyr</h1>
          </Window>
        </div>
        <div className={styles.buttonWrapper}>
          <Button
            label="Create your account"
            icon={<TbArrowNarrowRight size={20} />}
            onClick={handleClick}
          />
        </div>
      </div>
    </section>
  );
}

export default SetupSplash;
