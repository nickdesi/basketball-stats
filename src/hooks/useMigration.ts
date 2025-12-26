import { useEffect, useState, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuthStore } from '../store/authStore';
import { useFirebaseSync } from './useFirebaseSync';
import type { Player, CompletedGame } from '../store/gameStore';

const MIGRATION_KEY = 'hoop-stats-migration-complete';
const LOCAL_STORAGE_KEY = 'hoop-stats-storage';

/**
 * Hook to handle one-time migration of local storage data to Firebase.
 * Only runs when:
 * 1. User is authenticated
 * 2. Migration hasn't been done before
 * 3. There's local data to migrate
 * 4. Firestore is empty
 */
export function useMigration() {
    const { user } = useAuthStore();
    const { migrateLocalDataToFirestore } = useFirebaseSync();
    const [isMigrating, setIsMigrating] = useState(false);
    const [migrationComplete, setMigrationComplete] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check if migration is needed
    const checkAndMigrate = useCallback(async () => {
        // Skip if not authenticated
        if (!user) return;

        // Check if migration was already done
        if (localStorage.getItem(MIGRATION_KEY) === 'true') {
            setMigrationComplete(true);
            return;
        }

        // Get local data from Zustand persist storage
        const localDataRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!localDataRaw) {
            // No local data to migrate
            localStorage.setItem(MIGRATION_KEY, 'true');
            setMigrationComplete(true);
            return;
        }

        try {
            const localData = JSON.parse(localDataRaw);
            const state = localData.state;

            const localPlayers: Player[] = state?.players || [];
            const localGames: CompletedGame[] = state?.history || [];

            // Check if there's anything to migrate
            if (localPlayers.length === 0 && localGames.length === 0) {
                localStorage.setItem(MIGRATION_KEY, 'true');
                setMigrationComplete(true);
                return;
            }

            // Check if Firestore already has data (don't overwrite)
            const playersSnapshot = await getDocs(collection(db, 'players'));
            const gamesSnapshot = await getDocs(collection(db, 'games'));

            if (playersSnapshot.size > 0 || gamesSnapshot.size > 0) {
                // Firestore already has data, skip migration

                localStorage.setItem(MIGRATION_KEY, 'true');
                setMigrationComplete(true);
                return;
            }

            // Perform migration
            setIsMigrating(true);


            await migrateLocalDataToFirestore(localPlayers, localGames);

            // Mark migration as complete
            localStorage.setItem(MIGRATION_KEY, 'true');
            setMigrationComplete(true);
            console.log('Migration complete!');

        } catch (err) {
            console.error('Migration error:', err);
            setError(err instanceof Error ? err.message : 'Erreur lors de la migration');
        } finally {
            setIsMigrating(false);
        }
    }, [user, migrateLocalDataToFirestore]);

    // Run migration check on mount
    useEffect(() => {
        checkAndMigrate();
    }, [checkAndMigrate]);

    return {
        isMigrating,
        migrationComplete,
        error,
        retryMigration: checkAndMigrate,
    };
}
