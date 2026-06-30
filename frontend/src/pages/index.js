import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";

export default function Home() {
  const router = useRouter()

  return (
    <UserLayout>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <span className={styles.badge}>Professional networking, reimagined</span>
            <h1 className={styles.headline}>
              Build meaningful connections without the noise
            </h1>
            <p className={styles.subheadline}>
              A focused social platform for professionals who value authentic relationships, career growth, and real conversations.
            </p>
            <div className={styles.ctaGroup}>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={() => router.push("/login")}
              >
                Get started — it&apos;s free
              </button>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => router.push("/login")}
              >
                Sign in
              </button>
            </div>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>10K+</span>
                <span className={styles.statLabel}>Professionals</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statNumber}>50K+</span>
                <span className={styles.statLabel}>Connections made</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statNumber}>100+</span>
                <span className={styles.statLabel}>Industries</span>
              </div>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.visualCard}>
              <div className={styles.visualHeader}>
                <div className={styles.visualAvatar} />
                <div className={styles.visualLines}>
                  <div className={styles.visualLine} style={{ width: '60%' }} />
                  <div className={styles.visualLine} style={{ width: '40%' }} />
                </div>
              </div>
              <div className={styles.visualBody}>
                <div className={styles.visualLine} style={{ width: '100%' }} />
                <div className={styles.visualLine} style={{ width: '85%' }} />
                <div className={styles.visualLine} style={{ width: '70%' }} />
              </div>
              <div className={styles.visualActions}>
                <div className={styles.visualAction} />
                <div className={styles.visualAction} />
                <div className={styles.visualAction} />
              </div>
            </div>
            <div className={styles.visualCardSecondary}>
              <div className={styles.visualHeader}>
                <div className={styles.visualAvatarSmall} />
                <div className={styles.visualLines}>
                  <div className={styles.visualLine} style={{ width: '50%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
