export function getRandomUUID(startsWithLetter: boolean, startsWithNumber: boolean, removeDashes: boolean): string {
  let uuid: string = crypto.randomUUID();

  while (startsWithLetter && !/^[A-Za-z]/.test(uuid)) {
    uuid = crypto.randomUUID();
  }

  while (startsWithNumber && !/^[0-9]/.test(uuid)) {
    uuid = crypto.randomUUID();
  }

  return removeDashes ? uuid.replace(/-/g, '') : uuid;
}

export function generateUUIDs(count: number, startsWithLetter: boolean, startsWithNumber: boolean): string[] {
  const uuids: string[] = [];
  while (uuids.length < count) {
    uuids.push(getRandomUUID(startsWithLetter, startsWithNumber, false));
  }
  return uuids;
}
