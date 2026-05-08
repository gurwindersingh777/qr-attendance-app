
export const now = () => new Date();

export const oneDayFromNow = () => new Date(Date.now() + 24 * 60 * 60 * 1000);

export const sevenDaysFromNow = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

export const sessionEndTime = (duration: number) =>new Date(Date.now() + duration * 60 * 1000);

export const oneDayAgo = () => new Date(Date.now() - 24 * 60 * 60 * 1000);