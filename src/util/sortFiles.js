export function sortFiles(files) {
  return files.sort((a, b) => {
    if (a.createdAt > b.createdAt) return -1;
    if (a.createdAt < b.createdAt) return 1;
    if (a.createdAt === b.createdAt) return 0;
  });
}
