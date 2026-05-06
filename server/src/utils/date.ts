
export const now = () => Date.now()

export const oneDayFromNow = () => new Date(Date.now() + 24 * 60 * 60 * 1000);

export const sevenDaysFromNow = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);