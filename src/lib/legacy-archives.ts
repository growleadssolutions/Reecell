import migration from '../data/legacy-migration.json';
export const legacyArchives = migration.entries.filter(entry =>
  entry.treatment === 'preservada' && entry.memberPaths?.length,
);
