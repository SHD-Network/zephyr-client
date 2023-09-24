import { userController } from '@/lib/api';
import styles from '@/styles/Pages/Admin.module.scss';

async function ViewUser({ params }: { params: { userId: string } }) {
  const user = await userController.getUserById(params.userId);
  console.log(user);
  return <section className={styles.user}>{params.userId}</section>;
}

export default ViewUser;
